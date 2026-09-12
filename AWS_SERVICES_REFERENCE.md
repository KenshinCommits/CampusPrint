# CampusPrint AWS Services Reference

Quick reference for all AWS services used in the deployment.

---

## Services Overview

| Service | Purpose | Configuration | Cost |
|---------|---------|----------------|------|
| **ECR** | Docker image registry | 2 repositories, image scan on push | ~$0.10/GB |
| **ECS Fargate** | Container orchestration | 2 services, 1-2 tasks each, 256 CPU, 512MB RAM | ~$0.015/h per task |
| **DynamoDB** | Serverless database | 2 tables, on-demand billing, encryption | ~$0.0002-0.0003/op |
| **S3** | Object storage | 1 bucket, lifecycle policies, encryption | ~$0.023/GB/month |
| **Secrets Manager** | Secret storage | JWT_SECRET | ~$0.40/month |
| **CloudWatch** | Logs & monitoring | 2 log groups, 7-day retention, alarms | ~$0.50/GB + alarms |
| **IAM** | Access control | Task roles, policies | Free |
| **KMS** | Key encryption | 2 keys (DynamoDB, S3) | ~$1/key/month |

---

## ECR (Elastic Container Registry)

### Repositories
```bash
# List repositories
aws ecr describe-repositories --region ap-south-1

# Push image tag
docker push <account>.dkr.ecr.ap-south-1.amazonaws.com/campusprint-backend:latest
```

### Image Policies
- **Immutable Tags:** Yes (prevent accidental overwrites)
- **Scan on Push:** Yes (security scanning)
- **Lifecycle:** Keep 10 latest images

### Cost
- Storage: ~$0.10/GB per month
- Image scans: Included
- Data transfer: Usually free (internal AWS)

---

## ECS Fargate

### Cluster
```bash
# Create cluster (automatic with CDK/Terraform)
aws ecs create-cluster --cluster-name campusprint-cluster --region ap-south-1

# Describe cluster
aws ecs describe-clusters --clusters campusprint-cluster --region ap-south-1
```

### Task Definition
- **CPU:** 256 (0.25 vCPU) per task
- **Memory:** 512 MB per task
- **Logging:** CloudWatch Logs
- **Image:** From ECR

### Services
```bash
# Backend service
aws ecs create-service \
  --cluster campusprint-cluster \
  --service-name campusprint-backend \
  --task-definition campusprint-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --region ap-south-1

# Frontend service
aws ecs create-service \
  --cluster campusprint-cluster \
  --service-name campusprint-frontend \
  --task-definition campusprint-frontend \
  --desired-count 1 \
  --launch-type FARGATE \
  --region ap-south-1
```

### Task Status
```bash
# List tasks
aws ecs list-tasks --cluster campusprint-cluster --region ap-south-1

# Get task details
aws ecs describe-tasks \
  --cluster campusprint-cluster \
  --tasks <task-arn> \
  --region ap-south-1

# Get public IP
aws ecs describe-tasks \
  --cluster campusprint-cluster \
  --tasks <task-arn> \
  --query 'tasks[0].attachments[0].details[1].value' \
  --region ap-south-1
```

### Auto Scaling
```bash
# Register scalable target (automatic with CDK/Terraform)
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/campusprint-cluster/campusprint-backend \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 1 \
  --max-capacity 2 \
  --region ap-south-1

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name campusprint-backend-cpu \
  --service-namespace ecs \
  --resource-id service/campusprint-cluster/campusprint-backend \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{"TargetValue": 70.0, "PredefinedMetricSpecification": {"PredefinedMetricType": "ECSServiceAverageCPUUtilization"}}' \
  --region ap-south-1
```

### Cost
- **Fargate Compute:** $0.015 per vCPU-hour + $0.002 per GB-hour
- **Backend:** 0.25 vCPU × 24h × 30d × $0.015 = ~$27/month
- **Frontend:** 0.25 vCPU × 24h × 30d × $0.015 = ~$27/month
- **Total:** ~$54/month for 2 services (1 task each)

---

## DynamoDB

### Tables

**Users Table:**
```bash
# List table
aws dynamodb describe-table --table-name campusprint-users --region ap-south-1

# Scan all users
aws dynamodb scan --table-name campusprint-users --region ap-south-1

# Get one user
aws dynamodb get-item \
  --table-name campusprint-users \
  --key '{"email":{"S":"student@campusprint.demo"}}' \
  --region ap-south-1
```

**Orders Table:**
```bash
# List table
aws dynamodb describe-table --table-name campusprint-orders --region ap-south-1

# Query orders by user (using GSI)
aws dynamodb query \
  --table-name campusprint-orders \
  --index-name userIdIndex \
  --key-condition-expression 'userId = :uid' \
  --expression-attribute-values '{":uid":{"S":"student@campusprint.demo"}}' \
  --region ap-south-1
```

