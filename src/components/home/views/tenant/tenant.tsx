import { SessionData } from "@/lib/session";
import {
  getBasicCredentialSet,
  getList,
  getNodeStats,
  getUser,
} from "@/actions";
import mqtt from "mqtt";
import { Temperature } from "./temperature";
import { Co2 } from "./co2";

export const Tenant = async ({
  session,
  nodes,
}: {
  session: SessionData;
  nodes: any[];
}) => {
  const user = await getUser(session!);
  const set = await getBasicCredentialSet(user._id, session.accessToken!);

  //console.log(set);

  const temperatureNode = nodes.find((node) => node.name.includes("Comfort"));

  const co2Node = nodes.find((node) => node.name.includes("CO2"));

  return (
    <>
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
      <div className="pt-8">a {session.role} has logged in</div>
    </>
  );
};

// const currentTimestamp = Date.now();
// // 7 dagar tillbaka:
// const sevenDaysAgo = currentTimestamp - 7 * 24 * 60 * 60 * 1000;

// // vill du ha en specifik tid mellan datapunkterna?
// // 43200 sekunder = 12 timmar
// const distance = 43200;

// // hämtar data mellan nu och 7 dagar tillbaka
// const stats = await getNodeStats(
//   session.accessToken!,
//   "60a3ab8b007e8f00076009eb",
//   "averageTemperature",
//   sevenDaysAgo,
//   currentTimestamp,
//   distance,
// );

// console.log(" ");
// // console.log("Stats from getStats: ", stats);
