import { Response, Request } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../prisma/client";

export const meController = async (req: Request, res: Response) => {
  const authUser = (req as AuthRequest).user;

  if (!authUser) {
    res.status(401).json({ message: "Paydalaniwshi aniqlanbadi" });
    return;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { id: true, name: true, email: true, createdAt: true, role: true },
  });

  if (!dbUser) {
    res.status(404).json({ message: "User tabilmadi!" });
  }

  res.status(200).json({
    message: "Paydalaniwshi haqqinda mag'liwmat",
    user: dbUser,
  });
};
