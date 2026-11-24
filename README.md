# NO EVERYTHING

> *"We exist to create and champion the exceptional through radical elimination of the non-essential."*

**NO EVERYTHING** is a premium, intelligent personal growth ecosystem combining Swiss International Typographic Style, Brutalist Web Design, and Editorial Minimalism. Built with a production-minded full-stack architecture utilizing **Java 17 Spring Boot 3.3.5** and **React 18 + Vite**, it merges stoic discipline, habit tracking, deep focus blocks, competitive NQT exam preparation, and multi-mode Gemini AI intelligence.

---

## 1. Brand Identity & Logo Monogram

- **Name**: NO EVERYTHING
- **Meaning**: There are no unnecessary limits to personal growth, creativity, discipline, and achievement.
- **Custom Monogram**: Geometric `NE` monogram connected through the middle horizontal bar, extending a thin precision line to the right, terminating in a circular point (`NE —●`).
- **Palette**: Monochromatic luxury (`#050505` Deep Black, `#FFFFFF` Pure White, `#F4F3EF` Editorial Off-White, `#888888` Neutral Gray).

---

## 2. Core Modules (12 Complete Working Modules)

| # | Module | Description |
| :--- | :--- | :--- |
| **01** | **User Authentication** | JWT-based auth, BCrypt password hashing, session recovery, strict private data isolation |
| **02** | **Personal Dashboard** | Real-time cockpit, readiness index, streak calculations, habit quick-checks, task radar |
| **03** | **Daily Quotes** | Daily rotating stoic axioms, category filters, randomizer, bookmarking, and clipboard copy |
| **04** | **Habit Tracker** | 7-day completion matrix, verifiable consecutive streak algorithm, categories, protocol creation |
| **05** | **Task & Goal Management** | Priority filters (HIGH, MEDIUM, LOW), due dates, strategic goals with milestone progress bars |
| **06** | **Focus Laboratory** | Pomodoro (25/5/15m) + custom timer, Web Audio binaural 40Hz Gamma & Brown noise generator, persistence |
| **07** | **Private Journal** | Strict private reflection chamber, cognitive mood selector, taxonomy tags, search |
| **08** | **Challenges & Achievements** | Daily/weekly sprints, achievement badges with verifiable threshold unlocks |
| **09** | **Personal Analytics** | Recharts visualization of weekly productivity velocity, 30-day habit rates, focus distribution |
| **10** | **NQT Learning Center** | Practice drills (Java, Python, SQL, Aptitude, OS), timed 15-min mock test arena, verified PYQs |
| **11** | **Gemini AI Mind** | Backend-proxied Gemini 1.5 Flash in 6 modes: Learn, Practice, Doubt, Interview, Exam, Revision |
| **12** | **Profile & Settings** | Identity parameters, avatar selection, daily targets, dark/light theme, password rotation |

---

## 3. Technology Stack

### Backend
- **Language**: Java 17 (OpenJDK / Temurin)
- **Framework**: Spring Boot 3.3.5
- **Security**: Spring Security 6 with stateless JWT authentication
- **Data Persistence**: Spring Data JPA / Hibernate ORM
- **Database**: Dual-mode — persistent embedded H2 file database (zero configuration) + production-ready MySQL 8.0 support
- **AI Integration**: Google Gemini 1.5 Flash via secure backend proxy
- **Build Tool**: Apache Maven 3.9+

### Frontend
- **Framework**: React 18
- **Bundler**: Vite 5
- **Styling**: Swiss Brutalist Custom CSS + Bootstrap 5 utility grid
- **Icons**: Lucide React
- **Visualizations**: Recharts (high-contrast monochrome charts)
- **Audio Engine**: Native HTML5 Web Audio API (zero external asset loading)
- **Celebrations**: Canvas-Confetti

---

## 4. Quick Start (Local Development)

### Default Demo Credentials:
- **Username**: `architect`
- **Password**: `Pass123!`

### Prerequisites:
- Java 17+
- Node.js 18+ and npm
- Maven 3.8+ (or use the provided Maven package)

### Step 1: Run Backend
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
*Backend initializes on `http://localhost:8080` with embedded H2 database in MySQL compatibility mode.*

### Step 2: Run Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` with automated API proxy to port 8080.*

---

## 5. Production Deployment

Consult the detailed guides:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) — Free-tier deployment on Vercel, Render, and MySQL
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) — Complete REST endpoint contracts
- [docker-compose.yml](./docker-compose.yml) — 1-click Dockerized stack with MySQL
