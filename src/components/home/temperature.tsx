"use client";
import { useState, useRef } from "react";
import { MqttClient } from "mqtt";
import useMqtt from "@/lib/mqtt";

const mqttUri = "mqtt://mqtt.staging.yggio.net:1883";

export const Temperature = ({
  userID,
  nodeID,
  setID,
}: {
  userID: string;
  nodeID: string;
  setID: string;
}) => {
<<<<<<< HEAD
  const node = nodes.find((node) => node.name.includes("Comfort"));
  const nodeID = node?._id;

  // const channel = await createChannel(session.accessToken!, nodeID)
  //

  const sets = await getBasicCredentialSet(session.accessToken!);

=======
>>>>>>> e4875d3 (fix image stuff)
  return (
    <div className="pt-8">
      <h2>Latest Temperature Values:</h2>
    </div>
  );
};

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { MqttClient } from "mqtt";
// import useMqtt from "@/lib/mqtt";

// const mqttUri = "mqtt://mqtt.staging.yggio.net:1883";

// export const Temperature = ({
//   userID,
//   nodeID,
//   setID,
// }: {
//   userID: string;
//   nodeID: string;
//   setID: string;
// }) => {
//   const [latestValues, setLatestValues] = useState<Record<string, any>>({});

//   const mqttTopic = `yggio/output/v2/${setID}/#`;
//   const mqttUsername = `user-${userID}`;
//   const mqttPassword = `super-secret-password`;

//   const addValue = (iotnodeId: string, value: any) => {
//     setLatestValues((prevValues) => ({
//       ...prevValues,
//       [iotnodeId]: value,
//     }));
//   };

//   const messageHandlers = useRef([
//     {
//       topic: mqttTopic,
//       handler: (payload: any) => {
//         console.log("Received payload:", payload);
//         const [, , , id, , iotnodeId] = payload.topic.split("/");
//         if (id === setID) {
//           const parsedPayload = JSON.parse(payload.message.toString());
//           console.log(`Received data for iotnode ${iotnodeId}:`, parsedPayload);
//           addValue(iotnodeId, parsedPayload);
//         }
//       },
//     },
//   ]);

//   const mqttClientRef = useMqtt({
//     uri: mqttUri,
//     options: {
//       username: mqttUsername,
//       password: mqttPassword,
//       protocol: "mqtt",
//       port: 1883,
//     },
//     username: mqttUsername,
//     password: mqttPassword,
//     topicHandlers: messageHandlers.current,
//   });

//   console.log(mqttClientRef);

//   return (
//     <div className="pt-8">
//       <h2>Latest Temperature Values:</h2>
//       {Object.entries(latestValues).map(([iotnodeId, value]) => (
//         <div key={iotnodeId}>
//           <p>IoT Node ID: {iotnodeId}</p>
//           <p>Latest Value: {JSON.stringify(value)}</p>
//         </div>
//       ))}
//     </div>
//   );
// };
// "use client";

// import { MqttClient } from "mqtt";

// export const Temperature = ({
//   userID,
//   nodeID,
//   setID,
// }: {
//   userID: string;
//   nodeID: string;
//   setID: string;
// }) => {

//   const mqttUri = "mqtt://mqtt.staging.yggio.net:1883";

//   const mqttTopic = `yggio/output/v2/${setID}/#`;
//   const mqttUsername = `user-${userID}`;
//   const mqttPassword = `super-secret-password`;

//   return (
//     <div className="pt-8">
//       <h2>Latest Temperature Values:</h2>

//     </div>
//   );
// };
// "use client";
// import { useState, useEffect } from "react";
// import mqtt from "mqtt";

// const mqttUri = "mqtt://mqtt.staging.yggio.net:1883";

// export const Temperature = ({
//   userID,
//   nodeID,
//   setID,
// }: {
//   userID: string;
//   nodeID: string;
//   setID: string;
// }) => {
//   const [latestValues, setLatestValues] = useState<Record<string, any>>({});
//   const mqttTopic = `yggio/output/v2/${setID}/#`;
//   const mqttUsername = `user-${userID}`;
//   const mqttPassword = `super-secret-password`;

//   const mqttClient = mqtt.connect(
//     mqttUri,
//     {
//       username: mqttUsername,
//       password: mqttPassword,
//     },
//     {
//       protocol: "mqtt",
//       port: 1883,
//     },
//   );

//   mqttClient.on("connect", () => {
//     console.log("Connected to MQTT broker");
//     mqttClient.subscribe(mqttTopic);
//   });

