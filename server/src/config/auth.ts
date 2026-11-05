
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt, bearer } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";

import { client, database } from "./mongodb.js";

// Environment variables
const baseURL = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is not defined");
}

if (!secret || secret.length < 32) {
  throw new Error(
    "BETTER_AUTH_SECRET must be at least 32 characters long"
  );
}

if (!githubClientId || !githubClientSecret) {
  throw new Error(
    "GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are required"
  );
}

const clientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

export const trustedOrigins = Array.from(
  new Set([
    "http://localhost:3000",
    "https://client-five-phi-98.vercel.app",
    ...clientUrls,
  ])
);

// Better Auth configuration
const isProduction =
  process.env.NODE_ENV === "production" || baseURL.startsWith("https://");

export const auth = betterAuth({
  baseURL,
  secret,

  trustedOrigins,

  advanced: {
    useSecureCookies: isProduction,
    defaultCookieAttributes: {
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      httpOnly: true,
    },
    cookies: {
      state: {
        attributes: {
          sameSite: isProduction ? "none" : "lax",
          secure: isProduction,
        },
      },
    },
  },

  // MongoDB database
  database: mongodbAdapter(database, {
    client,
    transaction: false,
  }),

  // GitHub OAuth
  socialProviders: {
    github: {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      scope: ["user:email"],
    },
  },

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },

  // Password validation
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const password = ctx.body?.password;

      if (typeof password !== "string") {
        return;
      }

      if (!/[A-Z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must contain at least one uppercase letter",
        });
      }

      if (!/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must contain at least one lowercase letter",
        });
      }
    }),
  },

  // Authentication plugins
  plugins: [
    jwt(),
    bearer(),
  ],
});