### Configuration
- **Billing Mode:** PAY_PER_REQUEST (no minimum charge)
- **Encryption:** AWS_MANAGED (automatic KMS)
- **Point-in-time Recovery:** ENABLED (restore to any point)
- **TTL:** NOT enabled (keep data indefinitely)

### Cost
- **Read:** $0.00013 per 1,000 RCUs
- **Write:** $0.00026 per 1,000 WCUs
- **Storage:** $0.25 per GB
- **Estimate:** ~$3-5/month for light usage (demo/dev)

---

## S3

### Bucket
```bash
# List bucket contents
aws s3 ls s3://campusprint-files-<account>-ap-south-1/ --recursive

# Upload file
aws s3 cp myfile.pdf s3://campusprint-files-<account>-ap-south-1/

# Download file
aws s3 cp s3://campusprint-files-<account>-ap-south-1/myfile.pdf .

# Delete file
aws s3 rm s3://campusprint-files-<account>-ap-south-1/myfile.pdf
```

### Configuration
- **Block Public Access:** ALL (complete)
- **Encryption:** S3_MANAGED (AES-256)
- **Versioning:** Disabled (cost savings)
- **Lifecycle:** Intelligent tiering after 1 day + delete after 30 days

### Cost
- **Storage:** $0.023/GB per month
- **Intelligent Tiering:** ~$0.0025 per 1,000 objects/month
- **Estimate:** ~$0-1/month for demo

---

## Secrets Manager

### JWT Secret
```bash
# Get secret value
aws secretsmanager get-secret-value \
  --secret-id campusprint/jwt-secret \
  --region ap-south-1

# Rotate secret (automatic)
# Rotate immediately
aws secretsmanager rotate-secret \
  --secret-id campusprint/jwt-secret \
  --region ap-south-1
```

### Configuration
- **Secret Type:** Custom string
- **Rotation:** Disabled (development environment)
- **Encryption:** AWS-managed KMS

### Cost
- **Per Secret:** $0.40/month
- **API Calls:** $0.06/10,000 calls
- **Estimate:** ~$0.40/month

---

## CloudWatch

### Log Groups

**Backend Logs:**
```bash
# View logs (real-time)
aws logs tail /ecs/campusprint-backend --follow --region ap-south-1

# View logs (last 100 lines)
aws logs tail /ecs/campusprint-backend --max-items 100 --region ap-south-1

# Filter for errors
aws logs filter-log-events \
  --log-group-name /ecs/campusprint-backend \
  --filter-pattern "ERROR" \
  --region ap-south-1

# View logs from last hour
aws logs filter-log-events \
  --log-group-name /ecs/campusprint-backend \
  --start-time $(($(date +%s)*1000 - 3600*1000)) \
  --region ap-south-1
```

**Frontend Logs:**
```bash
aws logs tail /ecs/campusprint-frontend --follow --region ap-south-1
```

### Alarms

**CPU Alarm:**
```bash
# Describe alarm
aws cloudwatch describe-alarms \
  --alarm-names campusprint-backend-cpu-high \
  --region ap-south-1

# Disable alarm (if needed)
aws cloudwatch disable-alarm-actions \
  --alarm-names campusprint-backend-cpu-high \
  --region ap-south-1
```

**Memory Alarm:**
```bash
aws cloudwatch describe-alarms \
  --alarm-names campusprint-backend-memory-high \
  --region ap-south-1
```

### Metrics
```bash
# Get CPU metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=campusprint-backend \
                Name=ClusterName,Value=campusprint-cluster \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average \
  --region ap-south-1

# Get Memory metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name MemoryUtilization \
  --dimensions Name=ServiceName,Value=campusprint-backend \
                Name=ClusterName,Value=campusprint-cluster \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average \
  --region ap-south-1
```

### Configuration
- **Log Retention:** 7 days
- **Log Format:** JSON (CloudWatch Agent)
- **Alarm Threshold:** CPU 70%, Memory 80%
- **Evaluation Periods:** 2 × 60s = 2 minutes

### Cost
- **Logs Ingestion:** $0.50/GB
- **Logs Storage:** $0.03/GB/month
- **Alarms:** $0.10 per alarm
- **Estimate:** ~$2-3/month for typical usage

---

## IAM

### Roles

**Task Execution Role:**
- `AmazonECSTaskExecutionRolePolicy` (managed)
- Pull images from ECR
- Write logs to CloudWatch
- Read secrets from Secrets Manager

**Backend Task Role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:DeleteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-south-1:*:table/campusprint-users",
        "arn:aws:dynamodb:ap-south-1:*:table/campusprint-orders",
        "arn:aws:dynamodb:ap-south-1:*:table/campusprint-orders/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::campusprint-files-*/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:ap-south-1:*:log-group:/ecs/campusprint-backend:*"
    }
  ]
}
```

### Security Group

```bash
# Describe security group
aws ec2 describe-security-groups \
  --group-names campusprint-ecs-sg \
  --region ap-south-1

