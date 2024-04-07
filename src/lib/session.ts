export interface SessionData {
  accessToken: string;
  role: string;
  userID?: string;
  setID?: string;
  co2NodeID?: string;
  expire: number;
  temperatureNodeID?: string;
  test?: string;
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
