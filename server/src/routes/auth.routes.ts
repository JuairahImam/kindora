import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";

import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Get current authenticated user
router.get(
  "/me",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        res.status(401).json({
          success: false,
          message: "Unauthorized. Please login first.",
        });
        return;
      }

      // Generate or retrieve JWT token for client-side Authorization header
      let token: string | null = null;
      try {
        const tokenResult = await auth.api.getToken({
          headers: fromNodeHeaders(req.headers),
        });
        if (tokenResult && tokenResult.token) {
          token = tokenResult.token;
        }
      } catch {
        // Fallback if getToken is not supported in this context
      }

      res.status(200).json({
        success: true,
        message: "Session verified successfully",
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          emailVerified: session.user.emailVerified,
        },
        session: {
          id: session.session.id,
          expiresAt: session.session.expiresAt,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Protected route
router.get(
  "/protected",
  authMiddleware,
  (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "JWT verified successfully!",
      user: res.locals.jwtPayload,
    });
  }
);

export default router;
