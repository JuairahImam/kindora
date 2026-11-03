# Kindora — Social Development Events Platform

> **Live Site:** https://client-five-phi-98.vercel.app

A community-driven event management platform where citizens create, join, and track grassroots social service events across Bangladesh.

---

## ✨ Key Features

- 🔐 **Secure Authentication** — Email/password signup & login with GitHub OAuth via Better Auth. Password strength validation (uppercase, lowercase, min 6 chars) with real-time inline feedback. JWT-protected private API routes.

- 📅 **Create & Manage Events** — Logged-in users can create community events (Cleanup, Donation, Plantation, Education, Healthcare, Food Distribution) with title, description, location, future-only date picker, and thumbnail. Manage your events with inline edit modal and SweetAlert2-confirmed delete.

- 🌍 **Discover & Join Events** — Browse all upcoming events with category filter chips and live search. Click any event to view full details and join with one click. Joined events are tracked per-user and sorted by date on the Joined Events page.

- 🌙 **Dark / Light Theme Toggle** — Full system-wide theme switching persisted to `localStorage` with smooth CSS variable transitions, respecting `prefers-color-scheme` on first visit.

- 👤 **User Profile Management** — View and update your display name and profile photo URL. Profile photo previews inline before saving. Email address is non-editable for security.

- 💪 **Responsive & Accessible Design** — Mobile-first layout that works on all screen sizes. Equal-height event cards in 1/2/3-column grids, skeleton loading states throughout, SweetAlert2 for all confirmations (no browser `alert()`).

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript |
| UI Components | HeroUI, Tailwind CSS v4, Lucide Icons |
| Authentication | Better Auth (email + GitHub OAuth, JWT) |
| Backend API | Express.js, MongoDB / Mongoose |
| Hosting | Vercel (client + server) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Configure your `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5050
```
