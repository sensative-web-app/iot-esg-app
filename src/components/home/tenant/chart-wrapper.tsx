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
import TemperatureChart from "./temperature-chart";
import Co2Chart from "./co2-chart";

export default function ChartWrapper({
  accessToken,
  chart,
}: {
  accessToken: string;
  chart: string;
}) {
  const [selectedRange, setSelectedRange] = useState("7d");
  const queryClient = new QueryClient();
  let { data, isLoading, refetch } = useQuery({
    queryKey: [`${chart}`, selectedRange],
    queryFn: () => fetchChartData(accessToken, selectedRange, chart),
  });

  const handleRangeChange = async (range: string) => {
    queryClient.invalidateQueries({ queryKey: [`${chart}`, range] });
    setSelectedRange(range);
    const refetchedData = await refetch();
    data = refetchedData.data;
  };

  return (
    <div className="flex-col w-full  px-48">
      <div className=" flex w-full justify-end mr-4">
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
            <Button className="justify-end">Select range</Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <Skeleton className="mt-6 ml-6 w-[750px] h-[350px] rounded-xl" />
      ) : (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          {chart === "electricityChart" && <ElectricityChart data={data} />}
          {chart === "co2Chart" && <Co2Chart data={data} />}

          {/* {chart === "temperatureChart" && <TemperatureChart data={data} />} */}
        </ErrorBoundary>
      )}
    </div>
  );
}
