# ?? CampusPrint AWS Deployment - LIVE DEPLOYMENT SUMMARY

## ?? Public Application URLs

- **Primary Production URL (Application Load Balancer)**:
  ?? **http://campusprint-alb-2061311608.ap-south-1.elb.amazonaws.com**

- **Direct Frontend**: `http://13.201.7.235`
- **Direct Backend API**: `http://13.233.88.46:4000`
- **Health Check**: `http://campusprint-alb-2061311608.ap-south-1.elb.amazonaws.com/health`

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
