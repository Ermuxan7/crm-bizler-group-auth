import { Response, Request, NextFunction, RequestHandler } from "express";
import { verifyToken } from "../utils/token.utils";
import { Role } from "@prisma/client";

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ message: "Token joq!" });
    return;
  }

  try {
    const decoded = verifyToken(token);

    (req as AuthRequest).user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token naduris yaki waqti tawsilgan" });
  }
};
