import { Request, Response } from "express";
import { cookieOptions } from "../utils/cookies";
import { prisma } from "../prisma/client";

export const logoutController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ message: "Token joq siz tizimge kirmegensiz!" });
      return;
    }

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    res
      .clearCookie("accessToken", cookieOptions(0))
      .clearCookie("refreshToken", cookieOptions(0))
      .status(200)
      .json({ message: "Siz sistemadan tabisli shiqdin'iz" });
  } catch (error) {
    console.error("Log Out qateligi:", error);
    res.status(500).json({ message: "Logout server qateligi" });
  }
};
