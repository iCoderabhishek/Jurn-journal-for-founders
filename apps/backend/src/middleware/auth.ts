import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'insecure-dev-secret';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, NEXTAUTH_SECRET) as { sub: string };

    // Attach userId from the JWT 'sub' claim
    req.userId = decoded.sub;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
