import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;
    let jwtPayload: any = null;

    // 1. Try Bearer token if present (JWT verification)
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.split(" ")[1]?.trim();
      if (token && token !== "null" && token !== "undefined") {
        try {
          const result = await auth.api.verifyJWT({
            body: {
              token,
            },
          });
          if (result && result.payload) {
            jwtPayload = result.payload;
          }
        } catch {
          // Fall back to session check
        }
      }
    }

    // 2. Fallback: check session via Better Auth (cookies or headers)
    if (!jwtPayload) {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (session && session.user) {
        const userId = String(session.user.id || (session.user as any)._id);
        jwtPayload = {
          sub: userId,
          id: userId,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        };
      }
    }

    // Reject if neither Bearer JWT nor Session is valid
    if (!jwtPayload) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
      return;
    }

    // Ensure sub and id are populated
    if (!jwtPayload.sub && jwtPayload.id) {
      jwtPayload.sub = jwtPayload.id;
    }

    res.locals.jwtPayload = jwtPayload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication failed. Please login first.",
    });
  }
};

export default authMiddleware;
