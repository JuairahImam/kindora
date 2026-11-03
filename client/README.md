# 🌟 Kindora — Social Development Events Platform (Client)

> **"Small Acts. Greater Impact."**  
> Kindora is a community-driven event management platform where citizens, volunteers, and organizers can discover, organize, join, and track local social welfare and community development initiatives.

---

## 🌐 Live URLs & Links

- **Client Live Site URL:** [https://kindora-client.vercel.app](https://kindora-client.vercel.app) *(Deploy link)*
- **Live API Server:** [https://server-one-weld-92.vercel.app](https://server-one-weld-92.vercel.app)
- **Local Dev URL:** `http://localhost:3000`
- **GitHub Repository (Client):** `https://github.com/JuairahImam/kindora`

---

## 🚀 Key Website Features

* **🌟 Dynamic Community Homepage:** Features a warm, inspiring "Golden Hour" themed hero banner, interactive value-proposition cards, a live database-backed Recent Upcoming Events section showcasing 6 upcoming drives via MongoDB `.limit(6)`, a curated visual gallery of grassroots moments, and a newsletter subscription portal.
* **📅 Real-Time Event Discovery & Filtering:** Explore community-led initiatives (Tree Plantation, Blanket Distribution, Street Cleanups, Medical Camps) with automatic date filtering that guarantees past events never appear in the upcoming feed.
* **🤝 One-Click Volunteer Enrollment:** Logged-in changemakers can join causes instantly with atomic duplicate join prevention, participant tracking, and real-time organizer coordination.
* **🌓 System-Wide Light/Dark Theme Customization:** A persistent theme toggler with accessible contrast, smooth transitions, and Golden Hour coral/sand/ink-navy color tokens that seamlessly transforms the entire UI.
* **🔐 Secure Authentication & Role Protected Experience:** Powered by Better Auth with email/password validation (min 6 characters, uppercase & lowercase enforcement) and GitHub OAuth, safeguarding event creation, personal event management, and joined events history with JWT tokens.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Custom Design Tokens
- **Icons:** Lucide React, Custom SVG Brand Logos (Modern X Logo, etc.)
- **State & Context:** React Context API (ThemeContext, AuthContext)
- **Deployment:** Vercel

---

## 💻 Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://server-one-weld-92.vercel.app
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```
