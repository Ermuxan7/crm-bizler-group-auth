import { Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "./auth.middleware";

export const isAdmin: RequestHandler = (req, res, next) => {
  const user = (req as AuthRequest).user;
  if (user.role !== "ADMIN") {
    res.status(403).json({ message: "Ruxsat etilmegen, Admin emes!" });
    return;
  }
  next();
};
