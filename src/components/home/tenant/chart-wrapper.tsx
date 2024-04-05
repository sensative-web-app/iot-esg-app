"use client";

import { QueryCache, QueryClient, useQuery } from "@tanstack/react-query";
import { fetchElectricityData } from "@/lib/queryHelper";
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

import { ErrorBoundary } from "react-error-boundary";

export default function ChartWrapper({ accessToken }: { accessToken: string }) {
  const [selectedRange, setSelectedRange] = useState("7d");

  let { data, isLoading, refetch } = useQuery({
    queryKey: ["consumptionData", selectedRange],
    queryFn: () => fetchElectricityData(accessToken, selectedRange),
  });

  const handleRangeChange = async (range: string) => {
    setSelectedRange(range);
    const refetchedData = await refetch();
    data = refetchedData.data;
  };

  return (
    <div className="flex-col w-full h-full px-48">
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
            <Button className="justify-end">Select Range</Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="min-w-full min-h-full h-full w-full">Loading...</div>
      ) : (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ElectricityChart electricityConsumptionData={data} />
        </ErrorBoundary>
      )}
    </div>
  );
}
