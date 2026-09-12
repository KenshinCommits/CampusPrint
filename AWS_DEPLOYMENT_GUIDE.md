# CampusPrint: AWS Cloud Deployment Guide

This document provides complete instructions for deploying CampusPrint to AWS using Docker, Amazon ECR, ECS, DynamoDB, and related services.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development](#local-development)
4. [AWS Deployment](#aws-deployment)
5. [Infrastructure-as-Code](#infrastructure-as-code)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Cost Optimization](#cost-optimization)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Elastic IPs   │
                    │  (Public URLs) │
                    └────────┬───────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    ┌──────────────┐  ┌──────────────┐   ┌──────────┐
    │   Frontend   │  │   Backend    │   │ S3       │
    │  (ECS Nginx) │  │  (ECS Node)  │   │ (Files)  │
    └──────┬───────┘  └──────┬───────┘   └──────────┘
           │                 │
           │     ┌───────────┼───────────┐
           │     │           │           │
           ▼     ▼           ▼           ▼
       ┌───────────────────────────────────────┐
       │   AWS CloudWatch Logs & Monitoring    │
       └───────────────────────────────────────┘
               │            │
               ▼            ▼
       ┌───────────────────────────────────────┐
       │        DynamoDB (On-Demand)           │
       │  ├── campusprint-users (PAY_PER_REQ) │
       │  └── campusprint-orders (PAY_PER_REQ)│
       └───────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AWS Services Used                             │
├─────────────────────────────────────────────────────────────────┤
│ • Amazon ECR           - Docker image registry                  │
│ • Amazon ECS (Fargate) - Container orchestration                │
│ • DynamoDB             - Serverless database                    │
│ • Amazon S3            - Object storage (encrypted, lifecycle)  │
│ • AWS Secrets Manager  - Secure secret storage (JWT_SECRET)    │
│ • CloudWatch Logs      - Application & container logs (7-day)  │
│ • CloudWatch Alarms    - CPU/Memory monitoring                  │
│ • IAM Roles/Policies   - Least-privilege access control        │
│ • Auto Scaling         - Service scaling (1-2 tasks)            │
│ • AWS CDK / Terraform  - Infrastructure-as-Code                │
│ • GitHub Actions       - CI/CD pipeline (optional)              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### 1. AWS Account & Credentials

- AWS Account with appropriate permissions
- AWS CLI v2 installed and configured:
  ```bash
  aws configure
  aws sts get-caller-identity
  ```

### 2. Required IAM Permissions

Your IAM user must have these AWS managed policies attached:

- `AmazonDynamoDBFullAccess`
- `AmazonEC2ContainerRegistryPowerUser`
- `AmazonECS_FullAccess`
- `CloudWatchFullAccess`
- `SecretsManagerReadWrite`
- `IAMFullAccess` (for role creation)

To attach policies:
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/home)
2. Click **Users** → Select your user
3. Click **Add permissions** → **Attach policies directly**
4. Search and select the above policies

### 3. Local Development Tools

```bash
# Docker Desktop (or Docker Engine + Docker CLI)
docker --version

# Node.js 20+
node --version

# AWS CLI v2
aws --version

# For CDK deployment (optional)
npm install -g aws-cdk

# For Terraform deployment (optional)
terraform --version
```

---

## Local Development

### 1. Run Backend Locally

```bash
cd backend
cp .env.example .env

# Edit .env to ensure:
# DB_DRIVER=local
# PORT=4000
# CORS_ORIGIN=http://localhost:5173

npm install
npm run seed              # Create demo accounts in local storage
npm run dev              # Start backend on http://localhost:4000
```

Test the health endpoint:
```bash
curl http://localhost:4000/health
# Expected response: {"ok":true}
```

### 2. Run Frontend Locally

```bash
cd frontend
cp .env.example .env

# Edit .env to ensure:
# VITE_API_URL=http://localhost:4000

npm install
npm run dev              # Start frontend on http://localhost:5173
```

### 3. Demo Accounts

After running `npm run seed` on the backend:

| Role    | Email                    | Password     |
|---------|--------------------------|--------------|
| Student | `student@campusprint.demo` | `student123` |
| Staff   | `staff@campusprint.demo`   | `staff123`   |

### 4. Test Locally

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Browser: http://localhost:5173
```

---

## AWS Deployment

### Step 1: Build Docker Images

Both images are optimized for production:

**Backend (`node:20-alpine` base, ~100MB):**
- Multi-stage: not needed (single stage)
- Non-root user (`nodejs:nodejs`)
- Health check enabled
- Caches npm packages

**Frontend (`node:20-alpine` → `nginx:alpine`, ~40MB):**
- Multi-stage build (reduces final size)
- SPA routing configured in nginx
- Health check endpoint
- Automatic gzip compression

To build locally for testing:

```bash
# Backend
docker build -t campusprint-backend:local ./backend

# Frontend
docker build -t campusprint-frontend:local ./frontend

# Test backend container
docker run -p 4000:4000 \
  -e DB_DRIVER=local \
  -e JWT_SECRET=test-secret \
  campusprint-backend:local

# Test frontend container (port 80)
docker run -p 8080:80 campusprint-frontend:local
# Open http://localhost:8080
```

### Step 2: Push to Amazon ECR

```bash
# Make deployment script executable
chmod +x scripts/deploy-to-ecr.sh

# Build and push images to ECR
./scripts/deploy-to-ecr.sh ap-south-1 325355906800

# Expected output:
# ✓ Backend image:  <account>.dkr.ecr.ap-south-1.amazonaws.com/campusprint-backend:latest
# ✓ Frontend image: <account>.dkr.ecr.ap-south-1.amazonaws.com/campusprint-frontend:latest
```

Verify images in ECR:
```bash
aws ecr describe-images \
  --repository-name campusprint-backend \
  --region ap-south-1
```

### Step 3: Deploy Infrastructure with CDK

**Option A: AWS CDK (Recommended for TypeScript developers)**

```bash
cd aws

# Install CDK dependencies
npm install

# Review the deployment plan
npm run synth          # Generates CloudFormation template

# Deploy infrastructure
npm run deploy         # Creates all AWS resources

# Expected resources created:
# - ECR repositories (already exist)
# - DynamoDB tables (users, orders)
# - S3 bucket (file storage)
# - ECS cluster (campusprint-cluster)
# - ECS task definitions (backend, frontend)
# - ECS services (auto-scaling 1-2 tasks)
# - IAM roles (task execution, backend task role)
# - CloudWatch log groups
# - Secrets Manager (JWT_SECRET)
# - CloudWatch alarms (CPU, memory)
```

**Option B: Terraform**

```bash
cd aws/terraform

# Initialize Terraform
terraform init

# Review the deployment plan
terraform plan

# Deploy infrastructure
terraform apply

# Destroy infrastructure (when done)
terraform destroy
```

### Step 4: Initialize DynamoDB Tables

If using Terraform or CDK, tables are created automatically. To manually verify:

```bash
# List DynamoDB tables
aws dynamodb list-tables --region ap-south-1

# Seed demo data
cd backend
npm install
DB_DRIVER=dynamodb AWS_REGION=ap-south-1 npm run seed
```

### Step 5: Verify ECS Services

```bash
# Check ECS cluster
aws ecs describe-clusters \
  --clusters campusprint-cluster \
  --region ap-south-1

# List services
aws ecs list-services \
  --cluster campusprint-cluster \
  --region ap-south-1

# Check task status
aws ecs list-tasks \
  --cluster campusprint-cluster \
  --service-name campusprint-backend \
  --region ap-south-1

# Get task details (including public IP)
aws ecs describe-tasks \
  --cluster campusprint-cluster \
  --tasks <task-arn-from-above> \
  --region ap-south-1 \
  --query 'tasks[0].{TaskArn:taskArn,PublicIP:attachments[0].details[1].value,Status:lastStatus}'
```

### Step 6: Get Application URLs

```bash
# Get backend public IP
BACKEND_TASK=$(aws ecs list-tasks \
  --cluster campusprint-cluster \
  --service-name campusprint-backend \
  --region ap-south-1 \
  --query 'taskArns[0]' \
  --output text)

aws ecs describe-tasks \
  --cluster campusprint-cluster \
  --tasks $BACKEND_TASK \
  --region ap-south-1 \
  --query 'tasks[0].attachments[?name==`elasticNetworkInterface`].details[?name==`publicIpv4Address`].value' \
  --output text

# URL: http://<backend-ip>:4000
# Health check: curl http://<backend-ip>:4000/health
```

### Step 7: Update CORS Origin

After frontend is deployed, update backend CORS settings:

```bash
# Get frontend public IP (similar to above, port 80)
# Then update ECS service environment variable:

aws ecs update-service \
  --cluster campusprint-cluster \
  --service campusprint-backend \
  --force-new-deployment \
  --region ap-south-1

# This will trigger a new task rollout with updated CORS_ORIGIN
# Wait 5-10 minutes for tasks to restart
```

---

## Infrastructure-as-Code

### AWS CDK

Located in `aws/` directory:

```bash
cd aws

# Commands
npm run build              # Compile TypeScript
npm run synth             # Generate CloudFormation
npm run diff              # Show deployment diff
npm run deploy            # Deploy stack
npm run destroy           # Delete stack
```

**CDK Stack Definition:** `aws/cdk-stack.ts`
- Defines all AWS resources
- Uses TypeScript for type safety
- Outputs resource ARNs and names

### Terraform

Located in `aws/terraform/` directory:

```bash
cd aws/terraform

# Commands
terraform init            # Initialize working directory
terraform plan           # Show deployment plan
terraform apply          # Deploy infrastructure
terraform destroy        # Delete infrastructure
```

**Terraform Modules:**
- `main.tf` - Provider configuration
- `variables.tf` - Input variables
- `dynamodb.tf` - DynamoDB tables
- `ecr.tf` - ECR repositories
- `s3.tf` - S3 bucket
- `monitoring.tf` - CloudWatch, Secrets Manager
- `ecs.tf` - ECS cluster, services, tasks, IAM roles
- `outputs.tf` - Output values

---

## CI/CD Pipeline

### GitHub Actions (Optional)

Located in `.github/workflows/deploy.yml`

**Setup GitHub Actions CI/CD:**

1. **Create GitHub OIDC Role in AWS:**

```bash
# Trust policy for GitHub Actions
aws iam create-role \
  --role-name github-oidc-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Federated": "arn:aws:iam::325355906800:oidc-provider/token.actions.githubusercontent.com"
        },
        "Action": "sts:AssumeRoleWithWebIdentity",
        "Condition": {
          "StringEquals": {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
          },
          "StringLike": {
            "token.actions.githubusercontent.com:sub": "repo:<your-github-org>/<your-repo>:*"
          }
        }
      }
    ]
  }' \
  --region ap-south-1

