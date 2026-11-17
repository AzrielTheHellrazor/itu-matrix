import { Hero } from "@/components/hero";
import { RoverStudio } from "@/components/rover-studio";
import { PyCharmWindow } from "@/components/pycharm-window";
import { TelemetryConsole } from "@/components/telemetry-console";
import { SubteamsBento } from "@/components/subteams-bento";
import { AchievementsTimeline } from "@/components/achievements-timeline";

export default function Home() {
  return (
    <>
      <Hero />
      <RoverStudio />
      <PyCharmWindow />
      <TelemetryConsole />
      <SubteamsBento />
      <AchievementsTimeline />
    </>
  );
}
