export interface SessionData {
  accessToken: string;
  role?: string;
}

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD!,
  cookieName: "iot-esg-app-session",
  cookieOptions: {
    secure:
      process.env.NODE_ENV === "production" &&
      !/^http:/.test(process.env.APP_URL ?? ""),
    maxAge: 6 * 60 * 60 * 1000,
    ttl: 6 * 60 * 60 * 1000,
  },
};
