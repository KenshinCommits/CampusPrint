#!/bin/bash

# CampusPrint: Deploy Infrastructure with AWS CDK
# This script deploys the infrastructure using AWS CDK.
#
# Prerequisites:
# - AWS CDK CLI installed (npm install -g aws-cdk)
# - Node.js and npm installed
# - AWS CLI configured with credentials
# - Backend and frontend images already pushed to ECR
#
# Usage:
#   ./scripts/deploy-with-cdk.sh [action] [aws-region] [aws-account-id]
#
# Actions:
#   synth   - Synthesize CloudFormation template
#   diff    - Show deployment diff
#   deploy  - Deploy infrastructure
#   destroy - Destroy infrastructure
#
# Example:
#   ./scripts/deploy-with-cdk.sh synth ap-south-1 325355906800
#   ./scripts/deploy-with-cdk.sh deploy ap-south-1 325355906800

set -e

ACTION="${1:-diff}"
AWS_REGION="${2:-ap-south-1}"
AWS_ACCOUNT_ID="${3:-325355906800}"
CDK_DIR="./aws"

echo "======================================"
echo "CampusPrint AWS CDK Deployment"
echo "======================================"
echo "Action: $ACTION"
echo "AWS Region: $AWS_REGION"
echo "AWS Account: $AWS_ACCOUNT_ID"
echo ""

# Navigate to CDK directory
cd $CDK_DIR

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[1/4] Installing CDK dependencies..."
    npm install
else
    echo "[1/4] CDK dependencies already installed"
fi

# Verify images exist in ECR
echo "[2/4] Verifying Docker images in ECR..."

verify_image() {
    local REPO_NAME=$1
    aws ecr describe-images \
        --repository-name $REPO_NAME \
        --region $AWS_REGION > /dev/null 2>&1 || {
        echo "  ❌ ERROR: Repository not found: $REPO_NAME"
        echo "     Run ../scripts/deploy-to-ecr.sh first"
        exit 1
    }
    echo "  ✓ Found: $REPO_NAME"
}

verify_image "campusprint-backend"
verify_image "campusprint-frontend"

# Compile TypeScript
echo "[3/4] Compiling TypeScript..."
npm run build

# Execute CDK action
echo "[4/4] Running cdk $ACTION..."
export AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID
export AWS_REGION=$AWS_REGION
export ENVIRONMENT="dev"

case "$ACTION" in
    synth)
        npm run synth
        echo ""
        echo "CloudFormation template synthesized in cdk.out/"
        ;;
    diff)
        npm run diff
        ;;
    deploy)
        npm run deploy -- --require-approval=never
        echo ""
        echo "======================================"
        echo "Infrastructure Deployed!"
        echo "======================================"
        echo ""
        echo "To get stack outputs, run:"
        echo "  aws cloudformation describe-stacks --stack-name CampusPrint-dev --region $AWS_REGION --query 'Stacks[0].Outputs'"
        ;;
    destroy)
        read -p "Are you sure you want to destroy all resources? (yes/no) " -r
        if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            npm run destroy -- --require-approval=never
        else
            echo "Cancelled."
        fi
        ;;
    *)
        echo "Unknown action: $ACTION"
        echo "Valid actions: synth, diff, deploy, destroy"
        exit 1
        ;;
esac

echo ""
echo "======================================"
