import { Request, Response } from "express";
import { createToken, verifyRefreshToken } from "../utils/token.utils";
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

    const accessToken = createToken({ id: decoded.id, email: decoded.email });

    res
      .cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000))
      .status(200)
      .json({ message: "Access token qayta jaratildi!" });
  } catch (error) {
    console.error("Refresh token error: ", error);
    res
      .status(401)
      .json({ message: "Refresh token naduris yaki waqiti tawsilg'an" });
  }
};
