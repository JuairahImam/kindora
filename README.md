# Kindora
### Small Acts. Greater Impact.

Kindora is a social development events platform where people can
discover community initiatives, create events, and participate in
activities that make a positive impact.

## Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Better Auth
- JWT

## Project Structure

kindora/
├── client/          # Next.js frontend
├── server/          # Express.js backend
└── .github/
    └── workflows/  # GitHub Actions CI workflows

## Local Development

### Backend

1. Navigate to the server directory:
   `cd server`

2. Install dependencies:
   `npm install`

3. Create a `.env` file using `.env.example` as a reference.

4. Start the development server:
   `npm run dev`

5. Run type checking:
   `npm run type-check`

6. Build for production:
   `npm run build`

## CI/CD

GitHub Actions is used for automated backend type checking
and production builds.

Vercel deployment will be configured for the frontend
and backend.

## Project Status

Backend foundation and initial CI pipeline are set up.
Feature development is in progress.
