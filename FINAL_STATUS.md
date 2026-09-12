# 🚀 CAMPUSPRINT - OFFICIAL AWS DEPLOYMENT

## 🌐 Official Permanent Deployment URL (HTTPS Secure)
👉 **https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/login**

- **Protocol**: HTTPS (Port 443) with Amazon Trust Services SSL/TLS
- **Direct ALB**: http://campusprint-alb-2061311608.ap-south-1.elb.amazonaws.com
- **Infrastructure**: AWS API Gateway HTTP API + Application Load Balancer + AWS ECS Fargate
- **Region**: `ap-south-1` (Mumbai)
- **Database**: AWS DynamoDB (`campusprint-users` & `campusprint-orders`)
- **Health Check**: https://effjm7shr3.execute-api.ap-south-1.amazonaws.com/health (200 OK)

---

## ?? Note on Browser "Not Secure" Notice
Modern browsers (Chrome/Edge/Safari) display a neutral grey `"Not Secure"` label next to any standard `http://` URL (port 80).
- In AWS, all default ALB DNS names (`*.elb.amazonaws.com`) and ECS public IPs are HTTP.
- AWS Certificate Manager (ACM) does not issue free SSL certificates to Amazon-owned domain names (`*.elb.amazonaws.com`) without a custom registered domain.
- This is **100% standard and expected** for hackathons (like AWS Cloud Trek) and project evaluations. The site is fully functional with zero blocks or restrictions.

---

## ? One-Click Demo Accounts (On Login Screen!)

The login page includes a prominent **"? Judges One-Click Demo Logins"** box:
1. ????? **Demo Student**: `student@campusprint.demo` / `student123`
2. ????? **Shop Staff**: `staff@campusprint.demo` / `staff123`
3. ?? **Ananya Iyer**: `ananya@campusprint.demo` / `demo123`
4. ?? **Karthik Rao**: `karthik@campusprint.demo` / `demo123`
