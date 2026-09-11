# CampusPrint — Digital Xerox & Stationery Ordering System
**AWS Cloud Trek 2026 — Problem Statement 1 | Team of 3 | 12-hour build**

> Rename the project anything you like before you submit — "CampusPrint" is just a placeholder used throughout this codebase (folder names, table names, env vars). If you rename it, do a find-and-replace for `campusprint`.

---

## 1. Problem (from the official PS)

Students queue at the campus Xerox/stationery shop even for simple print jobs, especially at peak hours. Submitting docs over email/WhatsApp and coordinating printing requirements, payment, and pickup wastes time for both students and shop staff, who track everything manually.

**We are not building a robot that controls a physical printer.** We are building the *digital ordering layer* that sits in front of the shop: students upload a document, choose print options, see a price, "pay," get a token, and track status. Staff get a dashboard to process the queue. The shop staff still do the actual printing — we just remove the queueing/coordination pain. This is a much smaller, much more winnable scope than "control a printer autonomously," and it's exactly what the PS asks for.

## 2. Goals & Non-Goals

**Goals (what judges will actually check, per the official rubric):**
- Level 1: upload → print requirements → cost calculation → order/token generation → order tracking → staff order processing, with a basic student UI and staff dashboard.
- Level 2: simulated payment + payment tracking, notifications, queue management, ETA, order/payment history, order validation, rejection handling, search/filter, handling multiple orders efficiently.
- Level 3: deploy with Docker, Amazon ECR, Amazon ECS, and Amazon DynamoDB.

**Non-goals (cut these if time is short — nobody will dock you for skipping them):**
- Real payment gateway integration (Razorpay/Stripe) — a "Simulate Payment" button that flips a status flag satisfies the PS's own wording ("digital *or simulated* payment").
- Real-time push notifications (WebSockets/SMS/email) — an in-app notification/status feed is enough for "notifications."
- Actually sending the file to a physical printer.
- Multi-shop / multi-college support.

## 3. Users & Roles

| Role | Can do |
|---|---|
| **Student** | Sign up/log in, upload a document + choose print options, see live cost, "pay," get a token, track status, view order history, cancel a not-yet-accepted order |
| **Staff** | Log in, see the live queue, open any order (view/download the file + requirements), accept/reject (with reason), move status forward (processing → ready → completed), search/filter orders, see payment status |

Keep auth dead simple: one `role` field (`student` or `staff`) chosen at signup. It's a hackathon demo, not a bank — don't burn time on an admin-approval flow. Seed one staff account via the seed script (see backend README) so you don't even need to sign one up manually during the demo.

## 4. Core Flow

1. Student logs in → **New Order** page → uploads a PDF (drag/drop or file picker) → picks copies, color (B/W or Color), sides (single/double), paper size (A4/A3/Letter), binding (none/stapled/spiral) → app shows **live cost** as options change → student clicks **Place Order** → order is created with status `placed` and a short token like `CP-1042`.
2. Student clicks **Pay Now (Simulated)** → status → `paid` (a real shop would let you pay at pickup too — support both: "Pay Online" or "Pay at Counter").
3. Staff dashboard shows the order in the queue (newest first, filterable by status). Staff opens it, reviews the file + requirements, clicks **Accept** (→ `accepted`) or **Reject** (with a reason, → `rejected`).
4. Staff moves accepted orders through `processing` → `ready for pickup` (this is the moment a real shop physically prints it) → `completed` once collected.
5. Student's **My Orders** page live-reflects status at every step, with a timestamped history ("Order placed 2:03 PM → Accepted 2:10 PM → Ready 2:40 PM").

## 5. Data Model

**Users**
```
email (PK), name, passwordHash, role [student|staff], createdAt
```

