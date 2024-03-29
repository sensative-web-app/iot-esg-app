"use client";

import mqtt from "mqtt";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import useMqtt from "@/lib/mqtt";
import { getList } from "@/actions";

export const Temperature = ({
  nodeID,
  reportedAt,
  currentValue,
  setID,
  userID,
}: {
  nodeID: string;
  reportedAt: string;
  currentValue: number;
  setID: string;
  userID: string;
}) => {
  const [value, setValue] = useState(currentValue);
  const [reportedTime, setReportedTime] = useState(reportedAt);

  useEffect(() => {
    const topic = `yggio/output/v2/${setID}/iotnode/${nodeID}`;
    const client = mqtt.connect("wss://mqtt.staging.yggio.net:15676/ws", {
      username: `user-${userID}`,
      password: "super-secret-password",
    });

    client.on("connect", () => {
      console.log("Connecting to MQTT broker");
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Failed to subscribe to topic", err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    });

    client.on("message", (topic, message) => {
      const { iotnode } = JSON.parse(message.toString());
      console.log(iotnode);

      const reportedAt = iotnode.reportedAt;
      const temp = iotnode.temperature;

      setValue(temp);
      setReportedTime(reportedAt);
    });

    return () => {
      console.log("Disconnecting from MQTT broker");
      client.end();
    };
  }, [nodeID, setID, userID]);

  const formattedReportedTime = formatDistanceToNow(new Date(reportedTime), {
    addSuffix: true,
  });

  return (
    <div className="flex w-full max-w-sm items-center justify-center rounded-xl border border-primary p-6">
      <div className="grid gap-1.5 text-center">
        <div className="text-4xl font-semibold leading-none">
          {value}
          <span className="text-sm font-normal">°C</span>
        </div>
        <div className="text-xs font-light leading-none">
          {formattedReportedTime}
        </div>
      </div>
    </div>
  );
};
