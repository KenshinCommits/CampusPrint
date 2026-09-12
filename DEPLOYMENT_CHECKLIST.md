# CampusPrint AWS Deployment Checklist

## Pre-Deployment Checklist

### AWS Account Setup
- [ ] AWS account created
- [ ] AWS CLI v2 installed
- [ ] `aws configure` run with credentials
- [ ] `aws sts get-caller-identity` shows correct account
- [ ] IAM user has required policies attached:
  - [ ] AmazonDynamoDBFullAccess
  - [ ] AmazonEC2ContainerRegistryPowerUser
  - [ ] AmazonECS_FullAccess
  - [ ] CloudWatchFullAccess
  - [ ] SecretsManagerReadWrite
  - [ ] IAMFullAccess

### Local Environment
- [ ] Docker Desktop installed
- [ ] `docker --version` works
- [ ] Node.js 20+ installed
- [ ] `node --version` shows v20+
- [ ] `npm --version` shows npm 10+
- [ ] Git installed (for version control)

### Repository Setup
- [ ] Code cloned or extracted
- [ ] All files present:
  - [ ] `backend/` directory
  - [ ] `frontend/` directory
  - [ ] `aws/` directory
  - [ ] `scripts/` directory
  - [ ] `.github/workflows/` directory

### CDK/Terraform Setup
- [ ] AWS CDK CLI installed (if using CDK): `npm install -g aws-cdk`
- [ ] Terraform installed (if using Terraform): `terraform --version`
- [ ] One selected as primary deployment method

---

## Local Testing Phase (Optional but Recommended)

### Backend Local Test
- [ ] `cd backend && npm install` completes
- [ ] `cp .env.example .env`
- [ ] `.env` has `DB_DRIVER=local`
- [ ] `npm run seed` completes successfully
- [ ] `npm run dev` starts without errors
- [ ] `curl http://localhost:4000/health` returns `{"ok":true}`
- [ ] Backend running on port 4000

### Frontend Local Test
- [ ] `cd frontend && npm install` completes
- [ ] `cp .env.example .env`
- [ ] `.env` has `VITE_API_URL=http://localhost:4000`
- [ ] `npm run dev` starts without errors
- [ ] Browser opens to `http://localhost:5173`
- [ ] Frontend connects to backend (no CORS errors)
- [ ] Can log in with `student@campusprint.demo` / `student123`
- [ ] Can navigate between pages

### Local Integration Test
- [ ] Both backend and frontend running
- [ ] Student login works
- [ ] Can place an order
- [ ] Can see order in staff dashboard
- [ ] Staff can accept/reject orders
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## Docker Build Phase

### Backend Image
- [ ] `docker build -t campusprint-backend:test ./backend` completes
- [ ] Image builds successfully (no errors)
- [ ] Image size < 150MB (showing is ~100MB)
- [ ] Can run: `docker run -p 4000:4000 -e DB_DRIVER=local -e JWT_SECRET=test -e PORT=4000 campusprint-backend:test`
- [ ] Health endpoint accessible on port 4000
- [ ] Image uses non-root user (`nodejs`)
- [ ] `docker logs` shows "API running on port 4000"

### Frontend Image
- [ ] `docker build -t campusprint-frontend:test ./frontend` completes
- [ ] Image builds successfully (no errors)
- [ ] Image size < 60MB (showing is ~40MB)
- [ ] Multi-stage build working (node stage → nginx stage)
- [ ] Can run: `docker run -p 8080:80 campusprint-frontend:test`
- [ ] Browser can access `http://localhost:8080`
- [ ] Health endpoint on port 80 returns 200 OK
- [ ] Nginx running with SPA routing

### Docker Test Cleanup
- [ ] `docker stop campusprint-backend-test`
- [ ] `docker stop campusprint-frontend-test`
- [ ] `docker rm campusprint-backend-test`
- [ ] `docker rm campusprint-frontend-test`

---

## AWS Infrastructure Phase

### AWS Resources Pre-Check
- [ ] AWS account accessible
- [ ] Credentials configured: `aws sts get-caller-identity` works
- [ ] Correct region: `ap-south-1`
- [ ] Correct account: `325355906800`

### Choose Deployment Method
- [ ] **Option A: Terraform** (Simpler, good for learning IaC)
  OR
- [ ] **Option B: AWS CDK** (More powerful, TypeScript)

