import { SessionData } from "@/lib/session";
import { getBasicCredentialSet, getUser } from "@/actions";

import { Temperature } from "./temperature";
import { Co2 } from "./co2";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import ChartWrapper from "./chart-wrapper";
import { fetchElectricityData } from "@/lib/queryHelper";

export const TenantDashboard = async ({
  session,
  nodes,
}: {
  session: SessionData;
  nodes: any[];
}) => {
  const temperatureNode = nodes.find((node) => node.name.includes("Comfort"));
  const co2Node = nodes.find((node) => node.name.includes("CO2"));

  const user = await getUser(session!);
  const set = await getBasicCredentialSet(user._id, session.accessToken!);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["consumptionData", "7d"],
    queryFn: () => fetchElectricityData(session.accessToken!, "7d"),
  });

  return (
    <div className="flex flex-col h-full w-full justify-center gap-12">
      <div className="flex w-full justify-center mt-10 gap-16 ">
        <Temperature
          nodeID={"60a3ab8b007e8f00076009eb"}
          currentValue={temperatureNode.temperature}
          reportedAt={temperatureNode.reportedAt}
          setID={set._id}
          userID={user._id}
        />
        <Co2
          nodeID={"6234b61cd68c97000897fca9"}
          currentValue={co2Node.co2}
          reportedAt={co2Node.reportedAt}
          setID={set._id}
          userID={user._id}
        />
      </div>

      <div className="w-full h-full justify-center">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ChartWrapper accessToken={session.accessToken!} />
        </HydrationBoundary>
      </div>
    </div>
  );
};
