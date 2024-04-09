import ChartWrapper from "@/components/home/tenant/chart-wrapper";
import { getNodes, getSession } from "@/actions";

import { SideNav } from "@/components/nav/side-nav";
import { SensorCard } from "@/components/home/tenant/sensor-card";
import { AirGauge } from "@/components/home/tenant/air-gauge";

export default async function Index() {
  const session = await getSession();
  const { accessToken, userID } = session;

  const allNodes = await getNodes(accessToken!);

  let airNode;
  let co2Node;

  if (allNodes.length > 0) {
    airNode = allNodes.find((node: any) => node.name.includes("Air"));
    co2Node = allNodes.find((node: any) => node.name.includes("CO2"));
  }

  return (
    <SideNav role={session.role}>
      <div className="text-primary flex min-h-[calc(100vh-64px)]  w-full flex-col items-center pt-6">
        <div className="w-full h-full justify-center">
          <div className="flex w-full justify-center gap-24 ">
            <AirGauge token={accessToken} id={airNode._id} />

            <SensorCard
              nodeID={co2Node._id}
              reportedAt={co2Node.reportedAt}
              currentValue={co2Node.co2}
              setID={process.env.NEXT_PUBLIC_SET_ID!}
              userID={userID!}
              sensorType="co2"
              sensorUnit="ppm"
            />
          </div>
          <div className="pt-10 w-full justify-center ">
            <ChartWrapper chart="co2Chart" accessToken={accessToken!} />
          </div>
        </div>
      </div>
    </SideNav>
  );
}
