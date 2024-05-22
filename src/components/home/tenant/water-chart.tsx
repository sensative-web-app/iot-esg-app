"use client"
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

export interface WaterChartParams {
  wWater: string | null | undefined;
  cWater: string | null | undefined;
}

const WaterChart = ({ data, text }: { data: any; text: string }) => {
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
          text: text,
        },
      },
    },
  };

  return (
    <div className="w-full text-2xl h-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default WaterChart;