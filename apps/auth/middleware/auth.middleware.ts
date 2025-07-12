import { Response, Request, NextFunction } from "express";
import { verifyToken } from "../utils/token.utils";

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
