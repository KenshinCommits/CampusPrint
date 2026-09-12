# CampusPrint AWS Cloud Deployment - Quick Start

This is a production-grade AWS deployment for CampusPrint with complete infrastructure-as-code, monitoring, security, and CI/CD.

## What's Included

✅ **Production-Optimized Dockerfiles**
- Multi-stage frontend build (node → nginx, 40MB)
- Secure backend with non-root user (node:20-alpine, 100MB)
- Health checks enabled
- Automatic image scanning

✅ **Complete Infrastructure-as-Code**
- AWS CDK (TypeScript) - `aws/cdk-stack.ts`
- Terraform (HCL) - `aws/terraform/`
- Choose whichever you prefer

✅ **AWS Services**
- ECR: Docker image registry
- ECS Fargate: Serverless container orchestration (0.25 vCPU, 512MB/task)
- DynamoDB: Serverless database (PAY_PER_REQUEST pricing)
- S3: File storage with encryption & lifecycle policies
- Secrets Manager: Secure JWT_SECRET storage
- CloudWatch: Logs & monitoring (7-day retention)
- IAM: Least-privilege roles & policies
- Auto Scaling: 1-2 tasks per service

✅ **Deployment Automation**
- Shell scripts for ECR push
- CDK/Terraform one-command deploy
- GitHub Actions CI/CD (optional)

✅ **Security**
- No hardcoded secrets
- IAM task roles (no static AWS keys)
- Encryption at rest (S3, DynamoDB)
- Non-root container users
- Security group restrictions

✅ **Monitoring**
- CloudWatch Logs (auto-shipping from ECS)
- CloudWatch Alarms (CPU/Memory)
- Health checks on containers
- Application logging

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Frontend (Nginx)                    │
│         ECS Fargate Public IP:80                 │
│                   ↓                              │
│  ┌─────────────────────────────────────────┐   │
│  │    Backend (Node.js Express)             │   │
│  │   ECS Fargate Public IP:4000             │   │
│  │  ├─ DynamoDB (users & orders)           │   │
│  │  ├─ S3 (file uploads)                   │   │
│  │  └─ CloudWatch Logs                     │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  Secrets Manager (JWT_SECRET)                   │
│  CloudWatch Alarms (CPU/Memory)                 │
└─────────────────────────────────────────────────┘
```

## Prerequisites

1. **AWS Account** with these IAM policies:
   - `AmazonDynamoDBFullAccess`
   - `AmazonEC2ContainerRegistryPowerUser`
   - `AmazonECS_FullAccess`
   - `CloudWatchFullAccess`
   - `SecretsManagerReadWrite`
   - `IAMFullAccess`

2. **Local Tools**
   ```
   Docker (Docker Desktop)
   Node.js 20+
   AWS CLI v2
   Terraform (optional) or AWS CDK (optional)
   ```

3. **Configuration**
   ```bash
   aws configure
   aws sts get-caller-identity  # Verify credentials
   ```

## Quick Deploy (5 steps)

### Step 1: Test Locally (Optional but Recommended)

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
# Health check: curl http://localhost:4000/health

# Frontend (in another terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
# Open http://localhost:5173
```

### Step 2: Build Docker Images

```bash
# Test images locally
docker build -t campusprint-backend:local ./backend
docker build -t campusprint-frontend:local ./frontend

# Verify build
docker images | grep campusprint
```

### Step 3: Push to ECR

```bash
# Note: Set your AWS account ID and region
export AWS_ACCOUNT_ID=325355906800
export AWS_REGION=ap-south-1

# Push images
./scripts/deploy-to-ecr.sh $AWS_REGION $AWS_ACCOUNT_ID

# Expected output:
# ✓ Backend:  <account>.dkr.ecr.ap-south-1.amazonaws.com/campusprint-backend:latest
# ✓ Frontend: <account>.dkr.ecr.ap-south-1.amazonaws.com/campusprint-frontend:latest
```

