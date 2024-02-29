"use server";

import { SessionData, sessionOptions, defaultSession } from "./lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
};

export const login = async () => {
  const redirectUri = encodeURIComponent(
    `${process.env.NEXT_PUBLIC_YGGIO_REDIRECT_URI}`,
  );
  const clientId = encodeURIComponent(
    `${process.env.NEXT_PUBLIC_YGGIO_CLIENT_ID}`,
  );
  const url = `${process.env.NEXT_PUBLIC_AUTHORIZATION_ENDPOINT}/?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`;

  redirect(url);
};

export const get = async () => {};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};

export const getNodes = async (token: string) => {
  const response = await fetch("https://staging.yggio.net/api/iotnodes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const nodes = await response.json();
  return nodes;
};

// export const getTemp = async (id: string, measurement: string) => {
//   const response = await fetch(
//     `https://staging.yggio.net/api/iotnodes/${id}/stats?measurement=${measurement}`,
//   );

//   const data = await response.json();

//   return data;
// };