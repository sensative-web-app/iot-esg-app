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

const ElectricityChart = ({ data }: { data: any }) => {
  const chartData = data.data;
  const xAxisOptions = data.xAxisOptions;

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
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Price",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Electricity Consumption x Price",
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ElectricityChart;
