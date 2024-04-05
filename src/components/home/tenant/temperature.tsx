"use client";

import mqtt from "mqtt";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "react-error-boundary";
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
    const client = mqtt.connect(process.env.NEXT_PUBLIC_YGGIO_MQTT_URL!, {
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
    <ErrorBoundary fallback={<div></div>}>
      <Card className="w-80 rounded-2xl">
        <CardContent className="w-full h-full p-0">
          <div className="flex flex-row items-center w-full justify-center h-full gap-8 ">
            <ThermometerIcon />
            <div className="grid gap-4">
              <div className="text-3xl font-bold tracking-tighter">
                {value}
                <span className="text-lg font-normal ml-3"> °C</span>
              </div>
              <div className="text-xs font-light leading-none">
                {formattedReportedTime}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

function ThermometerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4em"
      height="4em"
      viewBox="0 0 56 56"
    >
      <path
        fill="currentColor"
        d="M27.192 8.304c1 0 1.826-.826 1.826-1.804V1.805c0-1-.826-1.805-1.826-1.805c-.978 0-1.805.805-1.805 1.804V6.5c0 .978.827 1.804 1.805 1.804M37.235 12.5c.674.696 1.87.717 2.587 0l3.305-3.348a1.81 1.81 0 0 0 0-2.543a1.784 1.784 0 0 0-2.522 0l-3.37 3.37c-.695.695-.674 1.826 0 2.521M16.844 56c6.26 0 11.348-5.087 11.348-11.348c0-3.304-1.37-6.195-3.957-8.543c-.478-.435-.587-.674-.587-1.326l.022-2.087c1.109.413 2.304.608 3.522.608c5.978 0 10.76-4.782 10.76-10.76a10.735 10.735 0 0 0-10.76-10.783c-1.348 0-2.652.26-3.892.76c-.89-2.977-3.26-4.825-6.456-4.825c-4.109 0-6.87 3.021-6.87 7.565l.022 19.522c0 .652-.109.891-.565 1.326c-2.609 2.348-3.956 5.239-3.956 8.543C5.475 50.913 10.54 56 16.844 56m0-3.152c-4.522 0-8.196-3.696-8.196-8.196c0-2.717 1.283-5.174 3.587-6.717c.674-.457.935-.87.935-1.761V15.391c0-2.739 1.5-4.5 3.674-4.5c2.152 0 3.63 1.761 3.63 4.5v20.783c0 .891.261 1.304.935 1.76c2.305 1.544 3.587 4 3.587 6.718c0 4.5-3.652 8.196-8.152 8.196m10.348-37.913c4.26 0 7.565 3.326 7.565 7.609c0 4.26-3.304 7.587-7.565 7.587a7.559 7.559 0 0 1-3.522-.892l.022-13.348c1.065-.608 2.26-.956 3.5-.956m-10.37 34.978c2.913 0 5.261-2.37 5.261-5.282c0-2.044-1.152-3.718-2.826-4.631c-.696-.37-.935-.63-.935-1.696V17.218c0-1.13-.652-1.827-1.5-1.827c-.826 0-1.5.696-1.5 1.827v21.086c0 1.066-.239 1.326-.934 1.696c-1.674.913-2.827 2.587-2.827 4.63a5.256 5.256 0 0 0 5.261 5.283M43.17 24.348h4.718c.978 0 1.782-.826 1.782-1.804c0-1-.804-1.805-1.782-1.805H43.17c-.956 0-1.783.805-1.783 1.805c0 .978.827 1.804 1.783 1.804M40.605 38.5c.696.696 1.826.674 2.522-.022c.695-.695.695-1.848 0-2.521l-3.348-3.348c-.696-.674-1.848-.696-2.544 0a1.81 1.81 0 0 0 0 2.543Z"
      />
    </svg>
  );
}
