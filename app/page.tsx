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
    <div className="min-h-screen flex flex-col bg-canvas text-white">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Hero />
        <RoverStudio />
        <PyCharmWindow />
        <TelemetryConsole />
        <SubteamsBento />
        <AchievementsTimeline />
      </main>

      <SponsorsFooter />
    </div>
  );
}
