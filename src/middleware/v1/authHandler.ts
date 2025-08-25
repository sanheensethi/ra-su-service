import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/v1/config";
import logger from "../../logger/v1/logger";
export interface JwtUser {
  id: number;
  email: string;
  base_role: "SUPER_ADMIN" | "COMPANY" | "WORKER" | "CONTRACTOR";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

const authHandler = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    logger.warn(`[authHandler] No token provided.`);
    res.status(403).json({ message: "No token provided." });
    return;
  }

  // Split 'Bearer' if it's present
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    logger.warn(`[authHandler] Malformed token.`);
    res.status(403).json({ message: "Malformed token." });
    return;
  }

  // Verify the token using the secret or fallback to the temp_jwt_key
  const jwtSecret = config['jwtSecret'];

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      logger.warn(`[authHandler] Failed to authenticate token. error: ${err}`);
      res.status(401).json({ message: "Failed to authenticate token." });
      return;
    }

    // Attach the decoded token's payload (such as user ID) to the request
    if (decoded && typeof decoded === "object") {
      logger.debug(`[authHandler] decoded: ${JSON.stringify(decoded)}`);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        base_role: decoded.base_role
        } as JwtUser;

        if (req.user.base_role !== "SUPER_ADMIN") {
            logger.warn(`[authHandler] Unauthorized access attempt by user with role: ${req.user.base_role}`);
            res.status(403).json({ message: "Unauthorized access." });
            return;
        }
        
        next();
    } else {
        logger.warn(`[authHandler] Invalid token payload.`);
        res.status(401).json({ message: "Invalid token payload." });
        return;
    }
  });
};

export default authHandler;