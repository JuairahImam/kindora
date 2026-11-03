# 🌟 Kindora — Social Development Events Platform

> **"Small Acts. Greater Impact."**  
> Kindora is a community-driven event management platform where citizens, volunteers, and organizations can discover, organize, join, and track local social welfare and community development initiatives.

---

## 🌐 Live URLs & Repositories

- **Live Server (API URL):** [https://server-one-weld-92.vercel.app](https://server-one-weld-92.vercel.app)
- **Local Server URL:** `http://localhost:5050`
- **Server Health Check:** [https://server-one-weld-92.vercel.app/health](https://server-one-weld-92.vercel.app/health)
- **Client Live Site URL:** [https://client-five-phi-98.vercel.app](https://client-five-phi-98.vercel.app)
- **GitHub Repository:** [https://github.com/JuairahImam/kindora](https://github.com/JuairahImam/kindora)

---

## 🚀 Key Features

* **📅 Dynamic Event Management & Strict Ownership:** Authenticated users can create social service events (Tree Plantation, Blanket Distribution, Cleanups, Blood Donation, Education, etc.) with custom dates, locations, descriptions, and thumbnail images. Full CRUD capabilities are guarded with strict ownership verification—only the original creator can update or delete their event.
* **🤝 One-Click Event Participation & Duplicate Prevention:** Logged-in volunteers can join upcoming initiatives with a single click. The backend atomically registers participants, prevents duplicate joins, blocks creators from joining their own events, and strictly rejects past events.
* **⏳ Intelligent Date Filtering & Upcoming Aggregation:** Clean database querying powered by MongoDB comparison operators (`$gt`) ensures only future upcoming events are displayed. The platform delivers both an upcoming events catalog and a dedicated homepage showcase featuring the top 6 upcoming events using the MongoDB `.limit(6)` operator.
* **🔐 Robust Better Auth & JWT Protected Architecture:** Complete authentication infrastructure supporting email/password registration with strict password strength validation (minimum 6 characters, uppercase, and lowercase letters) alongside one-click GitHub OAuth. API routes are shielded using custom Express middleware verifying Better Auth JWTs.
* **👤 User Profile Management & Activity Tracking:** Users can view and update their profile details (display name, profile avatar URL), track all events they have personally organized in the "Manage Events" dashboard, and review all events they have joined sorted chronologically by event date.
* **🛡️ End-to-End Schema Validation & Error Resilience:** All payload mutations are validated via Zod schemas and Mongoose validators, preventing invalid dates, missing fields, or malformed IDs. Standardized JSON responses and centralized error handling ensure consistent client-server communication.

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js (v5)
- **Language:** TypeScript (v7)
- **Database:** MongoDB & Mongoose ODM (v9)
- **Authentication & Security:** Better Auth (`@better-auth/mongo-adapter`), JWT, Bearer plugin
- **Validation:** Zod (v4)
- **Deployment:** Vercel Serverless Functions

### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript / JavaScript
- **Styling & UI:** Tailwind CSS, Hero UI / Daisy UI / Shadcn UI
- **Icons & Alerts:** Lucide Icons / React Icons, SweetAlert2 / Sonner Toast

---

## 📡 API Reference & Endpoints

### 1. System & Health
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Root welcome status and API gateway info |
| `GET` | `/health` | Public | Real-time server health and ISO timestamp |

### 2. Authentication (`Better Auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/sign-up/email` | Public | Register with name, email, password, image |
| `POST` | `/api/auth/sign-in/email` | Public | Log in with email & password |
| `GET` | `/api/auth/sign-in/social?provider=github` | Public | GitHub OAuth sign-in flow |
| `POST` | `/api/auth/sign-out` | Authenticated | Sign out user session |
| `GET` | `/api/me` | Authenticated | Get current session details from cookie/header |
| `GET` | `/api/protected` | Authenticated | Test endpoint verifying Bearer JWT validity |

### 3. Social Development Events (`/api/events`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Public | Retrieve all upcoming events (`eventDate > now`) |
| `GET` | `/api/events/recent` | Public | Retrieve 6 recent upcoming events (`.limit(6)`) |
| `GET` | `/api/events/:id` | Public | Get single event details by MongoDB ObjectId |
| `POST` | `/api/events` | Protected (JWT) | Create a new community event (validates future date) |
| `GET` | `/api/events/my-events` | Protected (JWT) | Get all events created by the authenticated user |
| `PATCH` | `/api/events/:id` | Protected (JWT) | Update event (restricted to original creator) |
| `DELETE` | `/api/events/:id` | Protected (JWT) | Delete event (restricted to original creator) |
| `POST` | `/api/events/:id/join` | Protected (JWT) | Join an event (stores user in `joinedUsers`) |
| `GET` | `/api/events/joined-events` | Protected (JWT) | Get events joined by user (sorted by `eventDate`) |

### 4. User Profile (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me` | Protected (JWT) | Fetch authenticated user's profile |
| `PATCH` | `/api/users/me` | Protected (JWT) | Update user profile (`name`, `image`) |

---

## 📋 Data Models & Validation Rules

### Event Schema (`IEvent`)
```typescript
{
  title: string;          // Required, min 3, max 100 characters
  description: string;    // Required, min 10, max 2000 characters
  eventType: string;      // Enum: Cleanup | Plantation | Donation | Education | Healthcare | Food Distribution | Other
  thumbnail: string;      // Required, valid URL
  location: string;       // Required, min 3, max 150 characters
  eventDate: Date;        // Required, must strictly be in the future
  creatorId: string;      // Extracted from verified JWT subject
  creatorEmail: string;   // Extracted from verified JWT email
  joinedUsers: [          // Array of participants
    {
      userId: string;
      name: string;
      email: string;
      joinedAt: Date;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}
```

### Password Strength Rule
During registration (`/sign-up/email`), the server middleware hook validates:
- Length of at least **6 characters**.
- Contains at least **one uppercase letter** (`/[A-Z]/`).
- Contains at least **one lowercase letter** (`/[a-z]/`).

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Database cluster (MongoDB Atlas or local instance)
- GitHub OAuth application (Client ID & Client Secret)

### Step 1: Clone the Repository
```bash
git clone https://github.com/juairahnafisa/kindora.git
cd kindora
```

### Step 2: Configure Environment Variables
Navigate into the server folder:
```bash
cd server
cp .env.example .env
```
Fill in the `.env` values:
```env
PORT=5050
NODE_ENV=development
CLIENT_URL=http://localhost:3000

MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.mongodb.net/kindora?retryWrites=true&w=majority

BETTER_AUTH_SECRET=your_32_character_secret_key_here
BETTER_AUTH_URL=http://localhost:5050

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run Type Check & Development Server
```bash
# Type check TypeScript files
npm run type-check

# Start development server with live reload on port 5050
npm run dev
```

### Step 5: Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Security & Best Practices Implemented

- **CORS Whitelisting:** Configured with `credentials: true` and dynamic `CLIENT_URL` origin restriction.
- **Atomic MongoDB Operations:** Participant enrollment leverages `$push` with conditional querying (`creatorId: { $ne: userId }`, `eventDate: { $gt: now }`, `"joinedUsers.userId": { $ne: userId }`) to eliminate duplicate joins and race conditions.
- **Serverless Readiness:** MongoDB connection caching ensures database connections are safely reused across warm Vercel serverless function invocations.
- **Centralized Error Handling:** All runtime exceptions, Zod errors, Mongoose cast errors, and duplicate key errors (code 11000) are caught and returned in uniform JSON format without crashing the server.

---

## 📝 License
This project is developed for educational and community service purposes. Feel free to contribute and make a difference!