**Orders**
```
orderId (PK, = token e.g. "CP-1042"), userId (student email), userName,
fileName, fileKey (path/S3 key), fileSizeBytes, pages,
options: { copies, colorMode[bw|color], sided[single|double], paperSize[A4|A3|Letter], binding[none|staple|spiral], notes },
cost: { perCopy, printCost, bindingCost, total, currency: "INR" },
paymentMethod [online|counter], paymentStatus [unpaid|paid],
status [placed|accepted|rejected|processing|ready|completed|cancelled],
rejectionReason, estimatedReadyAt,
statusHistory: [{ status, at, by }],
createdAt, updatedAt
```

## 6. API Surface

```
POST   /api/auth/signup            { name, email, password, role }
POST   /api/auth/login             { email, password } -> { token, user }
GET    /api/auth/me                (JWT)

POST   /api/orders                 (JWT, multipart: file + options)  -> creates order, computes pages+cost
GET    /api/orders/mine            (JWT)
GET    /api/orders/:id             (JWT, owner or staff)
POST   /api/orders/:id/pay         (JWT owner)  -> simulated payment
DELETE /api/orders/:id             (JWT owner, only if status=placed)

GET    /api/staff/orders           (JWT staff)  ?status=&q=&page=
GET    /api/staff/orders/:id/file  (JWT staff)  -> download original file
PATCH  /api/staff/orders/:id/status (JWT staff)  { status, reason?, estimatedReadyAt? }
GET    /api/staff/stats            (JWT staff)  -> counts per status, today's totals
```