---

## Deployment: Terraform Path

### Terraform Setup
- [ ] `cd aws/terraform` directory
- [ ] `terraform init` completes without errors
- [ ] `.terraform/` directory created
- [ ] `.terraformrc` or environment variables set (if needed)

### Build & Push Docker Images
- [ ] Images built locally (passing Docker Build Phase above)
- [ ] `./scripts/deploy-to-ecr.sh ap-south-1 325355906800` runs
- [ ] Script creates ECR repositories (if needed)
- [ ] Docker authenticates with ECR (no login errors)
- [ ] Backend image pushed to ECR
- [ ] Frontend image pushed to ECR
- [ ] Script displays final image URIs

### Terraform Planning
- [ ] `terraform plan` completes
- [ ] Output shows resources to be created:
  - [ ] 2 DynamoDB tables
  - [ ] 1 S3 bucket
  - [ ] 2 ECR repositories
  - [ ] 2 CloudWatch log groups
  - [ ] 1 Secrets Manager secret
  - [ ] 1 ECS cluster
  - [ ] 2 ECS task definitions
  - [ ] 2 ECS services
  - [ ] IAM roles and policies
  - [ ] Auto-scaling targets and policies
  - [ ] CloudWatch alarms

### Terraform Apply
- [ ] `terraform apply` runs without errors
- [ ] Resources created successfully (5-10 minutes)
- [ ] `terraform output` shows all resource details:
  - [ ] Backend ECR repository URI
  - [ ] Frontend ECR repository URI
  - [ ] Users table name
  - [ ] Orders table name
  - [ ] S3 bucket name
  - [ ] JWT secret ARN
  - [ ] Log group names
  - [ ] ECS cluster name
  - [ ] Service names

### Post-Terraform Verification
- [ ] AWS Console shows new resources:
  - [ ] ECR repositories visible
  - [ ] DynamoDB tables exist
  - [ ] S3 bucket exists
  - [ ] ECS cluster exists
  - [ ] ECS services running

---

## Deployment: CDK Path

### CDK Setup
- [ ] `cd aws` directory
- [ ] `npm install` completes without errors
- [ ] Dependencies installed: aws-cdk-lib, constructs, typescript

### Build & Push Docker Images
- [ ] Images built locally (passing Docker Build Phase above)
- [ ] `./scripts/deploy-to-cdk.sh synth ap-south-1 325355906800` runs
- [ ] CDK compiles TypeScript
- [ ] `cdk.out/` directory created with CloudFormation template

### CDK Deployment
- [ ] `./scripts/deploy-with-cdk.sh deploy ap-south-1 325355906800` runs
- [ ] CDK deploys CloudFormation stack
- [ ] Stack creates all resources (5-10 minutes)
- [ ] No deployment errors

### Post-CDK Verification
- [ ] AWS Console shows new resources
- [ ] CloudFormation stack exists: `CampusPrint-dev`
- [ ] Stack events show all resources created
- [ ] Outputs show resource details

---

## Post-Deployment Verification

### ECS Services Running
- [ ] Backend service `campusprint-backend` is ACTIVE
- [ ] Frontend service `campusprint-frontend` is ACTIVE
- [ ] Backend task running (status = RUNNING)
- [ ] Frontend task running (status = RUNNING)
- [ ] Both tasks have assigned public IPs

### Get Application URLs
- [ ] Backend public IP: `<backend-ip>:4000`
- [ ] Frontend public IP: `<frontend-ip>:80`
- [ ] Both IPs are publicly accessible

### Backend Health Check
- [ ] `curl http://<backend-ip>:4000/health` returns 200 OK
- [ ] Response shows: `{"ok":true}`
- [ ] No connection errors

### Frontend Accessibility
- [ ] Browser can access `http://<frontend-ip>`
- [ ] Frontend page loads (no 403/404 errors)
- [ ] No CORS errors in browser console
- [ ] Login page visible

### CloudWatch Logs
- [ ] Backend log group exists: `/ecs/campusprint-backend`
- [ ] Frontend log group exists: `/ecs/campusprint-frontend`
- [ ] Logs are flowing (not empty)
- [ ] Backend shows "API running on port 4000"
- [ ] No error messages in logs

### DynamoDB Tables
- [ ] `campusprint-users` table exists
- [ ] `campusprint-orders` table exists
- [ ] Tables show item count (after seeding)
- [ ] Encryption enabled

