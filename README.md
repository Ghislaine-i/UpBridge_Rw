# UpBridge Rwanda — Full-Stack Web Application

> Learn. Build. Get Hired.
> A student-facing platform for learning, portfolio building, and opportunity discovery in Rwanda.

---

## Technology Stack

| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Axios, Lucide |
| Backend  | Node.js, Express 4, mysql2, jsonwebtoken    |
| Database | MySQL 8.x                                   |

---

## Prerequisites

Before running the project you must have the following installed:

| Tool          | Version  | Download                                        |
|---------------|----------|-------------------------------------------------|
| Node.js       | ≥ 18.x   | https://nodejs.org                              |
| MySQL Server  | ≥ 8.0    | https://dev.mysql.com/downloads/mysql/          |

> ⚠️ **MySQL Workbench and MySQL Shell alone are NOT enough.**
> You need **MySQL Server** installed and the `MySQL80` (or similar) Windows service running.

### Install MySQL Server
1. Download the **MySQL Community Server** installer from https://dev.mysql.com/downloads/mysql/
2. Run the installer and choose **Server only** or **Developer Default**
3. Set or leave blank the root password (match what you put in `.env`)
4. After installation, confirm the service is running:
   ```powershell
   Get-Service MySQL80
   # Status should be: Running
   ```
5. If it's stopped, start it:
   ```powershell
   net start MySQL80
   ```

---

## Project Structure

```
upbridge-rwanda-modules-1-8/
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

## Step-by-Step Setup

### 1 — Clone / Open the project

```powershell
cd C:\Users\GHISLAINE\Downloads\upbridge-rwanda-modules-1-8
```

### 2 — Configure the backend environment

The file `server/.env` is already pre-configured with sensible defaults:

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

**If your MySQL root user has a password**, edit `server/.env` and set `DB_PASSWORD=your_actual_password`.

### 3 — Install backend dependencies

```powershell
cd server
npm install
```

### 4 — Set up the database

> MySQL Server must be running before this step.

```powershell
# Still inside the server/ directory:
node setupDb.js
```

This script will:
- Connect to MySQL using the credentials in `.env`
- Create the `upbridge_rwanda` database (if it does not exist)
- Run `database/schema.sql` (creates all tables with IF NOT EXISTS)
- Run `database/seed_courses.sql` (inserts sample courses)
- Run `database/seed_opportunities.sql` (inserts sample opportunities)
- Generate a default admin user `admin@upbridge.rw` (Admin@1234)

**Re-run with `--force` to drop and recreate everything:**
```powershell
node setupDb.js --force
```

Or via npm scripts:
```powershell
npm run db:setup
npm run db:setup:force
```

### 5 — Start the backend

```powershell
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

### 6 — Install frontend dependencies

Open a **second terminal**:

```powershell
cd C:\Users\GHISLAINE\Downloads\upbridge-rwanda-modules-1-8\client
npm install
```

### 7 — Start the frontend

