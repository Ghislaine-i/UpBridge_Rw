# UpBridge Rwanda — Full-Stack Web Application

> **Learn. Build. Get Hired.**
> A student-facing platform for learning, portfolio building, and opportunity discovery in Rwanda.

---

## 🌍 Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Render)** |https://upbridge-rw-1.onrender.com/ |
| **Backend API (Render)** | https://upbridge-rw.onrender.com/api/health |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Axios, Lucide |
| Backend | Node.js, Express 4, mysql2, jsonwebtoken |
| Database | MySQL 8.x (Aiven Cloud) |
| Deployment | Render (Frontend + Backend), Aiven (MySQL) |

---

## Default Admin Credentials

```
Email:    admin@upbridge.rw
Password: Admin@1234
```

---

## Prerequisites (Local Development Only)

Before running the project locally you must have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | ≥ 18.x | https://nodejs.org |
| MySQL Server | ≥ 8.0 | https://dev.mysql.com/downloads/mysql/ |

> ⚠️ MySQL Workbench and MySQL Shell alone are NOT enough. You need MySQL Server installed and the MySQL80 (or similar) Windows service running.

### Install MySQL Server
1. Download the MySQL Community Server installer from https://dev.mysql.com/downloads/mysql/
2. Run the installer and choose **Server only** or **Developer Default**
3. Set or leave blank the root password (match what you put in `.env`)
4. After installation, confirm the service is running:

```powershell
Get-Service MySQL80
# Status should be: Running
```

If it's stopped, start it:
```powershell
net start MySQL80
```

---

## Project Structure

```
upbridge-rwanda/
├── server/          # Express API (Node.js)
│   ├── config/      # DB pool + JWT helpers
│   ├── controllers/ # Route handlers
│   ├── database/    # schema.sql, seed_courses.sql
│   ├── middleware/  # auth, error, validators
│   ├── models/      # SQL queries
│   ├── routes/      # Express routers
│   ├── .env         # Environment variables (do NOT commit)
│   ├── setupDb.js   # One-time DB setup script
│   └── server.js    # Entry point
└── client/          # React + Vite frontend
    ├── src/
    │   ├── components/
    │   ├── context/     # AuthContext
    │   ├── layouts/
    │   ├── pages/
    │   └── services/    # Axios wrappers
    ├── .env             # VITE_API_URL
    └── vite.config.js
```

---

## 🚀 Local Development Setup

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### Step 2 — Configure the Backend Environment

Create a file at `server/.env` with the following content:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # set this if your MySQL root has a password
DB_NAME=upbridge_rwanda

JWT_SECRET=super_secret_jwt_key_that_is_long_enough_1234
JWT_EXPIRES_IN=7d
```

> If your MySQL root user has a password, edit `server/.env` and set `DB_PASSWORD=your_actual_password`.

### Step 3 — Install Backend Dependencies

```bash
cd server
npm install
```

### Step 4 — Set Up the Database

> MySQL Server must be running before this step.

```bash
# Still inside the server/ directory:
node setupDb.js
```

This script will:
- Connect to MySQL using the credentials in `.env`
- Create the `upbridge_rwanda` database (if it does not exist)
- Run `database/schema.sql` (creates all tables with IF NOT EXISTS)
- Run `database/seed_courses.sql` (inserts sample courses)
- Run `database/seed_opportunities.sql` (inserts sample opportunities)
- Generate a default admin user `admin@upbridge.rw` / `Admin@1234`

Re-run with `--force` to drop and recreate everything:

```bash
node setupDb.js --force
```

Or via npm scripts:

```bash
npm run db:setup
npm run db:setup:force
```

### Step 5 — Start the Backend

```bash
# Development (auto-restarts on file changes):
npm run dev

# Production:
npm start
```

Expected output:
```
✅ MySQL connected successfully.
🚀 UpBridge Rwanda API running on http://localhost:5000
```

Test the health endpoint:
```
GET http://localhost:5000/api/health
```

### Step 6 — Install Frontend Dependencies

Open a **second terminal**:

```bash
cd client
npm install
```

### Step 7 — Configure the Frontend Environment

Create a file at `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 8 — Start the Frontend

