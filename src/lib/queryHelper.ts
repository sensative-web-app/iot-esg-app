import { getNode, getNodeStats, getNodes } from "@/actions";

export const fetchChartData = async (
  accessToken: string,
  range: string,
  chart: string,
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

  switch (chart) {
    case "electricityChart":
      return fetchElectricityData(
        accessToken,
        startTime,
        currentTimestamp,
        distance,
        xAxisOptions,
      );
    case "temperatureChart":
      return fetchTemperatureData(accessToken, startTime, xAxisOptions);

    case "co2Chart":
      return fetchCo2Data(
        accessToken,
        startTime,
        currentTimestamp,
        distance,
        xAxisOptions,
      );

    case "electricityConsumptionChart":
      return fetchElectricityConsumption(
        accessToken,
        startTime,
        currentTimestamp,
        distance,
        xAxisOptions,
      );

    //return fetchTemperatureData(accessToken, range);
  }
};

export const fetchCo2Data = async (
  accessToken: string,
  startTime: number,
  currentTimestamp: number,
  distance: number,
  xAxisOptions: any,
) => {
  console.log(startTime);
  const co2Data = await getNodeStats(
    accessToken,
    "6234b61cd68c97000897fca9",
    "co2",
    startTime,
    currentTimestamp,
    distance,
  );

  const formattedData = formatData(co2Data);

  const labels = formattedData.map((item: any) => item.x.toISOString());
  const values = formattedData.map((item: any) => item.y.toFixed(0));

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Co2",
        data: values,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y",
      },
    ],
  };

  return { data, xAxisOptions };
};

export const fetchTemperatureData = async (
  accessToken: string,
  startTime: number,
  xAxisOptions: any,
) => {
  console.log(startTime);
  const temperatureData = await getNodeStats(
    accessToken,
    "60a3ab8b007e8f00076009eb",
    "temperature",
    startTime,
  );
  console.log(temperatureData);

  const start = new Date(startTime);

  const filteredData = temperatureData.filter((data: any) => {
    const time = new Date(data.time);

    return time >= start;
  });

  const formattedData = formatData(filteredData);
  const labels = formattedData.map((item: any) => item.x.toISOString());
  const values = formattedData.map((item: any) => item.y);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Temperature",
        data: values,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y",
      },
    ],
  };

  return { data, xAxisOptions };
};

export const fetchElectricityData = async (
  accessToken: string,
  startTime: number,
  currentTimestamp: number,
  distance: number,
  xAxisOptions: any,
) => {
  const incrementalConsumptionData = await fetchConsumptioneData({
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

  return formatData(rawElectricityPriceData);
};

const formatData = (rawData: any) => {
  let data = [];

  for (let i = 0; i < rawData.length; i++) {
    data.push({
      x: new Date(rawData[i].time),
      y: rawData[i].value,
    });
  }
  return data;
};

const fetchConsumptioneData = async ({
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

export const fetchElectricityConsumption = async (
  accessToken: string,
  startTime: number,
  currentTimestamp: number,
  distance: number,
  xAxisOptions: any,
) => {
  const consumptionData = await fetchConsumptioneData({
    accessToken,
    startTime,
    currentTimestamp,
    distance,
  });

  const labels = consumptionData.map((item: any) => item.x.toISOString());
  const values = consumptionData.map((item: any) => item.y.toFixed(0));

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Electricity Consumption",
        data: values,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y",
      },
    ],
  };

  return { data, xAxisOptions };
};

export const fetchAirQualityData = async (token: string, id: string) => {
  const node = await getNode(token, id);

  return node;
};

export async function fetchNodes(token: string) {
  const nodes = await getNodes(token);

  return nodes;
}
