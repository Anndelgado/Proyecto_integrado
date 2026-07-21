# Barranquilla Convive

A school platform for managing and providing early attention to mental
health alerts and school coexistence issues. It lets students take
psychological screening tests, teachers track and assign tests, psychologists
manage their schedule and risk alerts, and administrators oversee users,
institutions, and reports.

All content in this document was verified by running the actual project
(backend + PostgreSQL) end to end, not just by reviewing the code.

## Architecture

Monorepo using **npm workspaces**, with two independent packages:

```
/backend                    REST API in Express + PostgreSQL (pg, no ORM)
  /backend/src/db           connection (pool), automatic migration/initialization, seed data
  /backend/src/lib          generic CRUD router, password hashing (scrypt), signed tokens (HMAC)
  /backend/src/middleware   token verification on protected routes
  /backend/src/routes       login and email/document availability checks
  /backend/src/resources.js catalog of resources exposed by the API (table + allowed columns)

/frontend                   Vanilla JavaScript SPA (no framework), Vite + Tailwind
  /frontend/src/views        one folder per role: admin, teacher, student, psychologist
  /frontend/src/services     one client per resource, all talking to /api/*
```

The backend **does not use an ORM**: it builds SQL queries by hand in
`lib/genericRouter.js`, but safely — each resource declares a whitelist of
allowed columns in `resources.js`, so an arbitrary column name coming from
the client is never interpolated.

## Security

- **Passwords**: never stored or transmitted in plain text. They're hashed
  with `scrypt` (random salt per user) before touching the database, both
  on user registration and on password updates (`backend/src/lib/passwords.js`).
  Verified directly against the `users` table in Postgres.
- **Session**: login (`POST /api/auth/login`) returns a token signed with
  HMAC-SHA256 (`backend/src/lib/tokens.js`), with an expiration. The
  frontend stores it and sends it as `Authorization: Bearer <token>` on
  every request (`frontend/src/http.js`).
- **Per-resource authorization**: `roles` and `instituciones` are publicly
  readable (catalogs); `users` accepts `POST` without a token (registration)
  but requires a token for everything else; the rest of the resources
  (`alertas`, `citas`, `tamizajeResultados`, etc.) always require a token
  (`backend/src/server.js`).
- **Response sanitization**: the generic router strips the `password` field
  out of every `users` response before it's sent back, so a hashed password
  never leaves the API either (`backend/src/lib/genericRouter.js`).
- **Account approval**: a newly registered user is left with
  `estado: "pendiente"`, and login rejects them until an administrator
  switches that to `"activo"`.

## Modules

- **Registration and approval**: on sign-up, the student/teacher picks their
  institution by code (`IED-XXXX`); the frontend resolves that code to the
  real `institucionId` before creating the user. The administrator approves
  pending accounts from their panel.
- **Psychological screening**: the psychologist enables tests for students
  (`tamizajeHabilitaciones`); the student takes them, and the result
  (`tamizajeResultados`, with risk level and critical answers stored as
  JSONB) can trigger an alert.
- **Student wellness tests** (Anxiety, Stress, Self-esteem): stored in
  `testResultados`, with persistent history.
- **Test assignment by teachers**: teachers assign these same tests to
  their students (`testAsignaciones`).
- **Alerts and follow-up**: risk alerts (`alertas`) with a follow-up log
  (`seguimientos`) and notifications (`notificaciones`).
- **Psychologist's schedule**: appointments (`citas`) with students,
  persisted in Postgres (they survive a server restart).

## How to run it

### Requirements

- Node.js 18+
- PostgreSQL running locally (native, no Docker)

### 1. Install dependencies (once, from the root)

```bash
npm install
```

This installs `backend/` and `frontend/` together (they're npm workspaces).

### 2. Set up the database

```bash
createdb barranquilla_convive
cp backend/.env.example backend/.env
```

Adjust `DATABASE_URL` in `backend/.env` with your local Postgres password,
and replace `SESSION_SECRET` with your own random key (don't leave the
example value in a real environment).

You only need an empty database: on startup, the backend creates the tables
from `backend/src/db/schema.sql` and seeds sample data automatically if none
is found — no manual migrations required.

### 3. Start everything with a single command

```bash
npm run dev
```

This waits for Postgres to be available on port 5432, then starts in
parallel:

- **Backend** → `http://localhost:4000`
- **Frontend** → `http://localhost:5173`, with Vite proxying `/api/*` to
  the backend (avoids CORS/port issues in development).

Open `http://localhost:5173`.

### Other commands

```bash
npm run build      # production build of the frontend
npm run preview    # serves the production build locally
```

### Test users (seeded automatically)

| Role | Document | Password |
|---|---|---|
| Administrator | 1000000000 | admin123 |
| Student | 1122334455 | estudiante123 |
| Teacher | 1098765432 | docente123 |
| Psychologist | 1054789632 | psicologo123 |

## API structure

Base URL: `http://localhost:4000/api`

```
GET  /health                     server status and Postgres connection

POST /auth/login                 { documento, password } -> { token, user }

GET  /users/check?correo=...      checks whether an email/document is already registered
GET  /users/check?documento=...
POST /users                       public registration (initial state: "pendiente")
GET|PUT|DELETE /users/:id         require a token

GET  /roles                       catalog, public
GET  /instituciones                catalog, public

GET|POST /<resource>               list (supports ?field=value and ?_sort=field&_order=asc|desc) / create
GET|PUT|PATCH|DELETE /<resource>/:id
```

Available resources (all require a token except `roles`/`instituciones`, and
`users`' `POST`): `cursos`, `alertas`, `seguimientos`, `notificaciones`,
`tamizajeHabilitaciones`, `tamizajeResultados`, `citas`, `testResultados`,
`testAsignaciones`.

##Team

Kerlys Bello — Scrum Master
Yulianis Delgado — Product Owner
Kevin Villalobos — Backend
Santiago Otalora — Backend 
David Carrascal — Frontend
Camilo Villalobos — Backend

# 239-barranquilla-convive
Academic project repository for Barranquilla Convive (ID: 239)

