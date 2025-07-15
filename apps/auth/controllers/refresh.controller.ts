import { Request, Response } from "express";
import {
  createRefreshToken,
  createToken,
  verifyRefreshToken,
} from "../utils/token.utils";
import { cookieOptions } from "../utils/cookies";
import { prisma } from "../prisma/client";

export const refreshController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token joq!" });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      res
        .status(403)
        .json({ message: "Refresh tokennin waqiti otken yaki tabilmadi" });
    }

    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });

    const accessToken = createToken({ id: decoded.id, email: decoded.email });
    const newRefreshToken = createRefreshToken({
      id: decoded.id,
      email: decoded.email,
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res
      .cookie("accessToken", accessToken, cookieOptions(60 * 60 * 1000))
      .cookie(
        "refreshToken",
        newRefreshToken,
        cookieOptions(7 * 24 * 60 * 60 * 1000)
      )
      .status(200)
      .json({ message: "Tokenler qayta jaratildi!" });
  } catch (error) {
    console.error("Refresh token error: ", error);
    res
      .status(401)
      .json({ message: "Refresh token naduris yaki waqiti tawsilg'an" });
  }
};