# Attach necessary policies
aws iam attach-role-policy \
  --role-name github-oidc-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser \
  --region ap-south-1

aws iam attach-role-policy \
  --role-name github-oidc-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess \
  --region ap-south-1
```

2. **Add GitHub Secrets:**

In GitHub repo Settings → Secrets and Variables → Actions:

```
AWS_ACCOUNT_ID=325355906800
AWS_REGION=ap-south-1
```

3. **Pipeline Workflow:**

On every push to `main` or `develop`:
1. Build backend Docker image
2. Build frontend Docker image
3. Push images to ECR with git SHA tag
4. Update ECS services (on main branch only)

---

## Monitoring and Logging

### CloudWatch Logs

View logs from running containers:

```bash
# Backend logs
aws logs tail /ecs/campusprint-backend --follow --region ap-south-1

# Frontend logs
aws logs tail /ecs/campusprint-frontend --follow --region ap-south-1

# View last 100 lines
aws logs tail /ecs/campusprint-backend --max-items 100 --region ap-south-1

# View logs from specific time range
aws logs filter-log-events \
  --log-group-name /ecs/campusprint-backend \
  --start-time $(date -d '1 hour ago' +%s)000 \
  --region ap-south-1
```

### CloudWatch Alarms

Alarms are created automatically for:

- **Backend CPU > 70%** - `campusprint-backend-cpu-high`
- **Backend Memory > 80%** - `campusprint-backend-memory-high`

To view alarms:

```bash
aws cloudwatch describe-alarms \
  --alarm-names campusprint-backend-cpu-high \
  --region ap-south-1