### Step 4: Deploy Infrastructure (Choose One)

**Option A: Terraform (Simpler)**
```bash
cd aws/terraform
terraform init
terraform plan
terraform apply

# Outputs show: ECR URIs, DynamoDB tables, S3 bucket, etc.
```

**Option B: AWS CDK (More Powerful)**
```bash
cd aws
npm install
npm run deploy

# Creates CloudFormation stack with all resources
```

### Step 5: Verify Deployment

```bash
# Get backend public IP
aws ecs describe-tasks \
  --cluster campusprint-cluster \
  --tasks $(aws ecs list-tasks --cluster campusprint-cluster \
    --service-name campusprint-backend --query 'taskArns[0]' --output text) \
  --query 'tasks[0].attachments[0].details[1].value' \
  --output text

# Test: curl http://<backend-ip>:4000/health

# Similarly get frontend IP (port 80)
# Open http://<frontend-ip> in browser
```

## File Structure

```
CampusPrint/
├── backend/                      # Node.js Express API
│   ├── Dockerfile               # Production backend image
│   ├── package.json
│   ├── src/
│   │   ├── index.js            # Express app
│   │   ├── db/                 # Database adapters (local, dynamodb)
│   │   ├── routes/             # API endpoints
│   │   └── middleware/         # Auth, logging
│   ├── scripts/
│   │   ├── init-db.js          # Create DynamoDB tables
│   │   └── seed.js             # Seed demo data
│   └── .env.example
│
├── frontend/                     # React + Vite SPA
│   ├── Dockerfile              # Multi-stage build
│   ├── nginx.conf              # SPA routing config
│   ├── package.json
│   ├── src/
│   │   ├── pages/              # Login, Dashboard, etc.
│   │   └── api/                # API client
│   ├── vite.config.js
│   └── .env.example
│
├── aws/                          # Infrastructure-as-Code
│   ├── cdk-stack.ts            # AWS CDK (TypeScript)
│   ├── app.ts                  # CDK app entry
│   ├── package.json
│   ├── cdk.json
│   └── terraform/              # Terraform
│       ├── main.tf             # Provider config
│       ├── variables.tf        # Input variables
│       ├── dynamodb.tf         # DynamoDB tables
│       ├── ecr.tf              # ECR repos
│       ├── s3.tf               # S3 bucket
│       ├── monitoring.tf       # CloudWatch, Secrets Manager
│       ├── ecs.tf              # ECS cluster, services, IAM
│       └── outputs.tf          # Output values
│
├── scripts/
│   ├── deploy-to-ecr.sh        # Build & push Docker images
│   ├── deploy-with-terraform.sh
│   └── deploy-with-cdk.sh
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
│
├── AWS_DEPLOYMENT_GUIDE.md     # Comprehensive guide (21KB)
└── QUICKSTART.md               # This file
```

## Estimated AWS Costs (Monthly)

For a development/demo environment:

| Service | Usage | Cost |
|---------|-------|------|
| ECS Fargate | 2 tasks × 24h × 30d × $0.015/h | ~$22 |
| DynamoDB | On-demand, light usage | ~$3-5 |
| S3 | <1GB storage + lifecycle cleanup | ~$0-1 |
| CloudWatch Logs | 7-day retention | ~$2-3 |
| Secrets Manager | 1 secret | ~$0.40 |
| **Total** | | **~$27-31** |

**Cost Optimization Tips:**
- Scale down to 0 tasks when not in use: `aws ecs update-service --desired-count 0`
- Delete infrastructure when done: `terraform destroy`
- DynamoDB PAY_PER_REQUEST is cheapest for variable workloads

## Security Checklist

✅ No AWS credentials in code
✅ JWT_SECRET in Secrets Manager
✅ IAM task roles for app access (not static keys)
✅ S3 block public access
✅ DynamoDB encryption enabled
✅ Non-root container users
✅ Health checks prevent broken deployments
✅ CloudWatch logging for audit trail
✅ Least-privilege IAM policies

