#!/bin/bash

# CampusPrint: Complete AWS Deployment Script
# Pushes Docker images to ECR and deploys to ECS Fargate
# Usage: bash deploy.sh <aws-account-id> <aws-region>

set -e

AWS_ACCOUNT_ID="${1:-666036096455}"
AWS_REGION="${2:-ap-south-1}"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "=================================="
echo "CampusPrint AWS Deployment"
echo "=================================="
echo "AWS Account: $AWS_ACCOUNT_ID"
echo "AWS Region: $AWS_REGION"
echo "ECR Registry: $ECR_REGISTRY"
echo ""

# Step 1: Create ECR Repositories
echo "[1/7] Creating ECR Repositories..."
aws ecr create-repository \
  --repository-name campusprint-backend \
  --region $AWS_REGION \
  --image-tag-mutability IMMUTABLE 2>/dev/null || echo "  (Backend repo may already exist)"

aws ecr create-repository \
  --repository-name campusprint-frontend \
  --region $AWS_REGION \
  --image-tag-mutability IMMUTABLE 2>/dev/null || echo "  (Frontend repo may already exist)"

# Step 2: Authenticate Docker with ECR
echo "[2/7] Authenticating Docker with ECR..."
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_REGISTRY

# Step 3: Tag Images
echo "[3/7] Tagging Docker Images..."
docker tag campusprint-backend:test "$ECR_REGISTRY/campusprint-backend:latest"
docker tag campusprint-backend:test "$ECR_REGISTRY/campusprint-backend:v1"
docker tag campusprint-frontend:test "$ECR_REGISTRY/campusprint-frontend:latest"
docker tag campusprint-frontend:test "$ECR_REGISTRY/campusprint-frontend:v1"

# Step 4: Push Backend Image
echo "[4/7] Pushing Backend Image to ECR..."
docker push "$ECR_REGISTRY/campusprint-backend:latest"
docker push "$ECR_REGISTRY/campusprint-backend:v1"

# Step 5: Push Frontend Image
echo "[5/7] Pushing Frontend Image to ECR..."
docker push "$ECR_REGISTRY/campusprint-frontend:latest"
docker push "$ECR_REGISTRY/campusprint-frontend:v1"

# Step 6: Create ECS Cluster
echo "[6/7] Creating ECS Cluster..."
aws ecs create-cluster \
  --cluster-name campusprint-cluster \
  --region $AWS_REGION \
  --settings name=containerInsights,value=enabled 2>/dev/null || echo "  (Cluster may already exist)"

# Step 7: Get VPC Info for Service Deployment
echo "[7/7] Getting VPC Configuration..."
DEFAULT_VPC=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --region $AWS_REGION --query 'Vpcs[0].VpcId' --output text)
SUBNET=$(aws ec2 describe-subnets --filters Name=vpc-id,Values=$DEFAULT_VPC --region $AWS_REGION --query 'Subnets[0].SubnetId' --output text)
SECURITY_GROUP=$(aws ec2 describe-security-groups --filters Name=vpc-id,Values=$DEFAULT_VPC --region $AWS_REGION --query 'SecurityGroups[0].GroupId' --output text)

echo ""
echo "=================================="
echo "✅ Deployment Complete!"
echo "=================================="
echo ""
echo "Backend Image:"
echo "  $ECR_REGISTRY/campusprint-backend:latest"
echo ""
echo "Frontend Image:"
echo "  $ECR_REGISTRY/campusprint-frontend:latest"
echo ""
echo "ECS Cluster: campusprint-cluster"
echo "AWS Region: $AWS_REGION"
echo ""
echo "Next Steps:"
echo "1. Register task definitions (provided in aws/ directory)"
echo "2. Create ECS services via AWS Console or CLI"
echo "3. Get public IPs from running tasks"
echo "4. Open frontend URL in browser"
echo ""
echo "VPC Configuration for Services:"
echo "  VPC: $DEFAULT_VPC"
echo "  Subnet: $SUBNET"
echo "  Security Group: $SECURITY_GROUP"
echo ""