```

### Application Metrics

Backend logs important events:

```
✓ User login: student@campusprint.demo
✓ Order placed: CP-1042 (100 INR)
✓ Order accepted: CP-1042
✓ Payment processed: CP-1042
```

Frontend logs:

```
✓ Application loaded
✓ API request: POST /api/orders
✓ Response: 200 OK
```

---

## Cost Optimization

### Architecture Choices

| Service         | Why This Choice | Cost Impact |
|-----------------|-----------------|-------------|
| **ECS Fargate** | Serverless, no EC2 mgmt | ~$0.015/hour per task |
| **DynamoDB PAY_PER_REQUEST** | No minimum charges | ~$0.00013 per RCU, $0.00026 per WCU |
| **S3 with lifecycle** | Automatic cleanup | Files deleted after 30 days |
| **CloudWatch 7-day retention** | Minimal log storage | Balances visibility with cost |
| **1 task per service (min)** | Demo/dev environment | ~$0.03/day running |
| **No Load Balancer** | Public IPs on ECS | Free (would be $16/month with ALB) |
| **No RDS** | DynamoDB is cheaper for this workload | ~$0.00/month vs RDS ~$30/month |
| **No NAT Gateway** | Public subnets | Free (would be ~$32/month) |

### Monthly Cost Estimate (Minimal Setup)

```
ECS Fargate (1 task × 24h × 30d): $10-15
DynamoDB (on-demand, light usage):  $2-5
S3 storage (< 1GB):                 $0-1
CloudWatch Logs:                    $2-3
Total:                              ~$15-25/month
```

### Cost Reduction Tactics

1. **Scale down tasks to 0 when not in use:**
   ```bash
   aws ecs update-service \
     --cluster campusprint-cluster \
     --service campusprint-backend \
     --desired-count 0
   ```

2. **Delete unused resources:**
   ```bash
   # Destroy all infrastructure
   cd aws/terraform && terraform destroy
   # or
   cd aws && npm run destroy
   ```

3. **Use CloudWatch Logs Insights for targeted debugging** (only pay for queries, not retention)

4. **Compress images with Amazon ECR image scanning** - already enabled

---

## Security Considerations

### 1. No Hardcoded Secrets

✓ JWT_SECRET stored in AWS Secrets Manager
✓ AWS credentials use IAM task roles (no keys in code)
✓ No secrets in Docker images
✓ Environment variables from ECS task definition

### 2. IAM Least Privilege

**Task Execution Role** (ECS infrastructure):
- Pull images from ECR
- Write logs to CloudWatch
- Read secrets from Secrets Manager

**Backend Task Role** (Application):
- Read/write DynamoDB
- Read/write S3
- Write CloudWatch logs
- **NOT** AdministratorAccess

### 3. Network Security

- ECS security group allows only ports 80 (frontend) and 4000 (backend)
- S3 block public access enabled
- No public RDS endpoints
- Encryption enabled by default

### 4. Data Protection

- S3: Server-side encryption (KMS)
- DynamoDB: Encryption at rest (KMS)
- Point-in-time recovery enabled on DynamoDB

### 5. Container Security

- Non-root user (nodejs:nodejs) in backend
- Health checks prevent broken containers
- Image scan on push (ECR)
- No secrets in environment (use Secrets Manager)

---

## Troubleshooting

### Issue: ECS Tasks Keep Restarting

**Check logs:**
```bash
aws logs tail /ecs/campusprint-backend --follow
```

**Common causes:**
- Missing environment variables
- Database connection failed (DynamoDB table doesn't exist)
- Secret not found in Secrets Manager
- Image pull failed (wrong ECR URI)

**Fix:**
```bash
# Verify table exists
aws dynamodb describe-table \
  --table-name campusprint-users \
  --region ap-south-1

