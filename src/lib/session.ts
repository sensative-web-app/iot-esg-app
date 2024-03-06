export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  isLoggedIn: boolean;
  role?: string;
  expires?: Date;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD!,
  cookieName: "iot-esg-app-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
