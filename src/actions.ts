"use server";

import { SessionData, sessionOptions, defaultSession } from "./lib/session";
import { IronSession, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const get = async () => {};

export const getSession = async () => {
  "use server";
  let session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (
    session &&
    session.expires &&
    session.accessToken &&
    session.refreshToken
  ) {
    session = await refreshTokenIfNecessary(session);
  }

  if (!session.isLoggedIn || !session.accessToken) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  //
  // else {
  //   let response;
  //   let data;

  //   if (
  //     session.accessToken !== undefined ||
  //     session.refreshToken !== undefined ||
  //     session.expires !== undefined
  //   ) {
  //     response = await fetch(
  //       `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/auth/refresh`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );

  //     data = await response.json();
  //   }

  //   console.log("data ", data);
  //   session.accessToken = data.accessToken;
  //   session.refreshToken = data.refreshToken;
  //   session.expires = data.expires;
  // }

  return session;
};

export const refreshTokenIfNecessary = async (
  session: IronSession<SessionData>,
) => {
  "use server";
  if (session !== undefined) {
    const now = Date.now();

    const expires = new Date(session?.expires!);

    if (now >= expires.getTime()) {
      const response = await fetch(
        "https://staging.yggio.net/auth/realms/yggio/protocol/openid-connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: session.refreshToken!,
            client_id: process.env.NEXT_PUBLIC_YGGIO_CLIENT_ID!,
            client_secret: process.env.YGGIO_CLIENT_SECRET!,
          }),
        },
      );

      const data = await response.json();

      console.log("data i login,", data);

      session.accessToken = data.access_token;
      session.refreshToken = data.refresh_token;
      const expiresInMs = data.expires_in * 1000;
      session.expires = new Date(new Date().getTime() + expiresInMs);

      await session.save();
    }
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