```bash
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser.

---

## Database Schema Overview

| Table | Purpose |
|-------|---------|
| users | Students, mentors, and admins |
| courses | Learning content catalogue |
| course_enrollments | Tracks student progress per course |
| projects | Student portfolio items |
| mentors | Mentor-specific profile extension |
| opportunities | Internship and job postings |
| applications | Student applications to opportunities |
| mentorship_sessions | Booked sessions between students/mentors |

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | Public | Create account |
| POST | /api/login | Public | Login, get JWT |
| GET | /api/me | JWT | Get current user |

### Courses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/courses | Public | List courses (paginated) |
| GET | /api/courses/categories | Public | Get all categories |
| GET | /api/courses/my-recent | JWT | My enrolled courses |
| GET | /api/courses/:id | Optional | Course detail |
| POST | /api/courses/:id/continue | JWT | Enroll / update progress |
| POST | /api/courses | Admin | Create course |
| PUT | /api/courses/:id | Admin | Update course |
| DELETE | /api/courses/:id | Admin | Delete course |

### Portfolio
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/portfolio | JWT | My projects |
| GET | /api/portfolio/:id | JWT | Project detail |
| POST | /api/portfolio | JWT | Create project |
| PUT | /api/portfolio/:id | JWT | Update project |
| DELETE | /api/portfolio/:id | JWT | Delete project |

### Opportunities
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/opportunities | Public | List opportunities |
| GET | /api/opportunities/:id | Public | Opportunity detail |
| POST | /api/opportunities | Admin | Create opportunity |
| PUT | /api/opportunities/:id | Admin | Update opportunity |
| DELETE | /api/opportunities/:id | Admin | Delete opportunity |

### Applications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/applications | JWT | My applications |
| POST | /api/applications | JWT | Apply to opportunity |
| DELETE | /api/applications/:id | JWT | Withdraw application |
| GET | /api/applications/admin | Admin | All applications |
| PATCH | /api/applications/:id/status | Admin | Update status |

### Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/profile | JWT | Get profile |
| PUT | /api/profile | JWT | Update profile |
| PUT | /api/profile/password | JWT | Change password |

---

## Frontend Pages

| Page | Route | Auth Required |
|------|-------|--------------|
| Landing | / | No |
| Login | /login | No |
| Register | /register | No |
| Forgot Password | /forgot-password | No |
| Dashboard | /dashboard | Yes |
| Learning Hub | /learning-hub | Yes |
| Course Detail | /learning-hub/:id | Yes |
| Portfolio | /portfolio | Yes |
| Opportunities | /opportunities | Yes |
| Opportunity Detail | /opportunities/:id | Yes |
| Applications | /applications | Yes |
| Profile | /profile | Yes |

---

## Troubleshooting

### ❌ ECONNREFUSED 127.0.0.1:3306
MySQL Server is not running. Run:
```powershell
net start MySQL80
```

### ❌ EADDRINUSE :::5000
Another Node process is using port 5000. Kill it:
```powershell
taskkill /F /IM node.exe
```
Or change `PORT` in `server/.env`.

### ❌ ER_ACCESS_DENIED_ERROR
Wrong `DB_USER` or `DB_PASSWORD` in `server/.env`.

### ❌ Frontend shows blank page
Make sure the backend is running on port 5000. Check browser DevTools console for CORS or network errors.

### ❌ Render app is slow to load
Render free tier spins down after inactivity. Wait 30–60 seconds for the first load — it will be fast after that.

---

## Production Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend + Backend | Render | Auto-deploys from GitHub |
| Database | Aiven Cloud MySQL | Free tier, always on |

### Environment Variables on Render

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| DB_HOST | mysql-2e5ec42b-alustudent-3084.e.aivencloud.com |
| DB_PORT | 15664 |
| DB_USER | avnadmin |
| DB_PASSWORD | your Aiven password |
| DB_NAME | defaultdb |
| JWT_SECRET | your JWT secret |
| JWT_EXPIRES_IN | 7d |
| CLIENT_URL | https://upbridge-rw-1.onrender.com/ |

---

## Author

**Ineza Marie Ghislaine**
African Leadership University (ALU)
2026
