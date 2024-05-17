import ChartWrapper from "@/components/home/tenant/chart-wrapper";
import { getNodes, getSession } from "@/actions";
import { getNodeByContext } from "@/actions";
import { SideNav } from "@/components/nav/side-nav";
import { SensorCard } from "@/components/home/tenant/sensor-card";
import { AirGauge } from "@/components/home/tenant/air-gauge";
import { fetchNodes } from "@/lib/queryHelper";
import { QueryClient } from "@tanstack/react-query";

export default async function Index() {
  const session = await getSession();
  const { accessToken } = session;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["nodes"],
    queryFn: () => fetchNodes(session.accessToken),
  });
  let airNode;


  const allNodes = await getNodes(session.accessToken);
  if (allNodes.length > 0) {
    airNode = allNodes.find((node: any) => node.name.includes("Air"));

  }

  const co2Node = await getNodeByContext(accessToken, "co2")

  return (
    <SideNav role={session.role}>
      <div className="text-primary flex min-h-[calc(100vh-64px)]  w-full flex-col items-center pt-6">
        <div className="w-full h-full justify-center">
          <div className="flex w-full justify-center gap-24 ">
            { !airNode ? <></> : (
           <AirGauge token={accessToken} id={airNode._id} />
            )}
            { !co2Node ? <></> : (
            <SensorCard
              nodeID={co2Node._id}
              reportedAt={co2Node.reportedAt}
              currentValue={co2Node.co2}
              setID={process.env.NEXT_PUBLIC_SET_ID!}
              // userID={userID!}
              sensorType="co2"
              sensorUnit="ppm"
            />
          )}
          </div>
          <div className="pt-10 w-full justify-center ">
            <ChartWrapper chart="co2Chart" accessToken={accessToken!} chartData={co2Node._id}/>
          </div>
        </div>
      </div>
    </SideNav>
  );
}