```powershell
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

| Table                | Purpose                                   |
|---------------------|-------------------------------------------|
| `users`             | Students, mentors, and admins             |
| `courses`           | Learning content catalogue                |
| `course_enrollments`| Tracks student progress per course        |
| `projects`          | Student portfolio items                   |
| `mentors`           | Mentor-specific profile extension         |
| `opportunities`     | Internship and job postings               |
| `applications`      | Student applications to opportunities     |
| `mentorship_sessions`| Booked sessions between students/mentors |

---

## API Endpoints

### Auth
| Method | Endpoint       | Auth     | Description         |
|--------|---------------|----------|---------------------|
| POST   | /api/register | Public   | Create account      |
| POST   | /api/login    | Public   | Login, get JWT      |
| GET    | /api/me       | JWT      | Get current user    |

### Courses
| Method | Endpoint                    | Auth     | Description             |
|--------|-----------------------------|----------|-------------------------|
| GET    | /api/courses                | Public   | List courses (paginated)|
| GET    | /api/courses/categories     | Public   | Get all categories      |
| GET    | /api/courses/my-recent      | JWT      | My enrolled courses     |
| GET    | /api/courses/:id            | Optional | Course detail           |
| POST   | /api/courses/:id/continue   | JWT      | Enroll / update progress|
| POST   | /api/courses                | Admin    | Create course           |
| PUT    | /api/courses/:id            | Admin    | Update course           |
| DELETE | /api/courses/:id            | Admin    | Delete course           |

### Portfolio
| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| GET    | /api/portfolio     | JWT  | My projects        |
| GET    | /api/portfolio/:id | JWT  | Project detail     |
| POST   | /api/portfolio     | JWT  | Create project     |
| PUT    | /api/portfolio/:id | JWT  | Update project     |
| DELETE | /api/portfolio/:id | JWT  | Delete project     |

### Opportunities
| Method | Endpoint                | Auth   | Description          |
|--------|-------------------------|--------|----------------------|
| GET    | /api/opportunities      | Public | List opportunities   |
| GET    | /api/opportunities/:id  | Public | Opportunity detail   |
| POST   | /api/opportunities      | Admin  | Create opportunity   |
| PUT    | /api/opportunities/:id  | Admin  | Update opportunity   |
| DELETE | /api/opportunities/:id  | Admin  | Delete opportunity   |

### Applications
| Method | Endpoint                           | Auth  | Description              |
|--------|------------------------------------|-------|--------------------------|
| GET    | /api/applications                  | JWT   | My applications          |
| POST   | /api/applications                  | JWT   | Apply to opportunity     |
| DELETE | /api/applications/:id              | JWT   | Withdraw application     |
| GET    | /api/applications/admin            | Admin | All applications         |
| PATCH  | /api/applications/:id/status       | Admin | Update status            |

### Profile
| Method | Endpoint               | Auth | Description         |
|--------|------------------------|------|---------------------|
| GET    | /api/profile           | JWT  | Get profile         |
| PUT    | /api/profile           | JWT  | Update profile      |
| PUT    | /api/profile/password  | JWT  | Change password     |

---

## Frontend Pages

| Page              | Route                    | Auth Required |
|-------------------|--------------------------|---------------|
| Landing           | /                        | No            |
| Login             | /login                   | No            |
| Register          | /register                | No            |
| Forgot Password   | /forgot-password         | No            |
| Dashboard         | /dashboard               | Yes           |
| Learning Hub      | /learning-hub            | Yes           |
| Course Detail     | /learning-hub/:id        | Yes           |
| Portfolio         | /portfolio               | Yes           |
| Opportunities     | /opportunities           | Yes           |
| Opportunity Detail| /opportunities/:id       | Yes           |
| Applications      | /applications            | Yes           |
| Profile           | /profile                 | Yes           |

---

## Troubleshooting

### ❌ `ECONNREFUSED 127.0.0.1:3306`
MySQL Server is not running. Run:
```powershell
net start MySQL80
```

### ❌ `EADDRINUSE :::5000`
Another Node process is using port 5000. Kill it:
```powershell
taskkill /F /IM node.exe
```
Or change `PORT` in `server/.env`.

### ❌ `ER_ACCESS_DENIED_ERROR`
Wrong `DB_USER` or `DB_PASSWORD` in `server/.env`.

### ❌ Frontend shows blank page
Make sure the backend is running on port 5000. Check browser DevTools console for CORS or network errors.

---

## Files Modified / Created During Audit

| File | Action | Reason |
|------|--------|--------|
| `server/.env` | Updated | Set `DB_PASSWORD=''` and proper `JWT_SECRET` |
| `server/setupDb.js` | Rewritten | Now reads from `.env`, handles `--force`, skips re-seed |
| `server/package.json` | Updated | Added `db:setup` and `db:setup:force` scripts |
| `client/.env` | Created | Explicit `VITE_API_URL` pointing to backend |
| `client/public/favicon.svg` | Created | Referenced in `index.html` but was missing |
| `README.md` | Created | This file |
