#!/usr/bin/env bash
set -e

export PATH="$HOME/.docker/bin:$PATH"

REGION="ap-south-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BACKEND_REPO="campusprint-backend"
FRONTEND_REPO="campusprint-frontend"
REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "=== Target AWS ECR Registry: ${REGISTRY} ==="

# 1. Create ECR Repositories if missing
echo "1. Ensuring ECR repositories exist in ${REGION}..."
aws ecr create-repository --repository-name "${BACKEND_REPO}" --region "${REGION}" 2>/dev/null || echo "Repo ${BACKEND_REPO} already exists."
aws ecr create-repository --repository-name "${FRONTEND_REPO}" --region "${REGION}" 2>/dev/null || echo "Repo ${FRONTEND_REPO} already exists."

# 2. Authenticate Docker with ECR
echo "2. Authenticating Docker to Amazon ECR..."
aws ecr get-login-password --region "${REGION}" | docker login --username AWS --password-stdin "${REGISTRY}"

# 3. Tag images
echo "3. Tagging container images..."
docker tag campusprint-backend:latest "${REGISTRY}/${BACKEND_REPO}:latest"
docker tag campusprint-frontend:latest "${REGISTRY}/${FRONTEND_REPO}:latest"

# 4. Push images
echo "4. Pushing images to ECR..."
echo "Pushing ${BACKEND_REPO}:latest..."
docker push "${REGISTRY}/${BACKEND_REPO}:latest"

echo "Pushing ${FRONTEND_REPO}:latest..."
docker push "${REGISTRY}/${FRONTEND_REPO}:latest"

echo "=== Successfully pushed both images to Amazon ECR! ==="
echo "Backend Image URI:  ${REGISTRY}/${BACKEND_REPO}:latest"
echo "Frontend Image URI: ${REGISTRY}/${FRONTEND_REPO}:latest"
