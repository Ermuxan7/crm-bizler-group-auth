import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const getAllUserController = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      message: "All users",
      users,
    });
  } catch (error) {
    console.error("Get all users controller qateligi:", error);
    res.status(500).json({ message: "Get all users server qateligi" });
  }
};
