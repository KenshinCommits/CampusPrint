# Deploying CampusPrint backend to AWS

Run all of this **on your own machine** (not in a sandbox) — you need a real AWS
account, `aws configure` already run with your access key, and Docker installed.

I don't have your hackathon's `Deployment_Guide_1.pdf`, so if your org gave you
one, follow its exact naming/steps where it differs from this — judges may expect
specific resource names. This guide covers the general, currently-correct AWS path.

If you run low on time: a fully working **local** demo (`DB_DRIVER=local`, which
you already have working) beats a half-finished AWS deploy. Cut this before you'd
cut a working feature.

## 0. One-time setup
```bash
aws configure          # paste your access key, secret key, region (e.g. us-east-1)
```

## 1. Create the DynamoDB tables
```bash
# in backend/.env, set:
#   DB_DRIVER=dynamodb
#   USERS_TABLE=campusprint_users
#   ORDERS_TABLE=campusprint_orders
npm run init-db
```
This creates both tables with pay-per-request billing (no capacity planning needed).

## 2. Build and push the Docker image to ECR
```bash
export AWS_REGION=us-east-1          # your region
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export REPO=campusprint-backend

aws ecr create-repository --repository-name $REPO --region $AWS_REGION

aws ecr get-login-password --region $AWS_REGION \
  | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker build --platform=linux/amd64 -t $REPO .
docker tag $REPO:latest $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest
docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest
```
`--platform=linux/amd64` matters if you're on a Mac (M1/M2/M3) — Fargate runs x86 by default.

## 3. IAM roles you need (3 total)
- **Task execution role** — lets ECS pull your image from ECR and write logs. Standard `AmazonECSTaskExecutionRolePolicy`.
- **Infrastructure role** — lets Express Mode create the load balancer/networking for you. Standard `AmazonECSInfrastructureRoleforExpressGatewayServices` policy.
- **Task role** — lets your **running container** call DynamoDB. This one needs a custom policy (below) since your app talks to DynamoDB directly.

Easiest path: create the service in the console first (step 4) — it offers
"Create new role" for the execution role and infrastructure role automatically.
For the task role, create it yourself in the IAM console with this policy, then
attach it in the Express Mode form:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["dynamodb:GetItem","dynamodb:PutItem","dynamodb:UpdateItem","dynamodb:Scan","dynamodb:Query"],
    "Resource": "arn:aws:dynamodb:*:*:table/campusprint_*"
  }]
}
```

## 4. Deploy with ECS Express Mode

**Console (recommended if this is your first time):**
1. ECS console → Create → **Express Mode**
2. Container image → Private repository → pick your pushed image (`...campusprint-backend:latest`)
3. Container port: `4000`  ·  Health check path: `/health`
4. Environment variables: `DB_DRIVER=dynamodb`, `JWT_SECRET=<your secret>`, `USERS_TABLE=campusprint_users`, `ORDERS_TABLE=campusprint_orders`
5. Attach the task role from step 3 (so the container can reach DynamoDB)
6. Click Create — takes ~5 min to go from "Provisioning" to "Running"

**Or CLI, once you have the three role ARNs:**
```bash
aws ecs create-express-gateway-service \
  --service-name campusprint-backend \
  --primary-container "image"="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest" \
  --execution-role-arn arn:aws:iam::$ACCOUNT_ID:role/<execution-role-name> \
  --infrastructure-role-arn arn:aws:iam::$ACCOUNT_ID:role/<infrastructure-role-name> \
  --task-role-arn arn:aws:iam::$ACCOUNT_ID:role/<task-role-name> \
  --health-check-path /health \
  --monitor-resources
```
`--monitor-resources` shows live progress in your terminal instead of guessing.

## 5. Verify
```bash
curl https://<the-url-express-mode-gave-you>/health
# should return {"ok":true}
```
Then re-run the same signup/login/order/pay/accept flow you already tested locally, against this URL instead of localhost.

## Frontend note
Once deployed, your frontend's API base URL needs to point at this new HTTPS URL
instead of `localhost:4000` — and if the frontend is on a different domain, `cors()`
in `server.js` currently allows all origins, which is fine for a hackathon demo.
