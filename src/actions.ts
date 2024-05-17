"use server";

import { SessionData, sessionOptions } from "./lib/session";
import { IronSession, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const get = async () => { };

export const getSession = async () => {
  let session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const now = new Date().getTime();
  if (Object.keys(session).length > 0 && now > session.expire) {
    session = {} as IronSession<SessionData>;
  }

  return session;
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

export const getNode = async (token: string, nodeID: string) => {
  let response;
  let node;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/iotnodes/${nodeID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    node = await response.json();
  } catch (e) {
    console.log(e);
    return undefined;
  }

  return node;
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
          Authorization: `Bearer ${token!}`,
          "Content-Type": "application/json",
        },
      },
    );

    user = await response.json();
  } catch (error: any) {
    console.log(error);
    return undefined;
  }

  return user;
};

export const getRole = async (token: string) => {
  let response;
  let role;

  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/usergroups`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const groups = await response.json();
    role = groups[0].name;
  } catch (error: any) {
    return undefined;
  }

  return role;
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
          username: `iot-esg-app-set`,
          password: "super-secret-password",
        }),
      },
    );
    // console.log(response);

    if (response.status === 404) {
      return undefined;
    }

    credentials = await response.json();

    console.log(credentials);
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
export const createChannel = async (token: string, nodeID: string) => {
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
          name: "iot-esg-app-channel",
          iotnode: nodeID,
          mqtt: {
            type: "basicCredentialsSet",
            recipient: process.env.NEXT_PUBLIC_SET_ID,
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

/*
 * Retrieves the stat for a node.
 *
 * token, nodeID, measurement = Required.
 * start, end, distance = Optional.
 *
 * @param {string} token - The accesstoken required to access the API.
 * @param {string} nodeID - The ID of the node for which to retrieve stats.
 * @param {string} measurement - The name of the measurement to retrieve stats for.
 * @param {number} start - The start of the time period, in unix milliseconds time (i.e., milliseconds since 1970-01-01 00:00:00).
 * @param {number} end - The end of the time period, in unix milliseconds time (i.e., milliseconds since 1970-01-01 00:00:00).
 * @param {number} distance - The number of seconds between data points.
 */
export const getNodeStats = async (
  token: string,
  nodeID: string,
  measurement: string,
  start?: number,
  end?: number,
  distance?: number,
): Promise<NonNullable<any> | undefined> => {
  let url = `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/iotnodes/${nodeID}/stats?measurement=${measurement}`;

  if (start !== undefined) {
    url += `&start=${start}`;
  }

  if (end !== undefined) {
    url += `&end=${end}`;
  }

  if (distance !== undefined) {
    url += `&distance=${distance}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (response.ok) {
    return await response.json();
  } else {
    return undefined;
  }
};

export const getList = () => {
  const list = {
    co2: "6234b61cd68c97000897fca9",
    temperatureID: "60a3ab8b007e8f00076009eb",
  };

  return list;
};

export const get2 = async () => { };

export const getContTemp = async (
  token: string,
  nodeID: string,
  contextMap: any,
  newTemp: number,
) => {

  if (Object.hasOwn(contextMap, 'termotemp')) {
    contextMap['termotemp'] = newTemp;
  }

  console.log(contextMap)

  let url = `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/iotnodes/${nodeID}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contextMap: contextMap
    }),

  });

  if (response.ok) {
    return await response.json();
  } else {
    return undefined;
  }
};

export const changeTempOnTerm = async (
  token: string,
  url: string,
) => {

  const fullUrl = process.env.NEXT_PUBLIC_YGGIO_API_URL + url
  console.log(fullUrl)

  const response = await fetch(fullUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
  });

  if (response.ok) {
    return response.ok;
  } else {
    return undefined;
  }
};



export const getNodeByContext = async (
  token: string,
  context: string,
): Promise<any | null> => {

  let pattern = JSON.stringify({[`contextMap.LNU_type_${context}`]: context });
  let url = `${process.env.NEXT_PUBLIC_YGGIO_API_URL}/iotnodes?matchPattern=` + pattern;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const nodes = await response.json();
    return nodes.length ? nodes[0] : undefined;
  } else {
    return undefined;
  }
};
