"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

const ElectricityChart = ({
  electricityConsumptionData,
}: {
  electricityConsumptionData: any;
}) => {
  const chartData = electricityConsumptionData.data;
  const xAxisOptions = electricityConsumptionData.xAxisOptions;

  const options = {
    responsive: true,
    scales: {
      x: {
        type: xAxisOptions.type,
        time: xAxisOptions.time,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Consumption",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Electricity Consumption",
      },
    },
  };

  return (
    <div className="h-[400px] w-[900px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ElectricityChart;
