import { useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

interface UseMqttOptions {
  setID: string;
  userID: string;
  nodeID: string;
}

function useMqtt({ setID, userID, nodeID }: UseMqttOptions) {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [iotnode, setIotnode] = useState<any>(null);

  useEffect(() => {
    const topic = `yggio/output/v2/${setID}/iotnode/${nodeID}`;
    const mqttClient = mqtt.connect("wss://mqtt.staging.yggio.net:15676/ws", {
      username: `user-${userID}`,
      password: "super-secret-password",
    });

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error("Failed to subscribe to topic", err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
      setClient(mqttClient);
    });

    mqttClient.on("message", (message) => {
      const { iotnode } = JSON.parse(message.toString());
      console.log(iotnode);
      setIotnode(iotnode);
    });

    mqttClient.on("error", (error) => {
      console.error("MQTT error:", error);
    });

    return () => {
      console.log("Disconnecting from MQTT broker");
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, [nodeID, setID, userID]);

  return { client, iotnode };
}

export default useMqtt;
