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
    <div className="flex-col w-full justify-center items-center">
      <div className=" flex justify-end mr-48">
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
        <div className="flex justify-center items-center w-full">
          <div className="w-2/3">
            <Skeleton className="mt-6 ml-6 w-[720px] h-[350px] rounded-xl" />
          </div>
        </div>
      ) : (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <div className="flex justify-center items-center w-full">
            <div className="w-2/3">
              {chart === "electricityChart" && <ElectricityChart data={data} />}
              {chart === "co2Chart" && <Chart data={data} text={"Co2"} />}

              {chart === "temperatureChart" && (
                <Chart data={data} text={"Temperature"} />
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
