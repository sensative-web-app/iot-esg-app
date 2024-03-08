"use server";

import { SessionData, sessionOptions } from "./lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const get = async () => {};

export const getSession = async () => {
  let session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (Object.keys(session).length === 0) {
    return undefined;
  }

  const now = Date.now();
  const expires = new Date(session?.expires!).getTime();
  const refreshExpires = new Date(session?.refreshExpires!).getTime();

  if (now >= refreshExpires) {
    session.destroy();
    return undefined;
  }

  if (now >= expires) {
    try {
      const refreshedSession = await refreshToken(session.refreshToken!);

      session.accessToken = refreshedSession.accessToken;
      session.refreshToken = refreshedSession.refreshToken;
      session.expires = refreshedSession.expires;
      session.refreshExpires = refreshedSession.refreshExpires;

      return session;
    } catch (error: any) {
      console.log(error.message);
      session.destroy();
      return undefined;
    }
  }

  return session;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await fetch(`${process.env.APP_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(refreshToken),
  });

  const { session } = await response.json();

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

export const logout = async () => {
  const session = await getSession();
  session!.destroy();
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
