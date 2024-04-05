import { getNodeStats } from "@/actions";

export const fetchElectricityData = async (
  accessToken: string,
  range: string,
) => {
  const currentTimestamp = Date.now();
  let startTime;
  let distance;
  let axisBottomFormat;
  let axisBottomTickValues;

  switch (range) {
    case "24h":
      startTime = currentTimestamp - 24 * 60 * 60 * 1000; // Last 24 hours
      distance = 3600; // 1 hour in seconds
      axisBottomFormat = "HH:mm";
      axisBottomTickValues = { unit: "hour", stepSize: 1 };
      break;
    case "7d":
      startTime = currentTimestamp - 7 * 24 * 60 * 60 * 1000; // Last 7 days
      distance = 3600; // 1 hour in seconds
      axisBottomFormat = "EEE";
      axisBottomTickValues = { unit: "day", stepSize: 1 };
      break;
    case "30d":
      startTime = currentTimestamp - 30 * 24 * 60 * 60 * 1000; // Last 30 days
      distance = 86400; // 1 day in seconds
      axisBottomFormat = "MMM d";
      axisBottomTickValues = { unit: "day", stepSize: 1 };
      break;
    default:
      startTime = currentTimestamp - 7 * 24 * 60 * 60 * 1000; // Default to last 7 days
      distance = 3600; // 1 hour in seconds
      axisBottomFormat = "MMM d";
      axisBottomTickValues = { unit: "day", stepSize: 1 };
  }

  const incrementalConsumptionData = await fetchElectricityConsumptioneData({
    accessToken,
    startTime,
    currentTimestamp,
    distance,
  });

  const electricityPriceData = await fetchElectricityPriceData({
    accessToken,
    startTime,
    currentTimestamp,
    distance,
  });

  // console.log("consumption data: ", incrementalConsumptionData.length);
  // console.log("price data: ", electricityPriceData!.length);

  const labels = incrementalConsumptionData.map((item: any) =>
    item.x.toISOString(),
  );
  const consumptionData = incrementalConsumptionData.map((item: any) => item.y);
  const priceData = electricityPriceData!.map((item: any) => item.y);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Electricity Consumption",
        data: consumptionData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y",
      },
      {
        label: "Electricity Price",
        data: priceData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y1",
      },
    ],
  };

  const xAxisOptions = {
    type: "time",
    time: {
      unit: axisBottomTickValues.unit,
      displayFormats: {
        [axisBottomTickValues.unit]: axisBottomFormat,
      },
      stepSize: axisBottomTickValues.stepSize,
    },
  };

  return { data, xAxisOptions };
};

const fetchElectricityPriceData = async ({
  accessToken,
  startTime,
  currentTimestamp,
  distance,
}: {
  accessToken: string;
  startTime: number;
  currentTimestamp: number;
  distance: number;
}) => {
  const rawElectricityPriceData = await getNodeStats(
    accessToken,
    "61e7fd68cb490600097a03cc",
    "price",
    startTime,
    currentTimestamp,
    distance,
  );

  const formatData = (rawElectricityPriceData: any) => {
    let data = [];

    for (let i = 0; i < rawElectricityPriceData.length; i++) {
      data.push({
        x: new Date(rawElectricityPriceData[i].time),
        y: rawElectricityPriceData[i].value,
      });
    }
    return data;
  };

  return formatData(rawElectricityPriceData);
};

const fetchElectricityConsumptioneData = async ({
  accessToken,
  startTime,
  currentTimestamp,
  distance,
}: {
  accessToken: string;
  startTime: number;
  currentTimestamp: number;
  distance: number;
}) => {
  const rawElectricityConsumptionData = await getNodeStats(
    accessToken,
    "65e830e40d1c07d883f0af86",
    "electricityConsumption",
    startTime,
    currentTimestamp,
    distance,
  );

  const calculateIncrementalConsumption = (data: any) => {
    const incrementalData = [];
    for (let i = 1; i < data.length; i++) {
      const prevValue = data[i - 1].value;
      const currentValue = data[i].value;
      const consumptionDiff = currentValue - prevValue;
      incrementalData.push({
        x: new Date(data[i].time),
        y: consumptionDiff,
      });
    }
    return incrementalData;
  };

  return calculateIncrementalConsumption(rawElectricityConsumptionData);
};
