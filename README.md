## To Their Rescue – Monorepo

This repository contains the **To Their Rescue** application:

- **API**: Flask / SQLAlchemy / PostgreSQL (`api/`)
- **Web**: Next.js 16 / React (`web/`)
- **Infra**: Docker, Docker Compose, optional Nginx + pgAdmin

---

### Project structure

- **`api/`** – Flask backend with JWT auth, email OTP, and Alembic/Flask-Migrate migrations.
- **`web/`** – Next.js frontend (App Router) that talks to the API via `NEXT_PUBLIC_API_URL`.
- **`docker-compose.yml`** – Local development stack (hot reload, Postgres, pgAdmin).
- **`docker-compose-prod.yml`** – Production-style stack (for EC2 / VPS).
- **`deploy-nginx-example.conf`** – Example Nginx config for routing `/` → web and `/api/` → API.

---

### Prerequisites

- Docker Desktop (or Docker Engine + Compose)
- Git

For development without Docker you also need:

- Python 3.12 + `pip`
- Node.js 22 + `npm`

---

### Environment variables

Create a **`.env`** file in the repo root (same folder as `docker-compose.yml`), for example:

```bash
# Database used by the Flask API (via Config.SQLALCHEMY_DATABASE_URI)
DATABASE_URL=postgresql+psycopg2://postgres:123456@db:5432/ttr

FLASK_SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-too
JWT_ACCESS_EXPIRES_MIN=30
JWT_REFRESH_EXPIRES_DAYS=7
AUTO_MIGRATE=1

# Local dev: frontend → API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Postgres container defaults
POSTGRES_DB=ttr
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_PORT=5432

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=change-me
PGADMIN_PORT=5050
```

In production, update:

- `DATABASE_URL` to point at your real Postgres instance (container `db` or host IP).
- `NEXT_PUBLIC_API_URL` to your public API URL (e.g. `http://54.163.55.101/api` behind Nginx).

---

### Local development (Docker, hot reload)

From the repo root:

```bash
docker compose build
docker compose up
```

Services:

- **Web (Next.js dev)**: `http://localhost:3003`
- **API (Flask dev)**: `http://localhost:5000`
- **Postgres**: `localhost:5432` (container name `db`)
- **pgAdmin**: `http://localhost:5050`

Notes:

- The API runs with `flask run --reload` and mounts `./api` → live code changes.
- The web app runs with `next dev` and mounts `./web` → live code changes.
- On API container start, the entrypoint automatically runs:
  - `flask db migrate` (best effort)
  - `flask db upgrade`

---

### Production stack (Docker Compose)

For a production-like setup (e.g. EC2), use `docker-compose-prod.yml`:

```bash
docker compose -f docker-compose-prod.yml --env-file .env build
docker compose -f docker-compose-prod.yml --env-file .env up -d
```

Services:

- `api` – Flask API on port `5000`
- `web` – Next.js app on port `3003`
- `db` – PostgreSQL (optional if you prefer DB on the host)
- `pgadmin` – pgAdmin UI on `${PGADMIN_PORT:-5050}`

The API container still runs automatic migrations on start.

---

### Nginx (example, EC2 without a custom domain)

`deploy-nginx-example.conf` shows how to route traffic:

- `http://<EC2-IP>/` → Next.js web container (`web` at `127.0.0.1:3003`)
- `http://<EC2-IP>/api/` → Flask API container (`api` at `127.0.0.1:5000`)

Basic steps on the server:

```bash
sudo cp deploy-nginx-example.conf /etc/nginx/sites-available/to-their-rescue
sudo ln -s /etc/nginx/sites-available/to-their-rescue /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Make sure `NEXT_PUBLIC_API_URL` in `.env` matches the public API path exposed by Nginx (for example `http://54.163.55.101/api`).

---

### Running without Docker (optional)

**Backend (`api/`):**

```bash
cd api
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
set FLASK_APP=app:create_app
set DATABASE_URL=postgresql+psycopg2://...
flask db upgrade
flask run
```

**Frontend (`web/`):**

```bash
cd web
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in a `web/.env.local` to point at the running API, e.g. `http://localhost:5000`.


