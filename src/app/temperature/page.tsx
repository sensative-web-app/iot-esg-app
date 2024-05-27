import { getSession, getNodeByContext } from "@/actions";
import { SideNav } from "@/components/nav/side-nav";
import ChartWrapper from "@/components/home/tenant/chart-wrapper";
import { SensorCard } from "@/components/home/tenant/sensor-card";
import { HumidityGauge } from "@/components/home/tenant/humidity-gauge";
import { Thermostat } from "@/components/home/tenant/termostat";

export default async function Index() {
  const session = await getSession();
  const { accessToken } = session;

  const tempNode = await getNodeByContext(accessToken, "temperature")

  const humNode = await getNodeByContext(accessToken, "humidity")

  const termoNode = await getNodeByContext(accessToken, "thermostat")


  return (
    <SideNav role={session.role}>
      <div className="text-primary flex min-h-[calc(100vh-64px)]  w-full flex-col items-center pt-6">
        <div className="w-full h-full justify-center">
          <div className="flex w-full justify-center gap-8">
            {!humNode ? <></> : (
              <HumidityGauge
                nodeID={humNode._id}
                currentValue={humNode.humidity}
                setID={process.env.NEXT_PUBLIC_SET_ID!}
                sensorType="humidity"
              />)
            }
            {!tempNode ? <></> :
              <SensorCard
                nodeID={tempNode._id}
                currentValue={tempNode.temperature.toFixed(1)}
                reportedAt={tempNode.reportedAt}
                setID={process.env.NEXT_PUBLIC_SET_ID!}
                // userID={userID!}
                sensorType="temperature"
                sensorUnit="°C"
              />
            }
            <Thermostat
              session={accessToken}
              nodeID={termoNode._id}
              currentValue={termoNode.contextMap}
            />

          </div>
          <div className="pt-10 w-full justify-center ">
            <ChartWrapper chart="temperatureChart" accessToken={accessToken!} chartParams={tempNode._id} />
          </div>
        </div>
      </div>
    </SideNav>
  );
}
