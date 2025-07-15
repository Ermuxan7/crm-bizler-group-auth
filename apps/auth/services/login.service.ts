import { prisma } from "../prisma/client";
import bcrypt from "bcryptjs";
import { createRefreshToken, createToken } from "../utils/token.utils";
import { AppError } from "../utils/custom-error";

export const loginUserServices = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Bunday paydalaniwshi aldin registratsiya qilmagan!");
  }

  const isMatchPassword = await bcrypt.compare(password, user.password!);
  if (!isMatchPassword) {
    throw new AppError("Email yaki password qate!");
  }

  const accessToken = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = createRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 kun
    },
  });
  return { accessToken, refreshToken, user };
};
