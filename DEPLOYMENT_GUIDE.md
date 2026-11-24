# NO EVERYTHING — Deployment & Infrastructure Guide

This guide details zero-cost, free-tier-first deployment procedures for the **NO EVERYTHING** full-stack personal growth platform.

---

## Architecture Overview

```
                      ┌─────────────────────────────────┐
                      │        Vercel (Frontend)        │
                      │        React 18 + Vite          │
                      │  https://no-everything.vercel.app │
                      └────────────────┬────────────────┘
                                       │ HTTPS / REST API
                                       ▼
                      ┌─────────────────────────────────┐
                      │         Render / Railway        │
                      │   Spring Boot 3.3.5 / Java 17   │
                      │  https://api.noeverything.com   │
                      └────────────────┬────────────────┘
                                       │ JDBC (SSL)
                                       ▼
                      ┌─────────────────────────────────┐
                      │   Managed MySQL (Free Tier)     │
                      │    Aiven / Clever Cloud / H2    │
                      └─────────────────────────────────┘
```

---

## 1. Frontend Deployment (Vercel)

### Prerequisites:
- A GitHub repository containing the codebase.
- A free account on [Vercel](https://vercel.com/).

### Deployment Steps:
1. Log in to Vercel and click **Add New > Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: The public HTTPS URL of your deployed backend (e.g. `https://no-everything-api.onrender.com`).
5. Click **Deploy**.
6. The `frontend/vercel.json` file automatically ensures clean client-side routing rewrites for all single-page application paths.

---

## 2. Backend Deployment (Render)

Render provides a native Web Service tier that can run Docker containers or Maven builds.

### Step-by-Step Render Deployment:
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com/).
3. Click **New + > Web Service**.
4. Connect your GitHub repository.
5. Configuration:
   - **Name**: `no-everything-backend`
   - **Region**: Closest to your users (e.g., Frankfurt, Oregon, Singapore).
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (Render will automatically detect `backend/Dockerfile`), or `Java` with build command `mvn clean package -DskipTests` and start command `java -jar target/no-everything-backend-1.0.0.jar`.
   - **Instance Type**: `Free`
6. Add Environment Variables in the Render Dashboard:

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<host>:<port>/<db>?useSSL=true` | Managed MySQL Connection URL |
| `SPRING_DATASOURCE_USERNAME` | `<db_username>` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `<db_password>` | Database password |
| `SPRING_DATASOURCE_DRIVER` | `com.mysql.cj.jdbc.Driver` | MySQL Driver Class |
| `JWT_SECRET` | 256-bit Hex string (e.g. from `.env.example`) | Key for signing and verifying JWTs |
| `GEMINI_API_KEY` | Your Google AI Studio API key | Unlocks live Gemini 1.5 Flash in 6 modes |
| `FRONTEND_ORIGIN` | `https://your-vercel-domain.vercel.app` | Allowed CORS origins |

> [!NOTE]
> If you leave `SPRING_DATASOURCE_URL` blank, the backend will automatically spin up with the embedded, persistent file-based H2 database running in MySQL-compatible mode with zero external dependencies!

---

## 3. Free-Tier Managed Database Options

| Provider | Free Tier Specification | Lifespan / Notes |
| :--- | :--- | :--- |
| **Aiven for MySQL** | 1 free project, 5GB storage, 1GB RAM | Highly stable, SSL-enforced, ideal for production. |
| **Clever Cloud** | Free shared MySQL add-on (up to 20MB) | Simple, instant provisioning. |
| **Railway** | Starter trial credits | MySQL template deployable in 1 click. |
| **Embedded H2 (Default)** | Zero-cost, runs inside the JVM | Persistent on local disk; requires no external services. |

---

## 4. Local Full-Stack Development

### Option A: Direct Local Execution
```bash
# Terminal 1: Start Backend (Port 8080)
cd backend
mvn spring-boot:run

# Terminal 2: Start Frontend (Port 5173)
cd frontend
npm run dev
```

### Option B: Docker Compose (All Services + MySQL)
```bash
docker-compose up --build
```
This automatically boots:
- MySQL 8.0 on `localhost:3306`
- Spring Boot REST API on `localhost:8080`
- Configures database seeding and table schemas automatically.
