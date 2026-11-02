
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
        payload: res.locals.jwtPayload,
      });
    }
  );
  
  export default router;
  