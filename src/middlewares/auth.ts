// auth.ts

import { Response, NextFunction } from "express";
import { Request } from './types'; // Importe a interface Request estendida
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export function authentication(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "No authorization token provided" });
  }

  const token = authorization.replace("Bearer", "").trim();

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as TokenPayload;

    if (!data.id) {
      return res.status(401).json({ message: "Invalid authorization token: User id not found" });
    }

    req.userId = data.id;
    return next();
  } catch (e: any) {
    return res.status(401).json({ message: `Invalid authorization token: ${e.message}` });
  }
}
