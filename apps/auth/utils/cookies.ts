export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  // ------------ local-test ------------
  // secure: false,
  // sameSite: "lax" as const,
  // ------------ prod ------------
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge,
});
