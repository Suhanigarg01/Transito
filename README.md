# TransitOps — Smart Transport Operations Platform

> Built for the Odoo Hackathon. TransitOps is an end-to-end fleet operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management — replacing manual spreadsheets and logbooks with a single console that enforces real business rules and gives each role its own operational view.

---

## ✨ Highlights

- **Four roles, four apps.** Strict role-based access control (RBAC) means the Fleet Manager, Driver, Safety Officer and Financial Analyst each see a different navigation, a different set of actions, and a different dashboard — all backed by one source of truth.
- **A real trip lifecycle.** `Draft → Dispatched → Completed / Cancelled`, with automatic cascades: dispatching a trip flips the vehicle and driver to *On Trip* and snapshots the odometer; completing it frees them and computes the actual distance.
- **Guardrails, not just forms.** The backend refuses unsafe operations — you can't dispatch a retired/in-shop vehicle, assign a suspended or expired-licence driver, double-book someone already on a trip, or overload a vehicle past its capacity.
- **Money that adds up.** Fuel and repair costs roll up into per-vehicle ROI, with CSV export for the finance team.
- **Enforced twice.** Every rule is checked on the client (for UX) *and* independently on every API endpoint (for security) — hiding a button is never the only thing standing between a user and an action.

---

## 👥 Roles & Permissions

| Capability | Fleet Manager | Driver | Safety Officer | Financial Analyst |
|---|:---:|:---:|:---:|:---:|
| Dashboard (role-specific) | ✅ Fleet overview | ✅ Dispatch board | ✅ Compliance | ✅ Profitability |
| Vehicle registry (CRUD) | ✅ | — | — | — |
| Maintenance (manage) | ✅ | — | — | 👁 read (cost review) |
| Trip lifecycle (create/dispatch/complete/cancel) | — | ✅ | — | — |
| Driver compliance (CRUD, suspend, licences) | — | — | ✅ | — |
| Expenses / fuel logs (CRUD) | — | — | — | ✅ |
| Reports & ROI (view + export) | — | — | — | ✅ |

Read access to vehicles and drivers stays open to any authenticated user (a driver needs them in dispatch dropdowns; the analyst needs vehicles for cost filters) — but every *mutating* action and every sensitive report is locked to its owning role.

---

## 🛠 Tech Stack

**Frontend**
- React 19 + Vite
- React Router 7
- Tailwind CSS v4
- Axios (token interceptor + auto-logout on 401)

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon serverless)
- JWT auth (`jsonwebtoken`) + `bcryptjs`
- `zod` request validation

---

## 📁 Project Structure

```
Transito/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── api/            # axios instance + one module per resource
│       ├── auth/           # RBAC permissions map
│       ├── components/     # shell, sidebar, topbar, shared UI
│       ├── features/       # domain UI (dashboard, vehicles, trips, …)
│       └── pages/          # routed pages (Home, Login, Dashboard, …)
└── server/                 # Express + Prisma backend
    ├── prisma/             # schema.prisma, migrations, seed
    └── src/
        ├── routes/         # route definitions + RBAC (authorize)
        ├── controllers/    # thin HTTP handlers
        ├── services/       # business logic + transactions
        ├── validators/     # zod schemas
        ├── middleware/     # auth, validation, error handling
        └── utils/          # JWT, enums↔labels, presenters
```

---

## 🚦 Trip Lifecycle & Business Rules

```
          dispatch                complete
 Draft ─────────────▶ Dispatched ───────────▶ Completed
   │                      │
   │ cancel               │ cancel
   ▼                      ▼
 Cancelled            Cancelled
```

On **dispatch**, the server (inside a single DB transaction) rejects the request if:
- the vehicle is not `AVAILABLE` (i.e. Retired, In Shop, or already On Trip),
- the driver is not `AVAILABLE` (i.e. Suspended, Off Duty, or already On Trip),
- the driver's licence has expired, or
- the cargo weight exceeds the vehicle's maximum load capacity.

