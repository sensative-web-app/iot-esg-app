import { useEffect } from "react";
import mqtt from "mqtt";

export const useMqtt = (setID: string, nodeID: string, onMessage: Function) => {
  useEffect(() => {
    const topic = `yggio/output/v2/${setID}/iotnode/${nodeID}`;
    const client = mqtt.connect(process.env.NEXT_PUBLIC_YGGIO_MQTT_URL!, {
      username: `iot-esg-app-set`,
      password: "super-secret-password",
    });

    client.on("connect", () => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Failed to subscribe to topic", err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });

    client.on("message", (topic, message) => {
      onMessage(topic, message);
    });

    return () => {
      console.log("Disconnecting from MQTT broker");
      client.end();
    };
  }, [setID, nodeID, onMessage]);
};
