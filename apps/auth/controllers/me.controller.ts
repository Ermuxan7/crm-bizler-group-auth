import { Response, Request } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

export const meController = (req: Request, res: Response) => {
  const user = (req as AuthRequest).user;

  if (!user) {
    res.status(401).json({ message: "Paydalaniwshi aniqlanbadi" });
    return;
  }

  res.status(200).json({
    message: "Paydalaniwshi haqqinda mag'liwmat",
    email: user.email,
  });
};
