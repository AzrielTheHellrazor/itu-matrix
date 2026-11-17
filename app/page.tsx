import { Hero } from "@/components/hero";
import { MaterialsShowcase } from "@/components/materials-showcase";
import { SubteamsGrid } from "@/components/subteams-grid";
import { AchievementsSection } from "@/components/achievements-section";

export default function Home() {
  return (
    <>
      <Hero />
      <MaterialsShowcase />
      <SubteamsGrid />
      <AchievementsSection />
    </>
  );
}
