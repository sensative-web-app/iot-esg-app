"use client";

import dynamic from "next/dynamic";
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});
import { useQuery } from "@tanstack/react-query";
import { fetchAirQualityData } from "@/lib/queryHelper";
import { Skeleton } from "@/components/ui/skeleton";

export function AirGauge({ token, id }: { token: string; id: string }) {
  let { data, isLoading } = useQuery({
    queryKey: [`iaq`, token, id],
    queryFn: () => fetchAirQualityData(token, id),
  });

  const maxAirQuality = 300;

  const airQualityRanges = [
    { limit: 50, color: "#00E400" }, // Good (Green)
    { limit: 100, color: "#7FFF00" }, // Moderate (Light Green)
    { limit: 150, color: "#FFFF00" }, // Unhealthy for Sensitive Groups (Yellow)
    { limit: 200, color: "#FF7E00" }, // Unhealthy (Orange)
    { limit: 250, color: "#FF0000" }, // Very Unhealthy (Red)
    { color: "#7E0023" }, // Hazardous (Dark Red)
  ];

  return (
    <div
      className={`${isLoading ? "" : "bg-muted"} w-[300px] h-[175px] rounded-xl`}
    >
      {isLoading ? (
        <Skeleton className="rounded-xl w-[300px] h-[175px]" />
      ) : (
        <GaugeComponent
          id="air-quality-gauge"
          value={data.output.air_iaq}
          maxValue={maxAirQuality}
          arc={{
            subArcs: airQualityRanges,
            width: 0.3,
            padding: 0.05,
            cornerRadius: 7,
          }}
          labels={{
            valueLabel: {
              formatTextValue: (value) => `${Math.round(value)} IAQ`,
              style: {
                fontSize: "24px",
                fill: "#FFFFFF", // Changed text color to white
                textShadow:
                  "black 1px 1px 0px, black 0px 0px 2.5em, black 0px 0px 0.2em",
              },
            },
            tickLabels: {
              type: "outer",
              ticks: [
                { value: 50 },
                { value: 100 },
                { value: 150 },
                { value: 200 },
                { value: 250 },
                { value: 300 },
              ],
            },
          }}
        />
      )}
      {/* <GaugeComponent
        id="air-quality-gauge"
        value={iaq}
        maxValue={maxAirQuality}
        arc={{
          subArcs: airQualityRanges,
          width: 0.3,
          padding: 0.05,
          cornerRadius: 7,
        }}
        labels={{
          valueLabel: {
            formatTextValue: (value) => `${Math.round(value)} IAQ`,
            style: {
              fontSize: "24px",
              fill: "#FFFFFF", // Changed text color to white
              textShadow:
                "black 1px 1px 0px, black 0px 0px 2.5em, black 0px 0px 0.2em",
            },
          },
          tickLabels: {
            type: "outer",
            ticks: [
              { value: 50 },
              { value: 100 },
              { value: 150 },
              { value: 200 },
              { value: 250 },
              { value: 300 },
            ],
          },
        }}
      /> */}
    </div>
  );
}
