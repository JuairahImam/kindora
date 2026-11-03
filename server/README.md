# 🛠️ Kindora Backend API

Express.js + TypeScript + MongoDB + Better Auth backend service for the **Kindora Social Development Events Platform**.

- **Production Live URL:** [https://server-one-weld-92.vercel.app](https://server-one-weld-92.vercel.app)
- **Local Development URL:** `http://localhost:5050`
- **Client Live URL:** [https://client-five-phi-98.vercel.app](https://client-five-phi-98.vercel.app)

---

## ✨ Features

- 🔐 **Better Auth Integration** — Email/password registration & login, GitHub OAuth, session management with MongoDB adapter.
- 🛡️ **JWT & Bearer Authentication** — Protected API endpoints requiring valid JWT tokens.
- 📋 **Event CRUD Operations** — Full lifecycle management for community service events with future-date enforcement.
- 🤝 **Join Event System** — Atomic participation registration preventing duplicate join records.
- 👤 **User Profile API** — Self profile viewing and editing with authorization validation.
- 🌐 **Dynamic CORS Security** — Whitelisting for localhost:3000, production domains, and preview deployments.

---

## 📡 API Endpoints

### Public Endpoints
- `GET /` — API health status
- `GET /health` — Service uptime check
- `GET /api/events` — Get all upcoming events (filtered for future dates)
- `GET /api/events/recent` — Get up to 6 recent upcoming events (home page)
- `GET /api/events/:id` — Get single event details

### Protected Endpoints (Requires Bearer Token)
- `POST /api/events` — Create new event
- `PATCH /api/events/:id` — Update own event
- `DELETE /api/events/:id` — Delete own event
- `POST /api/events/:id/join` — Join an event
- `GET /api/events/my-events` — Get events created by logged-in user
- `GET /api/events/joined-events` — Get events joined by logged-in user
- `GET /api/users/me` — Get user profile
- `PATCH /api/users/me` — Update user profile

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
