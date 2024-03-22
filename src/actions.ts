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

  // console.log("token i getSession: ", session?.accessToken);

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

export const getUser = async (session: SessionData) => {
  let response;
  let user;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/users/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    user = await response.json();
  } catch (error: any) {
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

export const createBasicCredentialsSet = async (id: string, token: string) => {
  let response;
  let credentials;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/basic-credentials-sets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `user-${id}`,
          password: "super-secret-password",
        }),
      },
    );

    if (response.status === 404) {
      return undefined;
    }

    credentials = await response.json();
  } catch (error: any) {
    console.log("e", error.message);

    return undefined;
  }

  return credentials;
};

export const getBasicCredentialSet = async (id: string, token: string) => {
  const currentSets = await getBasicCredentialsSets(token);
  let set;

  if (currentSets.length === 0 || currentSets === undefined) {
    set = await createBasicCredentialsSet(id, token);
  }

  return set ? set : currentSets[0];
};

export const getBasicCredentialsSets = async (token: string) => {
  let response;
  let credentials;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/basic-credentials-sets`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 404) return undefined;

    credentials = await response.json();
  } catch (error: any) {
    console.log(error.message);
    return undefined;
  }

  return credentials;
};
export const createChannel = async (
  token: string,
  nodeID: string,
  basicCredentialsSetId: string,
) => {
  let response;
  let channel;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/channels`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "iot-esg-app-test",
          iotnode: nodeID,
          mqtt: {
            type: "basicCredentialsSet",
            recipient: basicCredentialsSetId,
          },
        }),
      },
    );

    if (response.ok) {
      channel = await response.json();
      console.log("Channel created:", channel);
    } else {
      console.log("Failed to create channel:", response.statusText);
      return undefined;
    }
  } catch (e) {
    console.log("Error creating channel:", e);
    return undefined;
  }

  return channel;
};

export const get2 = async () => {};
