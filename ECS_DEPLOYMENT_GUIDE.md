# 🚀 CampusPrint AWS ECS Deployment Guide

## Status: Ready for Manual ECS Service Creation

✅ **Completed:**
- Docker images built and tagged locally
- ECR repositories created in AWS
- ECS Fargate cluster created (`campusprint-cluster`)
- Task definition configurations prepared
- All infrastructure code ready

⚠️ **Pending:** 
- Push Docker images to ECR (requires ECR push permissions)
- Create ECS services and launch tasks

---

## Prerequisites

- AWS Account with ECR and ECS permissions
- Docker installed locally
- AWS CLI configured
- Your AWS credentials must have ECR push permissions

---

## Option 1: Use AWS Console (Recommended for Quick Deployment)

### Step 1: Create CloudWatch Log Groups

```bash
# Execute in AWS CLI or do manually in CloudWatch console
aws logs create-log-group --log-group-name /ecs/campusprint-backend --region ap-south-1
aws logs create-log-group --log-group-name /ecs/campusprint-frontend --region ap-south-1
```

### Step 2: Register Task Definitions

**Backend Task Definition:**

1. Go to [AWS ECS Console](https://ap-south-1.console.aws.amazon.com/ecs/)
2. Click **Task Definitions**
3. Click **Create new task definition**
4. Choose **Fargate**
5. Fill in:
   - **Task Definition Name**: `campusprint-backend`
   - **Task execution role**: Select `ecsTaskExecutionRole`
   - **Task size CPU**: 256 (.25 vCPU)
   - **Task size Memory**: 512 MB

6. Click **Add container** and fill:
   - **Name**: `backend`
   - **Image**: Use locally built image OR `666036096455.dkr.ecr.ap-south-1.amazonaws.com/campusprint-backend:latest`
   - **Container port**: 4000
   - **Environment variables**:
     ```
     DB_DRIVER=local
     PORT=4000
     JWT_SECRET=campusprint-demo-secret-2026
     CORS_ORIGIN=*
     NODE_ENV=production
     ```
   - **Log configuration**:
     - Log driver: awslogs
     - Log group: `/ecs/campusprint-backend`
     - Log stream prefix: `backend-service`
     - Region: `ap-south-1`

7. Click **Create task definition**

**Frontend Task Definition:**

Repeat the above but:
   - **Task Definition Name**: `campusprint-frontend`
   - **Name**: `frontend`
   - **Image**: `666036096455.dkr.ecr.ap-south-1.amazonaws.com/campusprint-frontend:latest`
   - **Container port**: 80
   - **Log group**: `/ecs/campusprint-frontend`

### Step 3: Create ECS Services

**Backend Service:**

1. Go to ECS Cluster: `campusprint-cluster`
2. Click **Services** → **Create**
3. Fill:
   - **Launch type**: Fargate
   - **Task Definition**: campusprint-backend:latest
   - **Service name**: `campusprint-backend`
   - **Desired number of tasks**: 1
   - **Deployment configuration**: Min 100%, Max 200%
4. Click **Next step**
5. **Networking**:
   - **VPC**: Default VPC
   - **Subnets**: Select all available
   - **Security group**: Create new (allows ports 4000)
   - **Assign public IP**: ENABLED
6. Click **Next step** → **Create service**
7. Wait for task to reach **RUNNING** state

**Frontend Service:**

Repeat for frontend but:
   - **Task Definition**: campusprint-frontend:latest
   - **Service name**: `campusprint-frontend`
   - **Port**: 80 (not 4000)

---

## Option 2: Use AWS CLI Commands

```bash
# Register backend task definition
aws ecs register-task-definition \
  --family campusprint-backend \
  --network-mode awsvpc \
  --requires-compatibilities FARGATE \
  --cpu 256 \
  --memory 512 \
  --execution-role-arn arn:aws:iam::666036096455:role/ecsTaskExecutionRole \
  --container-definitions '[
    {
      "name": "backend",
      "image": "666036096455.dkr.ecr.ap-south-1.amazonaws.com/campusprint-backend:latest",
      "portMappings": [{"containerPort": 4000}],
      "environment": [
        {"name": "DB_DRIVER", "value": "local"},
        {"name": "PORT", "value": "4000"},
        {"name": "JWT_SECRET", "value": "campusprint-demo-secret-2026"},
        {"name": "CORS_ORIGIN", "value": "*"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/campusprint-backend",
          "awslogs-region": "ap-south-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ]' \
  --region ap-south-1

# Create backend service
aws ecs create-service \
  --cluster campusprint-cluster \
  --service-name campusprint-backend \
  --task-definition campusprint-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={assignPublicIp=ENABLED,subnets=[SUBNET_ID],securityGroups=[SECURITY_GROUP_ID]}" \
  --region ap-south-1
```

---

## Step 4: Get Application URLs

```bash
# Get backend task details
BACKEND_TASK=$(aws ecs list-tasks \
  --cluster campusprint-cluster \
  --service-name campusprint-backend \
  --region ap-south-1 \
  --query 'taskArns[0]' \
  --output text)

BACKEND_IP=$(aws ecs describe-tasks \
  --cluster campusprint-cluster \
  --tasks $BACKEND_TASK \
  --region ap-south-1 \
  --query 'tasks[0].attachments[?name==`elasticNetworkInterface`].details[?name==`publicIpv4Address`].value[0]' \
  --output text)

# Get frontend task details
FRONTEND_TASK=$(aws ecs list-tasks \
  --cluster campusprint-cluster \
  --service-name campusprint-frontend \
  --region ap-south-1 \
  --query 'taskArns[0]' \
  --output text)

FRONTEND_IP=$(aws ecs describe-tasks \
  --cluster campusprint-cluster \
  --tasks $FRONTEND_TASK \
  --region ap-south-1 \
  --query 'tasks[0].attachments[?name==`elasticNetworkInterface`].details[?name==`publicIpv4Address`].value[0]' \
  --output text)

echo "Backend URL: http://$BACKEND_IP:4000"
echo "Frontend URL: http://$FRONTEND_IP"
```

---

## Step 5: Test Application

### Backend Health Check
```bash
curl http://<backend-ip>:4000/health
# Expected: {"ok":true}
```

### Frontend Access
Open in browser:
```
http://<frontend-ip>
```

### Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | `student@campusprint.demo` | `student123` |
| Staff | `staff@campusprint.demo` | `staff123` |

---

## 🐛 Troubleshooting

### Tasks not starting
- Check **CloudWatch Logs**: `/ecs/campusprint-backend` or `/ecs/campusprint-frontend`
- Check **Task details** in ECS console for error messages
- Verify security group allows required ports (4000 for backend, 80 for frontend)

### Can't connect to frontend
- Verify task is in **RUNNING** state
- Check security group allows port 80
- Ensure public IP is assigned to task
- Try with the actual public IP, not localhost

### Backend API errors
- Check environment variables are correctly set
- Review CloudWatch logs for application errors
- Verify database driver is set to `local`

### Image not found
- Ensure Docker images are pushed to ECR first
- Verify ECR repository URIs are correct in task definitions
- Check regional availability (images in ap-south-1)

---

## 💰 Cost Monitoring

While running:
- **ECS Fargate**: ~$0.03/hour per task
- **Backend + Frontend**: ~$0.06/hour total

To stop charges:
```bash
# Scale services to 0
aws ecs update-service \
  --cluster campusprint-cluster \
  --service campusprint-backend \
  --desired-count 0 \
  --region ap-south-1

aws ecs update-service \
  --cluster campusprint-cluster \
  --service campusprint-frontend \
  --desired-count 0 \
  --region ap-south-1
```

---

## 📊 AWS Resources

| Resource | Value |
|----------|-------|
| **Cluster** | `campusprint-cluster` |
| **Backend Service** | `campusprint-backend` |
| **Frontend Service** | `campusprint-frontend` |
| **Region** | `ap-south-1` |
| **Account ID** | `666036096455` |
| **Task CPU** | 256 (0.25 vCPU) |
| **Task Memory** | 512 MB |

---

## ✅ Deployment Checklist

- [ ] CloudWatch log groups created
- [ ] Task definitions registered
- [ ] Backend service created and running
- [ ] Frontend service created and running
- [ ] Backend public IP obtained
- [ ] Frontend public IP obtained
- [ ] Health check passes (`/health` returns 200)
- [ ] Frontend loads in browser
- [ ] Can log in with demo credentials
- [ ] Can place an order (student flow)
- [ ] Staff dashboard shows orders

---

## 📞 Next Steps

1. Create log groups and task definitions
2. Launch ECS services
3. Obtain public IPs
4. Test the application
5. Demo to judges

**You're ready to deploy! 🚀**
