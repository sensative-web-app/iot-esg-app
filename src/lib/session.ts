export interface SessionData {
  accessToken?: string;
  expires?: Date;
  refreshToken?: string;
  refreshExpires?: Date;
  role?: string;
}

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD!,
  cookieName: "iot-esg-app-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
