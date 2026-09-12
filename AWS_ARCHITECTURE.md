# 🏛️ CampusPrint — Complete AWS Cloud Architecture

> **Project**: CampusPrint (Digital Xerox & Stationery Ordering System)  
> **Target Event**: AWS Cloud Trek 2026 — Problem Statement 1  
> **Region**: `ap-south-1` (Asia Pacific - Mumbai)  
> **Permanent Live HTTPS URL**: [https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/login](https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/login)

---

## 1. Executive Architecture Summary

CampusPrint is engineered as a **cloud-native, serverless, and highly available micro-service architecture** on Amazon Web Services (AWS). It separates the interactive Single Page Application (SPA) frontend from the transactional REST API backend while utilizing managed NoSQL persistence and automatic SSL edge termination.

### Key Architectural Traits:
* **Zero-Downtime In-Place Deployments**: All rolling updates to the container images update the existing ECS Fargate tasks behind the Load Balancer without changing the public URL.
* **Dual-Tier Ingress Security**: Traffic passes through an AWS API Gateway (HTTP API v2) for Amazon Trust Services SSL/TLS termination, which then forwards to an internal Application Load Balancer (ALB) with path-based routing.
* **Serverless Elasticity**: Utilizes **AWS Fargate** for container execution and **Amazon DynamoDB** with On-Demand capacity to scale from zero to peak campus load with zero manual infrastructure provisioning.

---

