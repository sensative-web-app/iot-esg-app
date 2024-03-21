"use server";

import { SessionData, sessionOptions } from "./lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const get = async () => {};

export const getSession = async () => {
  let session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const now = Date.now();
  const refreshExpires = new Date(session?.refreshExpires!).getTime() - 3600000;

  if (
    Object.keys(session).length === 0 ||
    now >= refreshExpires ||
    !session?.accessToken ||
    !session?.refreshToken ||
    !session?.expires ||
    !session?.refreshExpires
  ) {
    return undefined;
  }

  console.log(session);
  return session;
};

export const login = async () => {
  const session = await getSession();
  if (session !== undefined) session!.destroy();

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
  let response;
  let nodes;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/iotnodes`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    nodes = await response.json();
  } catch (e) {
    console.log(e);
    return undefined;
  }

  return nodes;
};

export const getUser = async (token: string) => {
  let response;
  let user;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/users/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    user = await response.json();

    console.log("user i server action", user);
  } catch (error: any) {
    console.log(error.message);
    return undefined;
  }

  return user;
};

export const getChannels = async (token: string, nodeID: string) => {
  let response;
  let channels;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/channels?iotnode=${nodeID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    channels = await response.json();
  } catch (e) {
    console.log(e);
    return undefined;
  }

  return channels;
};

export const getBasicCredentialSet = async (token: string) => {
  let set;
  const currentSets = await getBasicCredentialsSets(token);

  console.log("currentSets", currentSets);
  if (!currentSets) {
    // set = await createBasicCredentialsSet(token);
    // console.log("set", set);
  }

  return currentSets;
};

export const getBasicCredentialsSets = async (token: string) => {
  let response;
  let credentials;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/basic-credentials-set`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 404) return undefined;

    console.log("response", response);
    credentials = await response.json();
    console.log("credentials", credentials);
  } catch (error: any) {
    console.log(error.message);
    return undefined;
  }

  return credentials;
};

export const createBasicCredentialsSet = async (token: string) => {
  let response;
  let credentials;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/basic-credentials-set`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "test-iot-esg-app",
          password: "super-secret-password",
        }),
      },
    );
    console.log("response", response);

    if (response.status === 404) {
      return undefined;
    }

    console.log("response", response);
    credentials = await response.json();
    console.log("credentials", credentials);
  } catch (e) {
    console.log("e", e);

    return undefined;
  }

  return credentials;
};

export const createChannel = async (token: string, nodeID: string) => {
  const basicCredentialsSet = await createBasicCredentialsSet(token);

  let response;
  let channel;

  try {
    // response = await fetch(
    //   `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/basic-credentials-set`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       username: "test-iot-esg-app",
    //       password: "super-secret-password"
    //     }),
    //   },
    // );
    // channel = await response.json();
  } catch (e) {
    console.log(e);
    return undefined;
  }

  return channel;
};

export const get2 = async () => {};