## Monitoring

### View Logs

```bash
# Backend logs
aws logs tail /ecs/campusprint-backend --follow

# Frontend logs
aws logs tail /ecs/campusprint-frontend --follow

# Error messages only
aws logs filter-log-events \
  --log-group-name /ecs/campusprint-backend \
  --filter-pattern "ERROR"
```

### Check Metrics

```bash
# CPU utilization
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=campusprint-backend \
                Name=ClusterName,Value=campusprint-cluster \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average
```

### View Alarms

```bash
aws cloudwatch describe-alarms --alarm-names campusprint-backend-cpu-high
```

## Common Tasks

### Scale Down (Save Money)

```bash
aws ecs update-service \
  --cluster campusprint-cluster \
  --service campusprint-backend \
  --desired-count 0
```

### Scale Up

```bash
aws ecs update-service \
  --cluster campusprint-cluster \
  --service campusprint-backend \
  --desired-count 1
```

### Force Redeployment

```bash
aws ecs update-service \
  --cluster campusprint-cluster \
  --service campusprint-backend \
  --force-new-deployment
```

### View Logs

```bash
# Real-time tail
aws logs tail /ecs/campusprint-backend --follow

# Get last 20 lines
aws logs tail /ecs/campusprint-backend --max-items 20
```

### Destroy All Infrastructure

```bash
# Terraform
cd aws/terraform
terraform destroy

# or CDK
cd aws
npm run destroy
```

## Troubleshooting

### Tasks Keep Restarting
1. Check logs: `aws logs tail /ecs/campusprint-backend --follow`
2. Check for missing env vars, secrets, or database tables
3. Verify DynamoDB table exists: `aws dynamodb describe-table --table-name campusprint-users`

### Frontend Can't Connect to Backend
1. Verify backend health: `curl http://<backend-ip>:4000/health`
2. Check CORS_ORIGIN matches frontend URL
3. Update backend service and wait 5 minutes for rollout

### Image Too Large
- Backend: ~100MB ✓
- Frontend: ~40MB ✓
- Both use lightweight alpine bases

### DynamoDB AccessDenied
1. Check IAM role: `aws iam list-attached-role-policies --role-name campusprint-backend-task-role`
2. Attach policy: `aws iam attach-role-policy --role-name campusprint-backend-task-role --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess`

## Next Steps

1. **Deploy** using one of the methods above
2. **Monitor** with CloudWatch Logs
3. **Add custom domain** with Route 53
4. **Enable HTTPS** with ALB + ACM
5. **Set up CI/CD** with GitHub Actions
6. **Scale to production** by increasing task counts

## Documentation

- **Full Guide:** `AWS_DEPLOYMENT_GUIDE.md` (21KB, all details)
- **Quick Start:** This file
- **API Contract:** `PRD.md` (backend/frontend interface)
- **Local Demo:** `README.md` (run locally without AWS)

## Support

- AWS ECS: https://docs.aws.amazon.com/ecs/
- AWS CDK: https://docs.aws.amazon.com/cdk/
- Terraform: https://registry.terraform.io/providers/hashicorp/aws/latest
- DynamoDB: https://docs.aws.amazon.com/amazondynamodb/

## Summary

This deployment provides:

✅ **Production-grade architecture** with industry best practices
✅ **Infrastructure-as-Code** (CDK or Terraform) for repeatability
✅ **Security** with IAM roles, Secrets Manager, encryption
✅ **Monitoring** with CloudWatch Logs, alarms, and health checks
✅ **Cost efficiency** optimized for development/demo (PAY_PER_REQUEST, auto-scaling, lifecycle policies)
✅ **CI/CD ready** with GitHub Actions workflow (optional)
✅ **Comprehensive documentation** for team handoff

Deploy in ~15 minutes. Impress judges with production-quality infrastructure.

---

**Last Updated:** AWS Cloud Trek 2026 | CampusPrint Project