### S3 Bucket
- [ ] S3 bucket created: `campusprint-files-<account>-ap-south-1`
- [ ] Public access blocked
- [ ] Encryption enabled

### Secrets Manager
- [ ] JWT secret created: `campusprint/jwt-secret`
- [ ] Secret is retrievable (no access errors)

### IAM Roles
- [ ] Task execution role created
- [ ] Backend task role created
- [ ] Policies attached correctly

### CloudWatch Alarms
- [ ] CPU alarm created: `campusprint-backend-cpu-high`
- [ ] Memory alarm created: `campusprint-backend-memory-high`
- [ ] Alarms are in OK state (no current issues)

---

## Application Functional Testing

### Student Flow
- [ ] Can access frontend at `http://<frontend-ip>`
- [ ] Login page loads
- [ ] Can sign up new student account
- [ ] Can log in with credentials
- [ ] Dashboard displays (My Orders page)
- [ ] Can upload document (drag/drop or file picker)
- [ ] Can set print options (copies, color, sides, paper, binding)
- [ ] Cost calculates and updates in real-time
- [ ] Can place order
- [ ] Order gets token (e.g., CP-1042)
- [ ] Can see order in My Orders with status
- [ ] Can simulate payment
- [ ] Order status updates to "paid"

### Staff Flow
- [ ] Can log in as staff: `staff@campusprint.demo` / `staff123`
- [ ] Staff dashboard loads
- [ ] Orders queue visible
- [ ] Can search/filter orders
- [ ] Can open order (see file requirements)
- [ ] Can download file
- [ ] Can accept order
- [ ] Can reject order with reason
- [ ] Can move order through statuses: placed → accepted → processing → ready → completed
- [ ] Order history visible
- [ ] Stats visible (orders per status)

### Cross-Service Communication
- [ ] Student places order → appears in staff dashboard (< 5 seconds)
- [ ] Staff accepts order → student sees update (< 5 seconds)
- [ ] No CORS errors
- [ ] No API errors (5xx responses)
- [ ] No database errors (checking logs)

### Data Persistence
- [ ] Orders persist after page refresh
- [ ] User data persists after logout/login
- [ ] Status changes persist

---

## CORS Configuration

### Initial Deployment
- [ ] Backend CORS_ORIGIN initially: `https://campusprint-frontend.local` (placeholder)
- [ ] Frontend can be accessed
- [ ] Requests to backend work

### Post-Deployment Update
- [ ] Get frontend public IP: `http://<frontend-ip>`
- [ ] Update backend service:
  ```bash
  aws ecs update-service \
    --cluster campusprint-cluster \
    --service campusprint-backend \
    --force-new-deployment
  ```
- [ ] Wait 5-10 minutes for rollout
- [ ] Check backend logs for new deployment
- [ ] CORS errors should disappear
- [ ] Frontend ↔ Backend communication works

---

## Security Verification

### No Hardcoded Secrets
- [ ] Check Dockerfile - no API keys (pass ✓)
- [ ] Check `docker-compose.yml` - no secrets (N/A, not created)
- [ ] Check `.env` files - no secrets in repo
- [ ] Check source code - no hardcoded JWT (pass ✓)

### JWT Secret in Secrets Manager
- [ ] `aws secretsmanager get-secret-value --secret-id campusprint/jwt-secret` works
- [ ] Returns valid 32-character secret
- [ ] Not in Dockerfile or env files

### IAM Roles Attached
- [ ] Task execution role has required policies
- [ ] Backend task role has DynamoDB access
- [ ] Backend task role has S3 access
- [ ] Backend task role NOT AdministratorAccess

### Container Security
- [ ] Backend runs as non-root: `docker inspect <backend-image> | grep User`
- [ ] Frontend runs as non-root (nginx default)
- [ ] No privileged containers

### Network Security
- [ ] Security group only allows ports 80 and 4000
- [ ] S3 block public access enabled
- [ ] DynamoDB not publicly accessible

### Encryption
- [ ] DynamoDB encryption enabled
- [ ] S3 encryption enabled
- [ ] Secrets Manager encryption enabled

---

## Performance & Monitoring

### CloudWatch Metrics
- [ ] CPU utilization visible (likely < 5% at idle)
- [ ] Memory utilization visible
- [ ] Task count matches desired count (1 or 2)

