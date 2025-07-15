import { Request, Response } from "express";
import { loginUserServices } from "../services/login.service";
import { AppError } from "../utils/custom-error";
import { cookieOptions } from "../utils/cookies";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Barliq mag'liwmatlar toltiriwi kerek!" });
      return;
    }

    const { accessToken, refreshToken, user } = await loginUserServices(
      email,
      password
    );

    res
      .cookie(
        "refreshToken",
        refreshToken,
        cookieOptions(7 * 24 * 60 * 60 * 1000)
      )
      .cookie("accessToken", accessToken, cookieOptions(60 * 60 * 1000))
      .status(200)
      .json({
        message: "Tabisli kirdin'iz",
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
        },
      });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Register Controller error: ", error);
    res.status(500).json({ message: "Server qateligi" });
  }
};
