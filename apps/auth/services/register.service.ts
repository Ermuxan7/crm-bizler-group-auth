import { prisma } from "../prisma/client";
import bcrypt from "bcryptjs";
import { createRefreshToken, createToken } from "../utils/token.utils";
import { AppError } from "../utils/custom-error";

export const registerUserService = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError("Bul email menen aldin registratsiya qiling'an!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const accessToken = createToken({ id: newUser.id, email: newUser.email });
  const refreshToken = createRefreshToken({
    id: newUser.id,
    email: newUser.email,
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 kun
    },
  });

  const { password: _, ...userWithoutPassword } = newUser;

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};
