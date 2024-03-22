import { SessionData } from "@/lib/session";
import { getNodeStats } from "@/actions";

export const Tenant = async ({ session }: { session: SessionData }) => {
  // DESSA TRE FÖRSTA VARIABLERNA BEHÖVES INTE, METHODEN FUNGERAR UTAN DEM OCH GER DÅ TILLBAKA ALL DATA
  // tiden just nu:
  const currentTimestamp = Date.now();
  // 7 dagar tillbaka:
  const sevenDaysAgo = currentTimestamp - 7 * 24 * 60 * 60 * 1000;

  // vill du ha en specifik tid mellan datapunkterna?
  // 43200 sekunder = 12 timmar
  const distance = 43200;

  // hämtar data mellan nu och 7 dagar tillbaka
  const stats = await getNodeStats(
    session.accessToken!,
    "60a3ab8b007e8f00076009eb",
    "averageTemperature",
    sevenDaysAgo,
    currentTimestamp,
    distance,
  );

  console.log(" ");
  console.log("Stats from getStats: ", stats);

  return <div className="pt-8">a {session.role} has logged in</div>;
};
