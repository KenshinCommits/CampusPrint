# 🚀 CampusPrint AWS Deployment - LIVE DEPLOYMENT SUMMARY

## 🌐 Public Application URLs

- **Primary Permanent URL (HTTPS Secure with SSL)**:
  👉 **https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/login**

- **Direct Load Balancer**: `http://campusprint-alb-2061311608.ap-south-1.elb.amazonaws.com`
- **Health Check**: `https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/health` (200 OK)

---

## ?? Demo Accounts

| Role | Email | Password |
|---|---|---|
| Student | `student@campusprint.demo` | `student123` |
| Shop Staff | `staff@campusprint.demo` | `staff123` |

---

## ?? AWS Resources Created & Active

- **ECS Cluster**: `campusprint-cluster` (ACTIVE)
- **Application Load Balancer**: `campusprint-alb` (ACTIVE)
  - DNS: `campusprint-alb-2061311608.ap-south-1.elb.amazonaws.com`
  - Listener: HTTP Port 80
  - Rules: Path `/api*` -> Backend, Default `/*` -> Frontend
- **Target Groups**:
  - `campusprint-tg-frontend` (Port 80, Health: healthy)
  - `campusprint-tg-backend` (Port 4000, Health: healthy)
- **ECR Repositories**:
  - `666036096455.dkr.ecr.ap-south-1.amazonaws.com/campusprint-frontend:latest`
  - `666036096455.dkr.ecr.ap-south-1.amazonaws.com/campusprint-backend:latest`
- **Fargate Services**:
  - `campusprint-frontend` (Desired: 1, Running: 1)
  - `campusprint-backend` (Desired: 1, Running: 1)