### CloudWatch Alarms
- [ ] Alarms in OK state (no incidents)
- [ ] Threshold not exceeded during demo
- [ ] Alarm history shows no recent fires

### Health Checks
- [ ] Backend health check passing (30s interval)
- [ ] Frontend health check passing (30s interval)
- [ ] Failed check count = 0

### Auto Scaling
- [ ] Scaling policy configured (CPU 70%, Memory 80%)
- [ ] Can trigger scaling by generating load (optional test)

---

## Cost Verification

### Estimated Monthly Cost
- [ ] ECS Fargate: ~$54
- [ ] DynamoDB: ~$3-5
- [ ] S3: ~$0-1
- [ ] CloudWatch: ~$2
- [ ] Secrets Manager: ~$0.40
- [ ] KMS: ~$2
- [ ] **Total**: ~$61-64/month

### Cost Reduction Options
- [ ] Can scale to 0 tasks: saves ~$54/month
- [ ] Can destroy infrastructure: saves ~$61/month
- [ ] Can set shorter log retention: saves ~$2/month

---

## Demo Preparation

### Demo Script (3 minutes)
1. **Open frontend** (http://<frontend-ip>)
   - Show login page
   - Log in as student

2. **Place an order** (1 min)
   - Click "New Order"
   - Upload sample PDF
   - Set print options
   - Show live cost calculation
   - Click "Place Order"
   - Show order token (e.g., CP-1042)

3. **Simulate payment** (30 sec)
   - Click "Pay Now (Simulated)"
   - Show order status updated to "paid"

4. **Show staff view** (1 min 30 sec)
   - Log in as staff
   - Show order queue
   - Show order details (file, requirements)
   - Click "Accept Order"
   - Show status progression

5. **Show monitoring** (optional)
   - CloudWatch logs
   - Application metrics
   - ECS service details

### Demo Talking Points
- [ ] Explain the problem: students waiting in Xerox queue
- [ ] Explain the solution: digital ordering system
- [ ] Explain the architecture: Docker → ECS → DynamoDB
- [ ] Explain the AWS services: ECR, ECS, DynamoDB, S3, CloudWatch, IAM
- [ ] Explain cost optimization: serverless, on-demand billing
- [ ] Explain security: IAM roles, encryption, no hardcoded secrets
- [ ] Explain scalability: auto-scaling, health checks

### Backup Plan (If Deployment Fails)
- [ ] Have local docker images ready to show
- [ ] Have screenshots prepared
- [ ] Have recorded screen demo
- [ ] Have local dev environment ready to demo

---

## Post-Demo Cleanup (Optional)

### Destroy Infrastructure (Save Money)

**Option 1: Terraform**
```bash
cd aws/terraform
terraform destroy
```

**Option 2: CDK**
```bash
cd aws
npm run destroy
```

**Manual Cleanup Checklist**
- [ ] Destroy CloudFormation stack
- [ ] Delete DynamoDB tables
- [ ] Delete S3 bucket
- [ ] Delete ECR repositories
- [ ] Delete CloudWatch log groups
- [ ] Delete IAM roles
- [ ] Delete Secrets Manager secret
- [ ] Delete KMS keys

### Verify Cleanup
- [ ] No resources visible in AWS Console
- [ ] No unexpected charges on account
- [ ] AWS bill returned to baseline

---

## Final Sign-Off

### Deployment Complete
- [ ] All pre-deployment items checked ✓
- [ ] Docker builds successful ✓
- [ ] AWS infrastructure deployed ✓
- [ ] Services running and healthy ✓
- [ ] Application functional testing passed ✓
- [ ] Security verification passed ✓
- [ ] Monitoring and alerts working ✓
- [ ] Demo prepared and tested ✓

### Team Signatures
- [ ] Backend lead: _______________ Date: _______
- [ ] Frontend lead: _______________ Date: _______
- [ ] DevOps/Cloud lead: _______________ Date: _______

---

**Deployment Status:** ✅ READY FOR AWS CLOUD TREK 2026

**Deployment Date:** _______________
**Deployed By:** _______________
**AWS Account:** 325355906800
**AWS Region:** ap-south-1
**Frontend URL:** http://<frontend-ip>
**Backend URL:** http://<backend-ip>:4000

---

**Last Updated:** AWS Cloud Trek 2026 | CampusPrint Project