# Verify secret exists
aws secretsmanager get-secret-value \
  --secret-id campusprint/jwt-secret \
  --region ap-south-1
```

### Issue: Frontend Can't Connect to Backend

**Check CORS origin:**
```bash
# Backend service environment variable
aws ecs describe-task-definition \
  --task-definition campusprint-backend \
  --query 'taskDefinition.containerDefinitions[0].environment' \
  --region ap-south-1
```

**Fix: Update CORS_ORIGIN**

1. Get frontend public IP
2. Update backend ECS service
3. Wait 5 minutes for task restart

### Issue: High Memory Usage

```bash
# Check task metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name MemoryUtilization \
  --dimensions Name=ServiceName,Value=campusprint-backend \
                Name=ClusterName,Value=campusprint-cluster \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average
```

Increase task memory:
```bash
# Edit task definition memory (512 → 1024 MB)
# Deploy new task definition
# Update service to use new definition
```

### Issue: DynamoDB "AccessDenied"

**Verify IAM role:**
```bash
# Check task role policies
aws iam list-attached-role-policies \
  --role-name campusprint-backend-task-role \
  --region ap-south-1

# Check inline policies
aws iam list-role-policies \
  --role-name campusprint-backend-task-role
```

**Fix:**
```bash
# Attach policy
aws iam attach-role-policy \
  --role-name campusprint-backend-task-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

### Issue: Image Too Large

**Optimize Docker image:**

```dockerfile
# Before: 200MB+
FROM node:20
COPY . .
RUN npm install

# After: ~100MB (backend), ~40MB (frontend)
FROM node:20-alpine
RUN npm ci --omit=dev
USER nodejs
```

Rebuild and push:
```bash
./scripts/deploy-to-ecr.sh ap-south-1 325355906800 v1.0.1
```

---

## Next Steps

1. **Deploy locally** - Verify everything works on your laptop
2. **Build Docker images** - `./scripts/deploy-to-ecr.sh`
3. **Deploy infrastructure** - `cd aws/terraform && terraform apply`
4. **Monitor logs** - `aws logs tail /ecs/campusprint-backend --follow`
5. **Set up CI/CD** - Push to GitHub, watch GitHub Actions deploy
6. **Add custom domain** - Use Route 53 or external DNS
7. **Enable HTTPS** - Add ALB with ACM certificate
8. **Scale to production** - Increase task counts, add auto-scaling

---

## Support & Documentation

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/best_practices.html)

---

**Last Updated:** 2025 | AWS Cloud Trek 2026 | CampusPrint Project
