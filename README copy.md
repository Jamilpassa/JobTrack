# JobTrack — Setup Guide

## Prerequisites
- Node.js (v18+) — already installed
- A free Neon account at https://neon.tech (for PostgreSQL)
- A GitHub account

---

## Step 1 — Create GitHub repo

1. Go to https://github.com/new
2. Name it `jobtrack`, set to **Public**, tick **Add a README**
3. Click **Create repository**
4. Click the green **Code** button → copy the HTTPS URL
5. In a terminal in a folder you want to work in:
   ```
   git clone <paste URL here>
   cd jobtrack
   ```
6. Copy all these files into that folder (replace the auto-generated README.md)

---

## Step 2 — Set up the database on Neon

1. Sign up at https://neon.tech (free tier, no credit card)
2. Create a new project called `jobtrack`
3. In the dashboard, find **Connection string** — copy it (looks like `postgresql://user:pass@...neon.tech/neondb`)
4. In the Neon dashboard click **SQL Editor** and paste + run the contents of `server/db/schema.sql`
5. You should see the `users` and `applications` tables created

---

## Step 3 — Configure the server

1. In the `server/` folder, create a file called `.env` (copy `.env.example`):
   ```
   DATABASE_URL=<paste your Neon connection string here>
   JWT_SECRET=make-up-any-long-random-string-here
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```
   ⚠️ Never commit this file to GitHub — it's already in `.gitignore`

---

## Step 4 — Install dependencies and run

Open **two** terminal windows / VS Code terminal tabs:

**Terminal 1 (server):**
```bash
cd server
npm install
npm run dev
```
You should see: `Server running on http://localhost:3001`

**Terminal 2 (client):**
```bash
cd client
npm install
npm run dev
```
You should see a URL like `http://localhost:5173` — open that in your browser.

---

## Step 5 — Test it works

1. Open http://localhost:5173
2. Click Register and create an account
3. You should land on the Dashboard
4. Go to Applications and add a few entries

If you see errors:
- `ECONNREFUSED` on the server → check your `DATABASE_URL` in `.env`
- Blank page in browser → check the client terminal for errors

---

## Folder structure

```
jobtrack/
├── client/                  React + Vite frontend
│   └── src/
│       ├── context/         AuthContext (login state)
│       ├── pages/           Dashboard, Login, Register, Applications
│       ├── components/      Navbar, ProtectedRoute
│       ├── App.jsx          Routes
│       └── index.css        Styles
└── server/                  Node + Express backend
    ├── db/
    │   ├── index.js         PostgreSQL connection pool
    │   └── schema.sql       Run this in Neon SQL editor
    ├── middleware/
    │   └── auth.js          JWT cookie verification
    ├── routes/
    │   ├── auth.js          POST /register, POST /login, POST /logout, GET /me
    │   └── applications.js  GET, POST, PUT, DELETE /applications
    ├── tests/
    │   └── auth.test.js     Jest + Supertest tests
    └── index.js             Express app entry point
```

---

## API endpoints

| Method | URL | Auth required | Description |
|--------|-----|---------------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/logout | No | Logout |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/applications | Yes | List all applications |
| GET | /api/applications/stats | Yes | Dashboard stats |
| POST | /api/applications | Yes | Add application |
| PUT | /api/applications/:id | Yes | Update application |
| DELETE | /api/applications/:id | Yes | Delete application |