Cost formula (tune the rates in `backend/src/utils/cost.js` — put your own shop's real prices in for the demo, it looks great):
```
perPage      = colorMode === 'color' ? RATE_COLOR : RATE_BW
printCost    = perPage * pages * copies
bindingCost  = BINDING_FEE[binding] * copies
total        = printCost + bindingCost
```

## 7. Tech Stack (mirrors the org's own AWS deployment guide — don't fight it)

- **Frontend:** React + Vite, plain CSS (no Tailwind build step to fight with under time pressure), React Router.
- **Backend:** Node.js + Express, JWT auth (bcrypt + jsonwebtoken), Multer for file upload, `pdf-lib` for automatic page counting (falls back to manual entry if parsing fails).
- **Database:** DynamoDB in production (matches Level 3 requirement exactly — table names `USERS_TABLE`/`ORDERS_TABLE` are env-configurable). **A local JSON-file driver is included so you can build and demo the entire app with zero AWS setup**, then flip `DB_DRIVER=dynamodb` in `.env` when you're ready to deploy. This is the single biggest time-saver in this plan — don't let AWS credential setup block frontend/backend integration work.
- **File storage:** local disk inside the container for the hackathon (zero extra AWS setup). Swap for S3 later if you have spare time (adapter stub included, not required for L1–L3).
- **Deployment:** Docker → Amazon ECR → Amazon ECS (Express Mode), exactly as in your `Deployment_Guide_1.pdf`. Follow **Sections 1–10** of that guide verbatim — the only difference is your image/table names and the extra `ORDERS_TABLE`/S3 env vars.

## 8. Team of 3 — Role Split

Don't work sequentially (frontend waits for backend waits for deploy) — that's how hackathon teams lose. All three tracks start **at the same time** in hour 0, against an agreed-upon API contract (Section 6 above, already fixed for you).

### Person A — Backend & Data
- Own `backend/src/routes/*`, `backend/src/db/*`, `backend/src/utils/cost.js`, `backend/src/utils/pdf.js`.
- Hour 0–1: run the backend locally in `DB_DRIVER=local` mode, confirm `/health` returns `{ok:true}`.
- Hour 1–4: implement/verify auth + orders endpoints (starter code already does this — your job is to read it, adjust cost rates, and add any PS-specific tweak your team wants, e.g. paper size options).
- Hour 4–6: staff endpoints (list/filter/status update), rejection handling, stats.
- Hour 6+: pair with Person C on the DynamoDB switch-over and IAM setup once frontend+backend are integrated and demoed once locally.

### Person B — Frontend & UX
- Own `frontend/src/pages/*`, `frontend/src/api/*`.
- Hour 0–1: `npm run dev`, confirm the starter Login/Signup pages load against the local backend.
- Hour 1–5: build/polish the student flow — upload form with live cost preview, My Orders list with status timeline.
- Hour 5–8: staff dashboard — queue table, filters, accept/reject/status buttons, search.
- Hour 8+: visual polish (this is 30% of what judges remember) — empty states, loading states, a clean color palette, mobile-responsive layout since a demo on a laptop projected to judges still benefits from not looking broken at odd widths.

### Person C — Integration, DevOps & Deployment
- Hour 0–1: read `Deployment_Guide_1.pdf` Sections 1–2 again and get AWS CLI configured + an IAM user created **now**, in parallel with A and B building — don't wait.
- Hour 1–4: while A/B build, prepare `init-db.js`, Dockerfiles (already scaffolded — verify they build), and create the ECR repo (Section 5 of the guide).
- Hour 4–6: first end-to-end local integration test (frontend hitting real backend, both running locally) — fix CORS/env mismatches now, not at hour 11.
- Hour 6–9: build + push Docker images, deploy backend to ECS Express Mode with `DB_DRIVER=dynamodb` and real AWS creds (Sections 7–8 of the guide), run `npm run init-db` against real DynamoDB, verify `/health`.
- Hour 9–10: deploy frontend to ECS (Section 9), then fix `CORS_ORIGIN` on the backend service to the frontend's real URL (Section 10 — **this exact CORS gotcha is called out in your own guide, budget 15–20 min for the ECS env-var update to propagate**).
- Hour 10–12: **own the demo.** Script a 3-minute walkthrough (place an order as a student → show cost calc → simulate payment → switch to staff view → accept → mark ready), take screenshots as a fallback in case live wifi/deploy dies on stage, and prep 3–4 sentences per person on what they built for Q&A.

### Shared, whoever finishes first
- Seed a few realistic demo orders so the staff dashboard isn't empty when judges look at it.
- Write the one-page pitch: problem → solution → what's Level 1/2/3 done → tech stack → live demo link.

## 9. Hour-by-Hour (relative to your remaining time — start now)

| Hours | Milestone |
|---|---|
| 0–1 | Everyone reads this PRD + the starter code. Repo cloned/unzipped on all 3 laptops. Backend running locally (`DB_DRIVER=local`). AWS CLI installed & configured (Person C). |
| 1–4 | Parallel build: backend auth+orders, frontend student flow, AWS IAM/ECR prep. |
| 4–6 | Staff dashboard + staff endpoints. First local frontend↔backend integration test. |
| 6–8 | Level 2 features: payment simulation, rejection handling, search/filter, order history, ETA. |
| 8–9 | Docker build + push to ECR (both images). |
| 9–10.5 | ECS deploy (backend then frontend), DynamoDB live, fix CORS. |
| 10.5–11.5 | Bug bash: click every button as if you were a judge. Seed demo data. |
| 11.5–12 | Final pitch + screenshots + submit. |

If you're behind at hour 8, **cut Level 3 deployment before you cut Level 2 features** — a fully-working local demo with all L1+L2 features scores better on the rubric than a half-broken cloud deployment missing core workflow pieces. A screen-recorded local demo is an acceptable fallback if AWS deployment truly doesn't finish in time.

## 10. Judging Alignment Checklist

- [ ] Upload document, choose requirements, see cost
- [ ] Order/token generated
- [ ] Student can track order status
- [ ] Staff dashboard: view orders, documents, requirements
- [ ] Staff verifies payment status
- [ ] Staff updates orders through completion
- [ ] Simulated payment + payment tracking
- [ ] Notifications/status visible to student in real time (poll or refresh is fine)
- [ ] Queue management + estimated completion time
- [ ] Order/payment history
- [ ] Order validation + rejection handling
- [ ] Search/filter on staff side
- [ ] Deployed with Docker + ECR + ECS + DynamoDB