## 2. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph Clients["🌐 Client Layer"]
        Student["📱 Student Browser / Mobile"]
        Staff["💻 Print Shop Operator / Judges"]
    end

    subgraph Ingress["🛡️ Edge Ingress & SSL Termination"]
        APIGW["AWS API Gateway (HTTP API v2)<br/><code>https://effjm7shr3...</code><br/>• TLS 1.2/1.3 SSL Termination<br/>• Amazon Trust Services Wildcard Cert"]
    end

    subgraph VPC["☁️ Amazon VPC (Region: ap-south-1)"]
        ALB["Application Load Balancer (ALB)<br/><code>campusprint-alb</code>"]

        subgraph SecurityGroups["🔒 Network Isolation (Security Groups)"]
            ALB_SG["ALB SG: Ingress Port 80"]
            FE_SG["Frontend SG: Port 80 from ALB Only"]
            BE_SG["Backend SG: Port 4000 from ALB Only"]
        end

        subgraph ECS["🚀 Amazon ECS on AWS Fargate (Serverless Compute)"]
            FESvc["Frontend Task (Nginx)<br/>• React 18 + Vite SPA<br/>• Port 80"]
            BESvc["Backend Task (Node.js/Express)<br/>• REST API + Business Logic<br/>• Port 4000"]
        end
    end

    subgraph ECR["📦 Container Registry"]
        ECR_FE["Amazon ECR<br/><code>campusprint-frontend:latest</code>"]
        ECR_BE["Amazon ECR<br/><code>campusprint-backend:latest</code>"]
    end

    subgraph Data["💾 Database & Persistence Tier"]
        DDB_Users[("Amazon DynamoDB<br/><code>campusprint-users</code><br/>• Auth & User Profiles")]
        DDB_Orders[("Amazon DynamoDB<br/><code>campusprint-orders</code><br/>• Print Jobs & Status History")]
        S3_Bucket[("Storage / File System<br/>• Uploaded PDF Documents")]
    end

    subgraph External["📬 External & Observability"]
        Resend["Resend Email API<br/>• Automated Pickup Receipts"]
        CloudWatch["Amazon CloudWatch<br/>• /ecs/campusprint-frontend<br/>• /ecs/campusprint-backend"]
    end

    %% Connections
    Student -->|HTTPS (Port 443)| APIGW
    Staff -->|HTTPS (Port 443)| APIGW
    APIGW -->|HTTP Proxy| ALB

    ALB -->|Path /*| FESvc
    ALB -->|Path /api/*| BESvc

    ECR_FE -.->|Pulls Image| FESvc
    ECR_BE -.->|Pulls Image| BESvc

    BESvc -->|Reads / Writes| DDB_Users
    BESvc -->|Reads / Writes| DDB_Orders
    BESvc -->|Stores Files| S3_Bucket
    BESvc -->|Dispatches Receipts| Resend

    FESvc --> CloudWatch
    BESvc --> CloudWatch
```

---

## 3. Tier-by-Tier Component Specifications

### A. Edge Ingress & SSL Termination (Amazon API Gateway HTTP API v2)
* **Resource Name**: `campusprint-https` (`effjm7shr3`)
* **Endpoint**: `https://effjm7shr3.execute-api.ap-south-1.amazonaws.com`
* **Purpose**:
  * Provides an official Amazon Trust Services SSL/TLS certificate with green padlock security in all browsers.
  * Solves the default ALB DNS HTTP-only limitation (`*.elb.amazonaws.com` cannot obtain ACM certs directly).
  * Proxy Integration: Routes `$default` requests with `HTTP_PROXY` mode directly to the ALB origin.

### B. Traffic Routing & Load Balancing (AWS Application Load Balancer)
* **Resource Name**: `campusprint-alb`
* **DNS Name**: `campusprint-alb-2061311608.ap-south-1.elb.amazonaws.com`
* **Listeners**: Port 80 (HTTP)
* **Path-Based Routing Rules**:
  | Priority | Path Pattern | Target Group | Port | Destination |
  | :--- | :--- | :--- | :--- | :--- |
  | `10` | `/api*` | `campusprint-tg-backend` | `4000` | Express REST API |
  | `default` | `/*` | `campusprint-tg-frontend` | `80` | Nginx React SPA |
* **Health Checks**:
  * Health check path: `/health` (Returns HTTP `200 OK`)
  * Interval: 30s | Healthy threshold: 5 | Unhealthy threshold: 2

### C. Serverless Compute & Orchestration (Amazon ECS + AWS Fargate)
* **Cluster**: `campusprint-cluster`
* **Services**:
  1. **`campusprint-frontend`**:
     * **Runtime**: Nginx on Alpine Linux.
     * **Contents**: Production-minified React 18 + Vite SPA bundle.
     * **SPA Fallback Routing**: Uses `try_files $uri $uri/ /index.html;` so direct URLs like `/login`, `/about`, `/order`, and `/staff` work on reload.
  2. **`campusprint-backend`**:
     * **Runtime**: Node.js 20 on Alpine Linux.
     * **Contents**: Express.js REST API.
     * **Responsibilities**:
       * User registration, bcrypt password hashing, and JWT token issuance.
       * Binary PDF arrayBuffer inspection and accurate page count extraction.
       * Dynamic print pricing algorithms (B&W vs Color, binding options, copies).
       * Order status state machine (`placed` $\rightarrow$ `accepted` $\rightarrow$ `processing` $\rightarrow$ `ready` $\rightarrow$ `completed`).

### D. Container Registry (Amazon ECR)
* **Repositories**:
  * `666036096455.dkr.ecr.ap-south-1.amazonaws.com/campusprint-frontend`
  * `666036096455.dkr.ecr.ap-south-1.amazonaws.com/campusprint-backend`
* **Configuration**:
  * AES-256 Server-Side Encryption enabled.
  * Tag Mutability: `MUTABLE` to facilitate continuous deployment with `:latest`.

### E. Persistence Layer (Amazon DynamoDB)
* **Capacity Mode**: On-Demand (PAY_PER_REQUEST — zero management, auto-scaling).
* **Encryption**: AWS KMS / AES-256 Server-Side Encryption.
* **Tables**:
  1. **`campusprint-users`**:
     * **Partition Key**: `email` (String)
     * **Attributes**: `name`, `passwordHash`, `role` (`student` | `staff`), `createdAt`.
  2. **`campusprint-orders`**:
     * **Partition Key**: `orderId` (String, e.g. `CP-1042`)
     * **Attributes**: `userId`, `userName`, `fileName`, `fileSizeBytes`, `pages`, `options` (copies, colorMode, sided, paperSize, binding, notes), `cost`, `paymentMethod`, `paymentStatus`, `status`, `statusHistory`, `createdAt`, `updatedAt`.

---

## 4. Network Security & Firewall Rules

```
[ Public Internet ]
        │
        ▼ (HTTPS : 443 - SSL TLS 1.2/1.3)
[ AWS API Gateway v2 ]
        │
        ▼ (HTTP : 80 - VPC Ingress)
[ AWS Application Load Balancer ]
        │
        ├────────────────────────────────────┐
        ▼ (Port 80)                          ▼ (Port 4000)
[ Frontend SG: Port 80 from ALB Only ]   [ Backend SG: Port 4000 from ALB Only ]
        │                                    │
        ▼                                    ▼
[ ECS Frontend Task ]                    [ ECS Backend Task ]
                                             │
                                             ▼ (AWS SDK / IAM Roles)
                                         [ DynamoDB & S3 ]
```

1. **VPC Isolation**: Containers run inside private subnets without public static IP addresses.
2. **Security Groups**:
   * The backend container (Port 4000) **rejects all traffic from the public internet**. It strictly permits incoming connections originating from the ALB Security Group.
3. **Application Security**:
   * **Authentication**: Signed JWT tokens (`Authorization: Bearer <token>`) are validated on every order creation, query, and status change.
   * **Role-Based Access Control (RBAC)**: Student accounts cannot access `/api/staff/*` endpoints (returns `403 Forbidden`).
   * **File Upload Protections**: Multer limits uploads to 25MB, verifies PDF MIME types, and sanitizes filenames.

---

## 5. Deployment & CI/CD Lifecycle

The project includes an automated PowerShell deployment script (`deploy.ps1`) integrated into `package.json`:

```powershell
# Deploy frontend changes in-place (URL never changes)
npm run deploy

# Or target specific services
.\deploy.ps1 -Target frontend
.\deploy.ps1 -Target backend
.\deploy.ps1 -Target both
```

### In-Place Rolling Deployment Flow:
1. Authenticates Docker with Amazon ECR via `aws ecr get-login-password`.
2. Builds the updated Docker container with production minification.
3. Pushes the container image to Amazon ECR tagged `:latest`.
4. Triggers an ECS rolling update (`aws ecs update-service --force-new-deployment`).
5. Dynamically registers the new task's private IP with the ALB target group and deregisters the old task after passing health checks.
6. **Zero URL Change**: The live links remain identical and permanent.

---

## 6. Official Deployment Links Reference

| Service | Protocol / Port | Endpoint URL | Status |
| :--- | :--- | :--- | :--- |
| **Official Permanent Link** | **HTTPS (443)** | **[https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/login](https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/login)** | ✅ **Active (SSL Secure)** |
| **New Order Creator** | **HTTPS (443)** | **[https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/order](https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/order)** | ✅ **Active** |
| **About & Demo Page** | **HTTPS (443)** | **[https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/about](https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/about)** | ✅ **Active** |
| **Direct Load Balancer** | **HTTP (80)** | [http://campusprint-alb-2061311608.ap-south-1.elb.amazonaws.com](http://campusprint-alb-2061311608.ap-south-1.elb.amazonaws.com) | ⚡ Direct ALB |
| **Backend Health Check** | **HTTPS (443)** | [https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/health](https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/health) | ✅ `200 OK` |
