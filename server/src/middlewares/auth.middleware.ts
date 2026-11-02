
import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import { auth } from "../config/auth.js";
  
  const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Get Authorization header
      const authorization = req.headers.authorization;
  
      // Check Bearer token
      if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401).json({
          success: false,
          message: "Authorization token is required",
        });
        return;
      }
  
      // Extract JWT
      const token = authorization.split(" ")[1];
  
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Invalid authorization token",
        });
        return;
      }
  
      // Verify JWT using Better Auth
      const result = await auth.api.verifyJWT({
        body: {
          token,
        },
      });
  
      // Reject invalid JWT
      if (!result.payload) {
        res.status(401).json({
          success: false,
          message: "Invalid or expired JWT",
        });
        return;
      }
  
      // Store verified JWT payload
      res.locals.jwtPayload = result.payload;
  
      next();
    } catch (error) {
      // Invalid JWT or verification error
      res.status(401).json({
        success: false,
        message: "Invalid or expired JWT",
      });
    }
  };
  
  export default authMiddleware;
  