#!/bin/bash

# CampusPrint: Build and Push Docker Images to ECR
# This script builds both Docker images and pushes them to Amazon ECR.
#
# Prerequisites:
# - AWS CLI configured with credentials
# - Docker installed and running
# - jq installed (for JSON parsing)
#
# Usage:
#   ./scripts/deploy-to-ecr.sh [aws-region] [aws-account-id]
# 
# Example:
#   ./scripts/deploy-to-ecr.sh ap-south-1 325355906800

set -e

# Configuration
AWS_REGION="${1:-ap-south-1}"
AWS_ACCOUNT_ID="${2:-325355906800}"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
BACKEND_IMAGE_NAME="campusprint-backend"
FRONTEND_IMAGE_NAME="campusprint-frontend"
IMAGE_TAG="${3:-latest}"

echo "======================================"
echo "CampusPrint Docker Build & ECR Push"
echo "======================================"
echo "AWS Account: $AWS_ACCOUNT_ID"
echo "AWS Region: $AWS_REGION"
echo "ECR Registry: $ECR_REGISTRY"
echo "Image Tag: $IMAGE_TAG"
echo ""

# Step 1: Create ECR repositories if they don't exist
echo "[1/6] Creating ECR repositories (if needed)..."
for REPO_NAME in $BACKEND_IMAGE_NAME $FRONTEND_IMAGE_NAME; do
    if ! aws ecr describe-repositories \
        --repository-names $REPO_NAME \
        --region $AWS_REGION > /dev/null 2>&1; then
        echo "  Creating repository: $REPO_NAME"
        aws ecr create-repository \
            --repository-name $REPO_NAME \
            --region $AWS_REGION \
            --image-scan-on-push \
            --image-tag-mutability IMMUTABLE \
            > /dev/null
    else
        echo "  Repository exists: $REPO_NAME"
    fi
done

# Step 2: Authenticate Docker with ECR
echo "[2/6] Authenticating Docker with ECR..."
aws ecr get-login-password \
    --region $AWS_REGION | docker login \
    --username AWS \
    --password-stdin $ECR_REGISTRY

# Step 3: Build backend image
echo "[3/6] Building backend image..."
docker build \
    -t $BACKEND_IMAGE_NAME:$IMAGE_TAG \
    -t $ECR_REGISTRY/$BACKEND_IMAGE_NAME:$IMAGE_TAG \
    ./backend

# Step 4: Build frontend image
echo "[4/6] Building frontend image..."
docker build \
    -t $FRONTEND_IMAGE_NAME:$IMAGE_TAG \
    -t $ECR_REGISTRY/$FRONTEND_IMAGE_NAME:$IMAGE_TAG \
    ./frontend

# Step 5: Push backend image
echo "[5/6] Pushing backend image to ECR..."
docker push $ECR_REGISTRY/$BACKEND_IMAGE_NAME:$IMAGE_TAG

# Step 6: Push frontend image
echo "[6/6] Pushing frontend image to ECR..."
docker push $ECR_REGISTRY/$FRONTEND_IMAGE_NAME:$IMAGE_TAG

# Summary
echo ""
echo "======================================"
echo "Deployment Complete!"
echo "======================================"
echo "Backend image:  $ECR_REGISTRY/$BACKEND_IMAGE_NAME:$IMAGE_TAG"
echo "Frontend image: $ECR_REGISTRY/$FRONTEND_IMAGE_NAME:$IMAGE_TAG"
echo ""
echo "Next steps:"
echo "  1. Deploy to ECS using AWS CDK or Terraform"
echo "  2. Update the CORS_ORIGIN on backend after frontend URL is known"
echo "======================================"
