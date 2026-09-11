# CampusPrint Backend

Digital print-ordering backend. Students upload a doc + pick options → get a cost
+ token. Staff process the queue. Matches the PRD's API surface exactly.

## Run locally (no AWS needed) - 2 minute setup
```bash
npm install
cp .env.example .env
npm run seed      # creates staff@campusprint.com / staff123
npm start          # http://localhost:4000
```
`DB_DRIVER` defaults to `local` — everything is stored in `data/db.json`, a plain
file. No database server, no AWS account needed to build and demo the whole app.

## Switch to real AWS (DynamoDB + ECS)
See `DEPLOY.md`. Short version: set `DB_DRIVER=dynamodb` in `.env`, run
`npm run init-db` once, then follow the Docker/ECR/ECS steps there. The routes
never change — same code, different data store.

## API surface
| Method | Path | Who | What |
|---|---|---|---|
| POST | `/api/auth/signup` | anyone | create account (student or staff) |
| POST | `/api/auth/login` | anyone | get a JWT |
| GET | `/api/auth/me` | logged in | who am I |
| POST | `/api/orders` | student | upload file + options → order + cost |
| GET | `/api/orders/mine` | student | my order history |
| GET | `/api/orders/:id` | owner/staff | one order's detail |
| POST | `/api/orders/:id/pay` | student | simulate payment |
| DELETE | `/api/orders/:id` | student | cancel (only if still `placed`) |
| GET | `/api/staff/orders` | staff | queue, filter by `?status=&q=` |
| GET | `/api/staff/orders/:id/file` | staff | download the uploaded file |
| PATCH | `/api/staff/orders/:id/status` | staff | accept/reject/advance status |
| GET | `/api/staff/stats` | staff | counts per status, today's total |

## Order status flow
`placed → accepted → processing → ready → completed`
(or `placed/accepted → rejected`, or `placed → cancelled` by the student)

## What's already tested and working
Signup, login, file upload + cost calc, simulated payment, staff queue, accept →
status update, stats — all verified end-to-end against the local driver.

## What's next / not done yet
- DynamoDB driver is written but not yet tested against real AWS (needs your credentials)
- S3 file storage and SSM Parameter Store are optional stretch goals — not built yet, ask if you want them
- No automated tests beyond the manual flow above
