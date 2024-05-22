"use client";

import { QueryClient, useQuery } from "@tanstack/react-query";
import { fetchChartData } from "@/lib/queryHelper";
import ElectricityChart from "./electricity-chart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { ErrorBoundary } from "react-error-boundary";

import Chart from "./chart";
import WaterChart from "./water-chart";

export default function ChartWrapper({
  accessToken,
  chart,
  chartParams,
}: {
  accessToken: string;
  chart: string;
  chartParams: unknown;
}) {
  const [selectedRange, setSelectedRange] = useState("7d");
  const queryClient = new QueryClient();
  let { data, isLoading, refetch } = useQuery({
    queryKey: [`${chart}`, selectedRange, chartParams],
    queryFn: () => fetchChartData(accessToken, selectedRange, chart, chartParams),
  });

  const handleRangeChange = async (range: string) => {
    queryClient.invalidateQueries({ queryKey: [`${chart}`, range, chartParams] });
    setSelectedRange(range);
    const refetchedData = await refetch();
    data = refetchedData.data;
  };

  return !data ? <></> : (
    <div className="flex-col w-full justify-center items-center">
      <div className="w-full flex items-center justify-center mb-4">
        <div className="w-[800px] flex justify-end">
          <DropdownMenu>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selectedRange}
                onValueChange={handleRangeChange}
              >
                <DropdownMenuRadioItem value="24h">
                  Last 24 Hours
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="7d">
                  Last 7 Days
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="30d">
                  Last 30 Days
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
            <DropdownMenuTrigger asChild>
              <Button className="">Select range</Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="mt-6 ml-6 rounded-xl w-[775px] h-[400px] mx-auto" />
      ) : (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <div className="flex justify-center items-center w-full h-full">
            <div className="h-[400px] w-[800px]">
              {chart === "electricityChart" && <ElectricityChart data={data} />}
              {chart === "co2Chart" && <Chart data={data} text={"Co2"} />}
              {chart === "temperatureChart" && (
                <Chart data={data} text={"Temperature"} />
              )}
               {chart === "waterChart" && (
                <WaterChart data={data} text={"Water Consumption"} />
              )}

              {chart === "electricityConsumptionChart" && (
                <Chart data={data} text={"Consumption"} />
              )}
            </div>
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
}