//   mqttClient.on("message", (topic, payload) => {
//     console.log("Received payload:", payload);
//     const [, , , id, , iotnodeId] = topic.split("/");
//     if (id === setID) {
//       const parsedPayload = JSON.parse(payload.toString());
//       console.log(`Received data for iotnode ${iotnodeId}:`, parsedPayload);
//       setLatestValues((prevValues) => ({
//         ...prevValues,
//         [iotnodeId]: parsedPayload,
//       }));
//     }
//   });

//   // Clean up the MQTT client on component unmount
//   useEffect(() => {
//     return () => {
//       mqttClient.unsubscribe(mqttTopic);
//       mqttClient.end();
//     };
//   }, [mqttClient, mqttTopic]);

//   return (
//     <div className="pt-8">
//       <h2>Latest Temperature Values:</h2>
//       {Object.entries(latestValues).map(([iotnodeId, value]) => (
//         <div key={iotnodeId}>
//           <p>IoT Node ID: {iotnodeId}</p>
//           <p>Latest Value: {JSON.stringify(value)}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// "use client";
// import { useState, useRef } from "react";
// import { MqttClient } from "mqtt";
// import useMqtt from "@/lib/mqtt";

// const mqttUri = "mqtt://mqtt.staging.yggio.net:1883/";

// export const Temperature = ({
//   userID,
//   nodeID,
//   setID,
// }: {
//   userID: string;
//   nodeID: string;
//   setID: string;
// }) => {
//   const [latestValues, setLatestValues] = useState<Record<string, any>>({});
//   const mqttTopic = `yggio/output/v2/${setID}/#`;
//   const mqttUsername = `user-${userID}`;
//   const mqttPassword = `super-secret-password`;

//   const addValue = (iotnodeId: string, value: any) => {
//     setLatestValues((prevValues) => ({
//       ...prevValues,
//       [iotnodeId]: value,
//     }));
//   };

//   const messageHandlers = useRef([
//     {
//       topic: mqttTopic,
//       handler: (payload: any) => {
//         console.log("Received payload:", payload);
//         const [, , , id, , iotnodeId] = payload.topic.split("/");
//         if (id === setID) {
//           const parsedPayload = JSON.parse(payload.message.toString());
//           console.log(`Received data for iotnode ${iotnodeId}:`, parsedPayload);
//           addValue(iotnodeId, parsedPayload);
//         }
//       },
//     },
//   ]);

//   const mqttClientRef = useRef<MqttClient | null>(null);

//   const setMqttClient = (client: MqttClient) => {
//     mqttClientRef.current = client;
//   };

//   useMqtt({
//     uri: mqttUri,
//     options: {
//       username: mqttUsername,
//       password: mqttPassword,
//       protocol: "mqtt",
//     },
//     username: mqttUsername,
//     password: mqttPassword,

//     topicHandlers: messageHandlers.current,
//     onConnectedHandler: (client: any) => setMqttClient(client),
//   });

//   return (
//     <div className="pt-8">
//       <h2>Latest Temperature Values:</h2>
//       {Object.entries(latestValues).map(([iotnodeId, value]) => (
//         <div key={iotnodeId}>
//           <p>IoT Node ID: {iotnodeId}</p>
//           <p>Latest Value: {JSON.stringify(value)}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// "use client";
// import { useState, useEffect } from "react";
// import useMqtt from "@/lib/mqtt";
// import mqtt, { MqttClient } from "mqtt";

// // const mqttUri = "mqtt://mqtt.staging.yggio.net:1883";
// const mqttUri = "ws://test.mosquitto.org:8080";

// export const Temperature = ({
//   userID,
//   nodeID,
//   setID,
// }: {
//   userID: string;
//   nodeID: string;
//   setID: string;
// }) => {
//   const [client, setClient] = useState<MqttClient | null>(null);
//   const [messages, setMessages] = useState<any[]>([]);
//   const mqttTopic = "#";

//   const mqttUsername = `wildcard`;

//   useEffect(() => {
//     const mqttClient = mqtt.connect(mqttUri, {
//       username: mqttUsername,
//     });

//     mqttClient.on("connect", () => {
//       console.log("Connected to MQTT broker");
//       mqttClient.subscribe(mqttTopic);
//       setClient(mqttClient);
//     });

//     mqttClient.on("message", (topic: any, payload: any) => {
//       console.log(`Received message on topic ${topic}:`, payload.toString());
//     });

//     mqttClient.on("error", (error) => {
//       console.error("MQTT error:", error);
//     });

//     return () => {
//       if (mqttClient) {
//         mqttClient.end();
//       }
//     };
//   }, []);

//   return (
//     <div className="pt-8">
//       <h2>Latest Temperature Values:</h2>
//       {messages.map((message, index) => (
//         <div key={index}>
//           <p>Received Message: {message}</p>
//         </div>
//       ))}
//     </div>
//   );
// };
