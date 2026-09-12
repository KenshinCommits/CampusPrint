#!/bin/bash

# CampusPrint: Deploy Infrastructure with Terraform
# This script initializes and deploys the Terraform infrastructure.
#
# Prerequisites:
# - Terraform installed
# - AWS CLI configured with credentials
# - Backend and frontend images already pushed to ECR
#
# Usage:
#   ./scripts/deploy-with-terraform.sh [action] [aws-region] [aws-account-id]
#
# Actions:
#   init    - Initialize Terraform (first time only)
#   plan    - Show deployment plan
#   apply   - Deploy infrastructure
#   destroy - Destroy all infrastructure
#
# Example:
#   ./scripts/deploy-with-terraform.sh init ap-south-1 325355906800
#   ./scripts/deploy-with-terraform.sh plan ap-south-1 325355906800
#   ./scripts/deploy-with-terraform.sh apply ap-south-1 325355906800

set -e

ACTION="${1:-plan}"
AWS_REGION="${2:-ap-south-1}"
AWS_ACCOUNT_ID="${3:-325355906800}"
TERRAFORM_DIR="./aws/terraform"

echo "======================================"
echo "CampusPrint Terraform Deployment"
echo "======================================"
echo "Action: $ACTION"
echo "AWS Region: $AWS_REGION"
echo "AWS Account: $AWS_ACCOUNT_ID"
echo ""

# Validate backend and frontend images exist in ECR
echo "[1/4] Verifying Docker images in ECR..."

verify_image() {
    local REPO_NAME=$1
    local MANIFEST=$(aws ecr batch-get-image \
        --repository-name $REPO_NAME \
        --image-ids imageTag=latest \
        --region $AWS_REGION 2>/dev/null || echo "")
    
    if [ -z "$MANIFEST" ]; then
        echo "  ❌ ERROR: Image not found: $REPO_NAME"
        echo "     Run ./scripts/deploy-to-ecr.sh first"
        exit 1
    else
        echo "  ✓ Found: $REPO_NAME"
    fi
}

verify_image "campusprint-backend"
verify_image "campusprint-frontend"

# Change to Terraform directory
cd $TERRAFORM_DIR

# Initialize Terraform if needed
if [ "$ACTION" = "init" ] || [ ! -d ".terraform" ]; then
    echo "[2/4] Initializing Terraform..."
    terraform init
fi

# Create terraform.tfvars if it doesn't exist
echo "[3/4] Preparing Terraform variables..."
if [ ! -f "terraform.tfvars" ]; then
    cat > terraform.tfvars <<EOF
aws_region         = "$AWS_REGION"
aws_account_id     = "$AWS_ACCOUNT_ID"
backend_image_uri  = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/campusprint-backend:latest"
frontend_image_uri = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/campusprint-frontend:latest"
environment        = "dev"
EOF
    echo "  Created terraform.tfvars"
else
    echo "  Using existing terraform.tfvars"
fi

# Execute Terraform action
echo "[4/4] Running terraform $ACTION..."
case "$ACTION" in
    init)
        terraform init
        ;;
    plan)
        terraform plan -out=tfplan
        echo ""
        echo "Review the plan above. To apply, run:"
        echo "  terraform apply tfplan"
        ;;
    apply)
        terraform apply -auto-approve
        echo ""
        echo "======================================"
        echo "Infrastructure Deployed!"
        echo "======================================"
        echo ""
        terraform output
        ;;
    destroy)
        read -p "Are you sure you want to destroy all resources? (yes/no) " -r
        if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            terraform destroy -auto-approve
        else
            echo "Cancelled."
        fi
        ;;
    *)
        echo "Unknown action: $ACTION"
        echo "Valid actions: init, plan, apply, destroy"
        exit 1
        ;;
esac

echo ""
echo "======================================"
