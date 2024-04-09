import { getNode, getSession } from "@/actions";
import { SideNav } from "@/components/nav/side-nav";
import ChartWrapper from "@/components/home/tenant/chart-wrapper";
import { SensorCard } from "@/components/home/tenant/sensor-card";

export default async function Index() {
  const session = await getSession();
  const { accessToken, userID, nodes } = session;

  const tempNodeID = nodes.find((node: any) =>
    node.name.includes("Comfort"),
  )?.id;

  const node = await getNode(accessToken!, tempNodeID!);
  console.log(node);
  return (
    <SideNav role={session.role}>
      <div className="text-primary flex min-h-[calc(100vh-64px)]  w-full flex-col items-center pt-6">
        <div className="w-full h-full justify-center">
          <div className="flex w-full justify-center ">
            <SensorCard
              nodeID={node._id}
              currentValue={node.temperature}
              reportedAt={node.reportedAt}
              setID={process.env.NEXT_PUBLIC_SET_ID!}
              userID={userID!}
              sensorType="temperature"
              sensorUnit="°C"
            />
          </div>
          <div>
            <ChartWrapper chart="temperatureChart" accessToken={accessToken!} />
          </div>
        </div>
      </div>
    </SideNav>
  );
}
