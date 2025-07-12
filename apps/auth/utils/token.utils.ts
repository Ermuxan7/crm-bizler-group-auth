import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const createToken = (payload: object): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const createRefreshToken = (payload: object): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET!) as {
    id: string;
    email: string;
  };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET!) as {
    id: string;
    email: string;
  };
};
