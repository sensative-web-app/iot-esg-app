// import type { MqttClient, IClientOptions } from "mqtt";
// import MQTT from "mqtt";
// import { useEffect, useRef } from "react";

// interface useMqttProps {
//   uri: string;
//   options?: IClientOptions;
//   topicHandlers?: { topic: string; handler: (payload: any) => void }[];
//   onConnectedHandler?: (client: MqttClient) => void;
//   username: string;
//   password: string;
// }

// function useMqtt({
//   uri,
//   options = {},
//   topicHandlers = [{ topic: "", handler: ({ topic, payload, packet }) => {} }],
//   onConnectedHandler = (client: any) => {},
//   username,
//   password,
// }: useMqttProps) {
//   const clientRef = useRef<MqttClient | null>(null);

//   useEffect(() => {
//     if (clientRef.current) return;
//     if (!topicHandlers || topicHandlers.length === 0) return () => {};

//     try {
//       console.log("i trying to connect");
//       // clientRef.current = options
//       //   ? MQTT.connect(uri, { ...options, username, password }) :

//       clientRef.current = MQTT.connect(uri, { username, password });

//       console.log("woo");
//     } catch (error) {
//       console.log("error");
//       console.error("error", error);
//     }

//     const client = clientRef.current;

//     topicHandlers.forEach((th) => {
//       client?.subscribe(th.topic);
//     });

//     client?.on("message", (topic: string, rawPayload: any, packet: any) => {
//       const th = topicHandlers.find((t) => t.topic === topic);
//       let payload;
//       try {
//         payload = JSON.parse(rawPayload);
//       } catch {
//         payload = rawPayload;
//       }
//       if (th) th.handler({ topic, payload, packet });
//     });

//     client?.on("connect", () => {
//       if (onConnectedHandler) onConnectedHandler(client);
//     });

//     return () => {
//       if (client) {
//         topicHandlers.forEach((th) => {
//           client.unsubscribe(th.topic);
//         });
//         client.end();
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
// }

// export default useMqtt;
// import type { MqttClient, IClientOptions } from "mqtt";
// import MQTT from "mqtt";
// import { useEffect, useRef } from "react";

// interface useMqttProps {
//   uri: string;
//   options?: IClientOptions;
//   topicHandlers?: { topic: string; handler: (payload: any) => void }[];
//   onConnectedHandler?: (client: MqttClient) => void;
//   username: string;
//   password: string;
// }

// function useMqtt({
//   uri,
//   options = {},
//   topicHandlers = [{ topic: "", handler: ({ topic, payload, packet }) => {} }],
//   onConnectedHandler = (client: any) => {},
//   username,
//   password,
// }: useMqttProps) {
//   const clientRef = useRef<MqttClient | null>(null);

//   useEffect(() => {
//     if (clientRef.current) {
//       console.log(clientRef);
//       console.log(`client: ${clientRef.current}`);
//       return;
//     }

//     try {
//       console.log("Trying to connect");
//       clientRef.current = MQTT.connect(uri, { username, password });
//     } catch (error) {
//       console.log("Error");
//       console.error("Error", error);
//     }

//     const client = clientRef.current;

//     topicHandlers.forEach((th) => {
//       client?.subscribe(th.topic);
//     });

//     client?.on("message", (topic: string, rawPayload: any, packet: any) => {
//       console.log("Message received");
//       const th = topicHandlers.find((t) => t.topic === topic);
//       let payload;
//       try {
//         payload = JSON.parse(rawPayload);
//       } catch {
//         payload = rawPayload;
//       }
//       if (th) th.handler({ topic, payload, packet });
//     });

//     client?.on("connect", () => {
//       console.log("Connected woo");

//       console.log(client);

//       if (onConnectedHandler) onConnectedHandler(client);
//     });

//     client?.on("error", (error) => {
//       console.error("MQTT connection error:", error);
//     });

//     return () => {
//       if (client) {
//         topicHandlers.forEach((th) => {
//           client.unsubscribe(th.topic);
//         });
//         client.end();
//       }
//     };
//   });

//   return clientRef;
// }

// export default useMqtt;

import { useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

interface UseMqttOptions {
  uri: string;
  username: string;
  password: string;
  topic: string;
}

function useMqtt({ uri, username, topic }: UseMqttOptions) {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const mqttClient = mqtt.connect(uri, {
      username,
    });

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe(topic);
      setClient(mqttClient);
    });

    mqttClient.on("message", (topic, payload) => {
      console.log(`Received message on topic ${topic}:`, payload.toString());
      setMessages((prevMessages) => [...prevMessages, payload.toString()]);
    });

    mqttClient.on("error", (error) => {
      console.error("MQTT error:", error);
    });

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  });

  return { client, messages };
}

export default useMqtt;
