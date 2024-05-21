export interface SessionData {
  accessToken: string;
  role: string;
  userID: string;
  nodes: { name: string; id: string }[];
  expire: number;
}
export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD!,
  cookieName: "iot-esg-app-session",

  cookieOptions: {
    secure: false,
    // process.env.NODE_ENV === "production" &&
    // !/^http:/.test(process.env.APP_URL ?? ""),
  },
};
