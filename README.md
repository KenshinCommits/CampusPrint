# CampusPrint

Digital Xerox & Stationery Ordering System — AWS Cloud Trek 2026, Problem Statement 1.

Read **PRD.md** first — it has the full spec, API contract, and the 3-person work split for your remaining hours. This file is just "how do I run it."

## 1. Run it locally (zero AWS setup — do this first)

Two terminals:

```bash
# Terminal 1 - backend
cd backend
cp .env.example .env      # defaults already work, DB_DRIVER=local
npm install
npm run seed               # creates a staff + student demo login
npm run dev                 # http://localhost:4000

# Terminal 2 - frontend
cd frontend
cp .env.example .env      # defaults already point at localhost:4000
npm install
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173, log in with `student@campusprint.demo` / `student123` (or sign up your own), place an order, then log in as `staff@campusprint.demo` / `staff123` in another browser/incognito window to process it.

Everything is stored in `backend/data/*.json` in this mode — delete that folder to reset. Uploaded files land in `backend/uploads/`.

> Your `npm install` should work fine on your own laptop/venue wifi — this stack (Express, React+Vite, standard npm packages) has no unusual dependencies. If a hackathon venue network blocks the npm registry, tether to a phone hotspot.

## 2. Deploy to AWS (Docker + ECR + ECS + DynamoDB)

Follow your own **`Deployment_Guide_1.pdf`** step by step (Sections 1–10) — this project is deliberately shaped to match it exactly. The only differences from the guide's sample "Notes Saver" app:

| Guide's sample | This project |
|---|---|
| `cloudtrek-users` / `cloudtrek-notes` tables | `campusprint-users` / `campusprint-orders` (or whatever you set `USERS_TABLE`/`ORDERS_TABLE` to) |
| `USERS_TABLE`, `NOTES_TABLE` env vars | `USERS_TABLE`, `ORDERS_TABLE` env vars |
| Backend port 4000 | Same — 4000 |
| Frontend port 80 (nginx) | Same — 80 |

Condensed checklist (see the PDF for click-by-click screenshots):

1. **Section 1** — Install & configure AWS CLI (`aws configure`), verify with `aws sts get-caller-identity`.
2. **Section 2** — Create an IAM user (e.g. `campusprint-dev`) with `AmazonDynamoDBFullAccess`, generate an access key.
3. Set `backend/.env`: `DB_DRIVER=dynamodb`, your `AWS_REGION`, the access key/secret from step 2, and table names.
4. Run `cd backend && npm run init-db` — creates the two DynamoDB tables (on-demand billing).
5. Run `npm run seed` again (now writes into real DynamoDB) so your demo accounts exist in production too.
6. **Section 3** — Install Docker Desktop if you haven't.
7. **Section 4** — Build both images: `docker build -t campusprint-backend ./backend` and `docker build -t campusprint-frontend ./frontend`.
8. **Section 5–6** — Create an ECR repository, create a second IAM user (e.g. `campusprint-ecr`) with `AmazonEC2ContainerRegistryPowerUser`, then tag + push both images (ECR's "View push commands" button gives you the exact commands).
9. **Section 7** — Create an IAM **role** (e.g. `campusprint-backend-task-role`) trusted by ECS Tasks, with `AmazonDynamoDBFullAccess`.
10. **Section 8** — ECS **Express Mode** → deploy the backend image, container port `4000`, health check path `/health`, paste in all the backend env vars (`AWS_REGION`, `USERS_TABLE`, `ORDERS_TABLE`, `JWT_SECRET`, `PORT=4000`, `CORS_ORIGIN=*` for now), attach the task role from step 9. Copy the generated Application URL.
11. Update `frontend/.env`: `VITE_API_URL=<that backend Application URL>` (no trailing slash), rebuild the frontend image, push it again.
12. **Section 9** — ECS Express Mode → deploy the frontend image, container port `80`. Copy its Application URL.
13. **Section 10** — Go back to the **backend** ECS service → Update service → set `CORS_ORIGIN` to the frontend's Application URL (no trailing slash) → wait ~10–15 min for it to roll out. This exact step is the one gotcha called out in your own guide — budget time for it.
14. Open the frontend Application URL and demo it live.

If deployment isn't finishing in time, that's fine — cut it before you cut Level 2 features (see PRD §9). A fully-working local demo (or a short screen recording) still shows the judges everything that matters.

## 3. Project layout

```
backend/    Express API — auth, orders, staff endpoints, cost calculator, DB adapters (local JSON / DynamoDB)
frontend/   React + Vite — student flow (upload/order/track) + staff dashboard
PRD.md      Full spec, API contract, data model, and the 3-person task split
```
