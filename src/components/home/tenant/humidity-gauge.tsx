"use client";

import dynamic from "next/dynamic";
import React, { Suspense, useState } from 'react';
import Image from "next/image";
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});
import { useMqtt } from "@/lib/mqtt";
import { ErrorBoundary } from "react-error-boundary";
import { Card } from "@/components/ui/card";
import humLogo from "../../../../public/humidity2.png"

export const HumidityGauge = ({
  nodeID,
  currentValue,
  setID,
  sensorType
}: {
  nodeID: string;
  currentValue: number;
  setID: string;
  sensorType: string;
}) => {
  const [value, setValue] = useState(currentValue);

  const onMessage = (topic: any, message: any) => {
    const { iotnode } = JSON.parse(message.toString());
    const sensorValue = iotnode[sensorType];
    setValue(sensorValue);
  };

  useMqtt(setID, nodeID, onMessage);

  return !nodeID ? <></> : (
    <div className={`bg-muted rounded-xl`}>
      <Card className="w-80 h-48 bg-muted rounded-2xl ">
        <div className="flex items-center justify-center flex-col relative h-full">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2  font-semibold">
            Humidity
          </div>
          <div className="flex items-center justify-center flex-1">

            <Suspense fallback={<div>Loading...</div>}>
              <GaugeComponent
                arc={{
                  colorArray: ['#FF2121', '#FFA500', '#FFFF00', '#00FF15', '#FFFF00', '#FFA500', '#FF2121'], // Red, Orange, Yellow, Green, Yellow, Red
                  padding: 0.02,
                  subArcs: [
                    { limit: 20 },   // Yellow
                    { limit: 30 },   // Orange
                    { limit: 40 },   // Green
                    { limit: 60 },   // Orange
                    { limit: 70 },   // Yellow
                    { limit: 80 },
                    { limit: 90 }   // Red
                  ]
                }}
                pointer={{ type: "arrow", elastic: true, animationDelay: 0, animate: false }}
                value={value}
              />
            </Suspense>
          </div>
        </div>
      </Card>
    </div>
  );
};
