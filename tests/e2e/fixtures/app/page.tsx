import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { RoverStudio } from "@/components/rover-studio";
import { PyCharmWindow } from "@/components/pycharm-window";
import { TelemetryConsole } from "@/components/telemetry-console";
import { SubteamsBento } from "@/components/subteams-bento";
import { AchievementsTimeline } from "@/components/achievements-timeline";
import { SponsorsFooter } from "@/components/sponsors-footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full">
      <Navbar />
      <Hero />
      <RoverStudio />
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 my-16">
        <PyCharmWindow />
        <TelemetryConsole />
      </div>
      <SubteamsBento />
      <AchievementsTimeline />
      <SponsorsFooter />
    </main>
  );
}