Otherwise it flips the vehicle and driver to `ON_TRIP` and records the start odometer. **Complete** captures the closing odometer, computes actual distance, and returns both to `AVAILABLE`. Because it's transactional, a dispatch either fully succeeds or fully rolls back — no vehicle is ever left "busy" for a trip that didn't launch.

---

## 💰 ROI Reporting

Per-vehicle return is derived from completed-trip revenue and recorded costs:

```
ROI  =  Revenue − (Maintenance + Fuel)
        ───────────────────────────────
               Acquisition Cost
```

The Reports view also surfaces operational cost per vehicle and fuel efficiency (km/L), and exports the table to CSV.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (a free [Neon](https://neon.tech) project works well)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # then fill in the values (see below)
npm run prisma:migrate    # apply schema to the database
npm run seed              # load demo users, vehicles, drivers, trips
npm run dev               # starts on http://localhost:4000
```

**`server/.env`**

```env
# Neon Postgres
DATABASE_URL="postgresql://…?sslmode=require"   # pooled — runtime queries
DIRECT_URL="postgresql://…?sslmode=require"     # direct — migrations only

# Auth
JWT_SECRET="a-long-random-string"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"             # comma-separate multiple origins
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env      # set VITE_API_URL to your backend
npm run dev               # starts on http://localhost:5173
```

**`client/.env`**

```env
VITE_API_URL=http://localhost:4000/api
```

> Make sure `VITE_API_URL` points at the backend's port, and that the backend's `CORS_ORIGIN` includes the frontend's origin — otherwise the browser blocks requests with a CORS error.

---

## 📡 API Reference

Base URL: `/api` · All routes except `auth` and `health` require `Authorization: Bearer <token>`.

| Method | Endpoint | Allowed roles |
|---|---|---|
| `POST` | `/auth/register` | public |
| `POST` | `/auth/login` | public |
| `GET`  | `/auth/me` | authenticated |
| `GET`  | `/vehicles`, `/vehicles/:id` | authenticated |
| `POST` `PUT` `DELETE` | `/vehicles`… | Fleet Manager |
| `GET`  | `/drivers`, `/drivers/:id` | authenticated |
| `POST` `PUT` `DELETE` | `/drivers`… | Safety Officer |
| `GET`  | `/trips`, `/trips/:id` | authenticated |
| `POST` | `/trips`, `/trips/:id/dispatch`, `/trips/:id/complete`, `/trips/:id/cancel` | Driver |
| `GET`  | `/maintenance` | Fleet Manager, Financial Analyst |
| `POST` `PUT` `DELETE` `POST /:id/close` | `/maintenance`… | Fleet Manager |
| `GET` `POST` `PUT` `DELETE` | `/expenses`… | Financial Analyst |
| `GET`  | `/dashboard/summary` | authenticated |
| `GET`  | `/reports` | Financial Analyst |
| `GET`  | `/health` | public |

---

## 🧱 Data Model (Prisma)

- **User** — login account with a `role` (`FLEET_MANAGER` · `DRIVER` · `SAFETY_OFFICER` · `FINANCIAL_ANALYST`), optionally linked to a Driver.
- **Vehicle** — registration, type, capacity, odometer, acquisition cost, status (`AVAILABLE` · `ON_TRIP` · `IN_SHOP` · `RETIRED`).
- **Driver** — licence number/category/expiry, safety score, status (`AVAILABLE` · `ON_TRIP` · `OFF_DUTY` · `SUSPENDED`).
- **Trip** — source/destination, cargo weight, planned/actual distance, revenue, lifecycle timestamps and odometer readings, status (`DRAFT` · `DISPATCHED` · `COMPLETED` · `CANCELLED`).
- **MaintenanceLog** — type, cost, service date, status (`OPEN` · `CLOSED`); an open record puts its vehicle `IN_SHOP`.
- **Expense** — fuel logs and operating costs (type, amount, litres, odometer, date).

---

