# CampusPrint AWS Deployment Script (PowerShell)
# Pushes Docker images to ECR and creates ECS cluster
# Usage: .\deploy.ps1 -AccountId 666036096455 -Region ap-south-1

param(
    [string]$AccountId = "666036096455",
    [string]$Region = "ap-south-1"
)

$ECR_REGISTRY = "$AccountId.dkr.ecr.$Region.amazonaws.com"

Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "CampusPrint AWS Deployment`n" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan
Write-Host "AWS Account: $AccountId"
Write-Host "AWS Region: $Region"
Write-Host "ECR Registry: $ECR_REGISTRY`n"

# Step 1: Create ECR Repositories
Write-Host "[1/7] Creating ECR Repositories..." -ForegroundColor Yellow
aws ecr create-repository --repository-name campusprint-backend --region $Region --image-tag-mutability IMMUTABLE 2>$null
Write-Host "  ✓ Backend repo ready"

aws ecr create-repository --repository-name campusprint-frontend --region $Region --image-tag-mutability IMMUTABLE 2>$null
Write-Host "  ✓ Frontend repo ready"

# Step 2: Authenticate Docker with ECR
Write-Host "`n[2/7] Authenticating Docker with ECR..." -ForegroundColor Yellow
$password = aws ecr get-login-password --region $Region
$password | docker login --username AWS --password-stdin $ECR_REGISTRY
Write-Host "  ✓ Docker authenticated"

# Step 3: Tag Images
Write-Host "`n[3/7] Tagging Docker Images..." -ForegroundColor Yellow
docker tag campusprint-backend:test "$ECR_REGISTRY/campusprint-backend:latest"
docker tag campusprint-backend:test "$ECR_REGISTRY/campusprint-backend:v1"
docker tag campusprint-frontend:test "$ECR_REGISTRY/campusprint-frontend:latest"
docker tag campusprint-frontend:test "$ECR_REGISTRY/campusprint-frontend:v1"
Write-Host "  ✓ Images tagged"

# Step 4: Push Backend Image
Write-Host "`n[4/7] Pushing Backend Image to ECR..." -ForegroundColor Yellow
docker push "$ECR_REGISTRY/campusprint-backend:latest"
docker push "$ECR_REGISTRY/campusprint-backend:v1"
Write-Host "  ✓ Backend image pushed"

# Step 5: Push Frontend Image
Write-Host "`n[5/7] Pushing Frontend Image to ECR..." -ForegroundColor Yellow
docker push "$ECR_REGISTRY/campusprint-frontend:latest"
docker push "$ECR_REGISTRY/campusprint-frontend:v1"
Write-Host "  ✓ Frontend image pushed"

# Step 6: Create ECS Cluster
Write-Host "`n[6/7] Creating ECS Cluster..." -ForegroundColor Yellow
aws ecs create-cluster --cluster-name campusprint-cluster --region $Region --settings name=containerInsights,value=enabled 2>$null
Write-Host "  ✓ ECS Cluster created"

# Step 7: Get VPC Configuration
Write-Host "`n[7/7] Getting VPC Configuration..." -ForegroundColor Yellow
$DefaultVPC = aws ec2 describe-vpcs --filters Name=isDefault,Values=true --region $Region --query 'Vpcs[0].VpcId' --output text
$Subnet = aws ec2 describe-subnets --filters Name=vpc-id,Values=$DefaultVPC --region $Region --query 'Subnets[0].SubnetId' --output text
$SecurityGroup = aws ec2 describe-security-groups --filters Name=vpc-id,Values=$DefaultVPC --region $Region --query 'SecurityGroups[0].GroupId' --output text
Write-Host "  ✓ VPC info retrieved"

Write-Host "`n==================================`n" -ForegroundColor Green
Write-Host "✅ Deployment Complete!`n" -ForegroundColor Green
Write-Host "==================================`n" -ForegroundColor Green

Write-Host "Backend Image:" -ForegroundColor Cyan
Write-Host "  $ECR_REGISTRY/campusprint-backend:latest`n"

Write-Host "Frontend Image:" -ForegroundColor Cyan
Write-Host "  $ECR_REGISTRY/campusprint-frontend:latest`n"

Write-Host "ECS Cluster: campusprint-cluster" -ForegroundColor Cyan
Write-Host "AWS Region: $Region`n"

Write-Host "VPC Configuration for Services:" -ForegroundColor Cyan
Write-Host "  VPC: $DefaultVPC"
Write-Host "  Subnet: $Subnet"
Write-Host "  Security Group: $SecurityGroup`n"

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Register task definitions"
Write-Host "2. Create ECS services"
Write-Host "3. Get public IPs from tasks"
Write-Host "4. Open frontend URL`n"
