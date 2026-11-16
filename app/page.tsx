import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-white">
      {/* Sticky Navigation Header */}
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Milestone M2: Hero Showcase Section */}
        <Hero />

        {/* Anchor Placeholder: Milestone M3 3D Rover Studio */}
        <section
          id="rover-3d"
          className="min-h-[400px] border-t border-white/10 bg-surface/30 flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-2 block">
              {"// Milestone M3 Studio"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white mb-2">
              3D Interactive Rover Studio
            </h2>
            <p className="text-zinc-400 text-sm font-sans">
              Three.js procedural articulated rover model with 5 subsystem hotspots and OrbitControls.
            </p>
          </div>
        </section>

        {/* Anchor Placeholder: Milestone M4 Subteams Bento Grid */}
        <section
          id="subteams"
          className="min-h-[300px] border-t border-white/10 bg-canvas flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-accent-yellow tracking-widest uppercase mb-2 block">
              {"// Milestone M4 Bento"}
            </span>
            <h2 className="text-2xl font-bold font-mono text-white mb-2">
              Engineering Subteams & Innovation
            </h2>
            <p className="text-zinc-400 text-sm">
              Mechanical, Electronics, Autonomous Software, Science, and PR operations.
            </p>
          </div>
        </section>

        {/* Anchor Placeholder: Milestone M4 Matrix Telemetry Console */}
        <section
          id="telemetry"
          className="min-h-[300px] border-t border-white/10 bg-surface/20 flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-emerald-400 tracking-widest uppercase mb-2 block">
              {"// Milestone M4 Terminal"}
            </span>
            <h2 className="text-2xl font-bold font-mono text-white mb-2">
              Matrix Telemetry Console
            </h2>
            <p className="text-zinc-400 text-sm">
              Interactive monospace CLI with live telemetry streams and subsystem diagnostics.
            </p>
          </div>
        </section>

        {/* Anchor Placeholder: Milestone M4 Competitions Roadmap */}
        <section
          id="competitions"
          className="min-h-[300px] border-t border-white/10 bg-canvas flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-accent-purple tracking-widest uppercase mb-2 block">
              {"// Milestone M4 Awards"}
            </span>
            <h2 className="text-2xl font-bold font-mono text-white mb-2">
              Competitions & Heritage Roadmap
            </h2>
            <p className="text-zinc-400 text-sm">
              URC World 3rd, ERC Silver, and Best Science System awards timeline.
            </p>
          </div>
        </section>

        {/* Anchor Placeholder: Milestone M4 Sponsors Wall & Footer */}
        <section
          id="sponsors"
          className="min-h-[250px] border-t border-white/10 bg-surface/40 flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-accent-pink tracking-widest uppercase mb-2 block">
              {"// Milestone M4 Partners"}
            </span>
            <h2 className="text-2xl font-bold font-mono text-white mb-2">
              Partners & Institutional Affiliations
            </h2>
            <p className="text-zinc-400 text-sm">
              Istanbul Technical University (İTÜ) • Faculty of Mechanical Engineering.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
