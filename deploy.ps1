<#
.SYNOPSIS
    Deploys code changes to the permanent AWS deployment without changing the live URL.
.DESCRIPTION
    Builds the Docker containers, pushes to ECR, triggers an ECS rolling update,
    and updates the ALB target group so the permanent link remains unchanged.
.EXAMPLE
    .\deploy.ps1
    .\deploy.ps1 -Target both
    .\deploy.ps1 -Target backend
#>
param(
    [ValidateSet("frontend", "backend", "both")]
    [string]$Target = "frontend"
)

$ErrorActionPreference = "Stop"

$AWS_REGION = "ap-south-1"
$AWS_ACCOUNT_ID = "666036096455"
$ECR_REGISTRY = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
$CLUSTER = "campusprint-cluster"
$FRONTEND_TG = "arn:aws:elasticloadbalancing:ap-south-1:666036096455:targetgroup/campusprint-tg-frontend/ac8024d4104d726c"
$BACKEND_TG = "arn:aws:elasticloadbalancing:ap-south-1:666036096455:targetgroup/campusprint-tg-backend/49847851921a0a39"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CampusPrint: In-Place AWS Rolling Deployment" -ForegroundColor Cyan
Write-Host "  Live URL will NOT change: https://effjm7shr3.execute-api.ap-south-1.amazonaws.com" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

# 1. ECR Login
Write-Host "`n[1/4] Authenticating Docker with Amazon ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
if ($LASTEXITCODE -ne 0) { throw "ECR login failed." }

# 2. Build & Push Frontend
if ($Target -eq "frontend" -or $Target -eq "both") {
    Write-Host "`n[2/4] Building and pushing Frontend image..." -ForegroundColor Yellow
    docker build -t campusprint-frontend:latest -t "$ECR_REGISTRY/campusprint-frontend:latest" ./frontend
    if ($LASTEXITCODE -ne 0) { throw "Frontend docker build failed." }

    docker push "$ECR_REGISTRY/campusprint-frontend:latest"
    if ($LASTEXITCODE -ne 0) { throw "Frontend docker push failed." }

    Write-Host "Triggering ECS frontend rolling update..." -ForegroundColor Yellow
    aws ecs update-service --cluster $CLUSTER --service campusprint-frontend --force-new-deployment --region $AWS_REGION | Out-Null

    Write-Host "Waiting for new ECS frontend task to initialize..." -ForegroundColor Gray
    Start-Sleep -Seconds 20

    $newTasks = aws ecs list-tasks --cluster $CLUSTER --service-name campusprint-frontend --region $AWS_REGION --query "taskArns" --output json | ConvertFrom-Json
    if ($newTasks.Count -gt 0) {
        $taskDetails = aws ecs describe-tasks --cluster $CLUSTER --tasks $newTasks --region $AWS_REGION --query "tasks[*].[taskArn,createdAt,containers[0].networkInterfaces[0].privateIpv4Address]" --output json | ConvertFrom-Json
        $sorted = $taskDetails | Sort-Object { $_[1] } -Descending
        $newIp = $sorted[0][2]
        
        if ($newIp) {
            Write-Host "Registering new frontend IP ($newIp) to ALB target group..." -ForegroundColor Yellow
            aws elbv2 register-targets --target-group-arn $FRONTEND_TG --targets Id=$newIp,Port=80,AvailabilityZone=ap-south-1a --region $AWS_REGION | Out-Null
            
            # Deregister older IPs if any
            if ($sorted.Count -gt 1) {
                for ($i = 1; $i -lt $sorted.Count; $i++) {
                    $oldIp = $sorted[$i][2]
                    if ($oldIp -and $oldIp -ne $newIp) {
                        Write-Host "Deregistering previous target IP ($oldIp)..." -ForegroundColor Gray
                        aws elbv2 deregister-targets --target-group-arn $FRONTEND_TG --targets Id=$oldIp,Port=80,AvailabilityZone=ap-south-1a --region $AWS_REGION | Out-Null
                    }
                }
            }
        }
    }
}

# 3. Build & Push Backend
if ($Target -eq "backend" -or $Target -eq "both") {
    Write-Host "`n[3/4] Building and pushing Backend image..." -ForegroundColor Yellow
    docker build -t campusprint-backend:latest -t "$ECR_REGISTRY/campusprint-backend:latest" ./backend
    if ($LASTEXITCODE -ne 0) { throw "Backend docker build failed." }

    docker push "$ECR_REGISTRY/campusprint-backend:latest"
    if ($LASTEXITCODE -ne 0) { throw "Backend docker push failed." }

    Write-Host "Triggering ECS backend rolling update..." -ForegroundColor Yellow
    aws ecs update-service --cluster $CLUSTER --service campusprint-backend --force-new-deployment --region $AWS_REGION | Out-Null

    Write-Host "Waiting for new ECS backend task to initialize..." -ForegroundColor Gray
    Start-Sleep -Seconds 20

    $newTasks = aws ecs list-tasks --cluster $CLUSTER --service-name campusprint-backend --region $AWS_REGION --query "taskArns" --output json | ConvertFrom-Json
    if ($newTasks.Count -gt 0) {
        $taskDetails = aws ecs describe-tasks --cluster $CLUSTER --tasks $newTasks --region $AWS_REGION --query "tasks[*].[taskArn,createdAt,containers[0].networkInterfaces[0].privateIpv4Address]" --output json | ConvertFrom-Json
        $sorted = $taskDetails | Sort-Object { $_[1] } -Descending
        $newIp = $sorted[0][2]
        
        if ($newIp) {
            Write-Host "Registering new backend IP ($newIp) to ALB target group..." -ForegroundColor Yellow
            aws elbv2 register-targets --target-group-arn $BACKEND_TG --targets Id=$newIp,Port=4000,AvailabilityZone=ap-south-1a --region $AWS_REGION | Out-Null
            
            if ($sorted.Count -gt 1) {
                for ($i = 1; $i -lt $sorted.Count; $i++) {
                    $oldIp = $sorted[$i][2]
                    if ($oldIp -and $oldIp -ne $newIp) {
                        Write-Host "Deregistering previous backend target IP ($oldIp)..." -ForegroundColor Gray
                        aws elbv2 deregister-targets --target-group-arn $BACKEND_TG --targets Id=$oldIp,Port=4000,AvailabilityZone=ap-south-1a --region $AWS_REGION | Out-Null
                    }
                }
            }
        }
    }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  Deployment Completed Successfully!" -ForegroundColor Green
Write-Host "  Permanent Secure HTTPS Link (Unchanged):" -ForegroundColor Cyan
Write-Host "  👉 https://effjm7shr3.execute-api.ap-south-1.amazonaws.com" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
