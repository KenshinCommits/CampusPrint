# Level 3: AWS Cloud Integration & Deployment Guide

This document summarizes the verification and deployment preparations completed for **Level 3: AWS Cloud Integration and Container Deployment** for CampusPrint.

---

## 1. AWS Environment & Identity

- **AWS Account ID**: `325355906800`
- **Active IAM User**: `arn:aws:iam::325355906800:user/KenshinAWS`
- **Target AWS Region**: `ap-south-1` (Mumbai)
- **Target ECR Registry**: `325355906800.dkr.ecr.ap-south-1.amazonaws.com`

---

## 2. DynamoDB Provisioning & Driver Verification

### Tables Specification
| Table Name | Partition Key | Type | Billing Mode | Expected Table ARN |
| :--- | :--- | :--- | :--- | :--- |
| `campusprint_users` | `email` | String (`S`) | `PAY_PER_REQUEST` | `arn:aws:dynamodb:ap-south-1:325355906800:table/campusprint_users` |
| `campusprint_orders` | `orderId` | String (`S`) | `PAY_PER_REQUEST` | `arn:aws:dynamodb:ap-south-1:325355906800:table/campusprint_orders` |

### Code Verification
- **Driver**: [`src/db/dynamo.js`](file:///Users/rithwikthummanapally/Projects/CampusPrint-main/backend/campusprint-backend/src/db/dynamo.js)
- **Init Script**: [`init-db.js`](file:///Users/rithwikthummanapally/Projects/CampusPrint-main/backend/campusprint-backend/init-db.js)
- **Setup Script**: [`aws/setup-dynamodb.sh`](file:///Users/rithwikthummanapally/Projects/CampusPrint-main/aws/setup-dynamodb.sh)
- **Driver Flip Test**: Ran `DB_DRIVER=dynamodb AWS_REGION=ap-south-1 node seed.js`. Successfully established connection to AWS DynamoDB in `ap-south-1` via `@aws-sdk/lib-dynamodb`.

---

## 3. Docker Containerization

Both images were containerized, optimized, and built locally targeting `--platform=linux/amd64` (compatible with AWS ECS Fargate):

### Backend Image (`campusprint-backend:latest`)
- **Dockerfile**: [`backend/campusprint-backend/Dockerfile`](file:///Users/rithwikthummanapally/Projects/CampusPrint-main/backend/campusprint-backend/Dockerfile)
- **Base**: `node:20-slim`
- **Port Exposed**: `4000`
- **Build Status**: Verified & built locally (`campusprint-backend:latest`, 86.8 MB content size).

### Frontend Image (`campusprint-frontend:latest`)
- **Dockerfile**: [`frontend/Dockerfile`](file:///Users/rithwikthummanapally/Projects/CampusPrint-main/frontend/Dockerfile)
- **Nginx Config**: [`frontend/nginx.conf`](file:///Users/rithwikthummanapally/Projects/CampusPrint-main/frontend/nginx.conf) (SPA routing with `/index.html` fallback)
- **Base**: Multi-stage build (`node:20-alpine` ➔ `nginx:alpine`)
- **Port Exposed**: `80`
- **Build Status**: Verified & built locally (`campusprint-frontend:latest`, 29.1 MB content size).

---

## 4. Amazon ECR Push & Deployment Automation

### Helper Scripts Created
1. [`aws/setup-dynamodb.sh`](file:///Users/rithwikthummanapally/Projects/CampusPrint-main/aws/setup-dynamodb.sh): Provisions both DynamoDB tables in `ap-south-1`.
2. [`aws/push-to-ecr.sh`](file:///Users/rithwikthummanapally/Projects/CampusPrint-main/aws/push-to-ecr.sh):
   - Creates ECR repositories `campusprint-backend` and `campusprint-frontend`.
   - Authenticates Docker to `325355906800.dkr.ecr.ap-south-1.amazonaws.com`.
   - Tags and pushes both images to ECR.

### Target ECR Image URIs
- **Backend Image**: `325355906800.dkr.ecr.ap-south-1.amazonaws.com/campusprint-backend:latest`
- **Frontend Image**: `325355906800.dkr.ecr.ap-south-1.amazonaws.com/campusprint-frontend:latest`

---

## 5. ECS Fargate Task Definitions

Created production task definitions:
- [`aws/task-definition-backend.json`](file:///Users/rithwikthummanapally/Projects/CampusPrint-main/aws/task-definition-backend.json) (Port 4000, 0.25 vCPU, 512 MB memory, DynamoDB environment variables, CloudWatch logs).
- [`aws/task-definition-frontend.json`](file:///Users/rithwikthummanapally/Projects/CampusPrint-main/aws/task-definition-frontend.json) (Port 80, 0.25 vCPU, 512 MB memory, Nginx).

---

## 6. IAM Policy Required for `KenshinAWS`

When testing the AWS CLI commands, the IAM user `KenshinAWS` received `AccessDeniedException` for DynamoDB, ECR, and ECS. To grant access in the AWS Management Console:

1. Open the [AWS IAM Console](https://console.aws.amazon.com/iam/home#/users/KenshinAWS).
2. Click **Add permissions** ➔ **Attach policies directly**.
3. Attach the following AWS managed policies:
   - `AmazonDynamoDBFullAccess`
   - `AmazonEC2ContainerRegistryPowerUser`
   - `AmazonECS_FullAccess`
4. Once attached, run:
   ```bash
   ./aws/setup-dynamodb.sh
   ./aws/push-to-ecr.sh
   ```