# Inbound rules:
# - Port 80 (frontend)
# - Port 4000 (backend)
# - From 0.0.0.0/0 (anyone)

# Outbound rules:
# - All traffic allowed (to reach DynamoDB, S3, etc.)
```

---

## KMS

### Keys
```bash
# List keys
aws kms list-keys --region ap-south-1

# Describe key
aws kms describe-key --key-id alias/campusprint-dynamodb --region ap-south-1
```

### Configuration
- **Enable Key Rotation:** Yes (annual)
- **Deletion Window:** 10 days (safe to recover)
- **Usage:** DynamoDB encryption, S3 encryption

### Cost
- **Key Creation:** $1/month per key
- **API Calls:** $0.03/10,000 calls
- **Estimate:** ~$2/month (2 keys)

---

## Networking

### VPC (Default)
```bash
# Describe default VPC
aws ec2 describe-vpcs --filters Name=isDefault,Values=true --region ap-south-1

# List subnets in default VPC
aws ec2 describe-subnets --filters Name=vpc-id,Values=<vpc-id> --region ap-south-1
```

### Security Group
```bash
# Inbound rules
# Port 80/TCP from 0.0.0.0/0 (frontend)
# Port 4000/TCP from 0.0.0.0/0 (backend)

# Outbound rules
# All traffic to anywhere (reach AWS services)
```

---

## Cost Calculation

### Monthly Breakdown (Minimal Setup)
```
ECS Fargate:
  Backend: 0.25 vCPU × 24h × 30d × $0.015/vCPU-h     = $27
  Backend: 512 MB × 24h × 30d × $0.002/GB-h × (1/1000) = $0.07
  Frontend: 0.25 vCPU × 24h × 30d × $0.015/vCPU-h     = $27
  Frontend: 512 MB × 24h × 30d × $0.002/GB-h × (1/1000)= $0.07
  Subtotal ECS Fargate:                                $54.14

DynamoDB:
  Read/write (light usage):                            $3
  Subtotal DynamoDB:                                   $3

S3:
  Storage (< 1GB):                                     $0.02
  Subtotal S3:                                         $0.02

Secrets Manager:
  1 secret:                                            $0.40

CloudWatch:
  Logs ingestion (light):                              $1
  Log storage (7-day):                                 $0.50
  Alarms (2 alarms):                                   $0.20
  Subtotal CloudWatch:                                 $1.70

IAM:
  Roles/policies:                                      Free

KMS:
  2 keys × $1/month:                                   $2

ECR:
  Image storage (~200MB):                              $0.02

─────────────────────────────────────────────────────────────
TOTAL:                                                 ~$61.28/month
```

### Cost Reduction Strategies

1. **Scale to 0 Tasks (Save 100% Compute)**
   ```bash
   aws ecs update-service \
     --cluster campusprint-cluster \
     --service campusprint-backend \
     --desired-count 0
   ```
   Saves: ~$54.14/month

2. **Destroy Infrastructure**
   ```bash
   terraform destroy  # or: npm run destroy (CDK)
   ```
   Saves: ~$61/month

3. **Use 1 Task Instead of 2**
   - Already configured
   - Only scale to 2 if CPU > 70% or Memory > 80%

4. **Shorter CloudWatch Retention**
   - Change from 7 days to 1 day
   - Saves: ~$3/month

---

## Useful Commands

### Deploy & Scale
```bash
# Scale to 0 (save money)
aws ecs update-service --cluster campusprint-cluster --service campusprint-backend --desired-count 0

# Scale to 1
aws ecs update-service --cluster campusprint-cluster --service campusprint-backend --desired-count 1

# Force new deployment
aws ecs update-service --cluster campusprint-cluster --service campusprint-backend --force-new-deployment
```

### Monitor
```bash
# Tail logs
aws logs tail /ecs/campusprint-backend --follow

# Check alarms
aws cloudwatch describe-alarms --alarm-names campusprint-backend-cpu-high

# Get metrics
aws cloudwatch get-metric-statistics --namespace AWS/ECS --metric-name CPUUtilization ...
```

### Debug
```bash
# Check task logs
aws ecs describe-tasks --cluster campusprint-cluster --tasks <task-arn> --query 'tasks[0].lastStatus'

# Get service events
aws ecs describe-services --cluster campusprint-cluster --services campusprint-backend --query 'services[0].events[:3]'

# Check DynamoDB table
aws dynamodb describe-table --table-name campusprint-users

# List S3 files
aws s3 ls s3://campusprint-files-<account>-ap-south-1/ --recursive
```

---

**Last Updated:** AWS Cloud Trek 2026 | CampusPrint Project
