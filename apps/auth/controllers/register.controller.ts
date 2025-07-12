import { Request, Response, RequestHandler } from "express";
import { registerUserService } from "../services/register.service";
import { AppError } from "../utils/custom-error";
import { cookieOptions } from "../utils/cookies";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "Barliq mag'liwmatlar toltiriwi kerek!" });
      return;
    }

    const { accessToken, refreshToken, user } = await registerUserService(
      name,
      email,
      password
    );

    res
      .cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000))
      .cookie(
        "refreshToken",
        refreshToken,
        cookieOptions(7 * 24 * 60 * 60 * 1000)
      )
      .status(201)
      .json({
        message: "Paydalaniwshi jaratildi",
        user,
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
