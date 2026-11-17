"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface SponsorItem {
  name: string;
  tier: string;
  url: string;
  category: string;
}

const SPONSORS: SponsorItem[] = [
  {
    name: "AXA Sigorta",
    tier: "Diamond Sponsor",
    url: "https://www.axasigorta.com.tr",
    category: "Main Corporate Sponsor",
  },
  {
    name: "Türkiye'nin Makinecileri",
    tier: "Platinum Sponsor",
    url: "https://www.makineciler.org",
    category: "Machinery Exporters",
  },
  {
    name: "Metyx Composites",
    tier: "Platinum Sponsor",
    url: "https://www.metyx.com",
    category: "Composite Materials",
  },
  {
    name: "Autodesk",
    tier: "Software Partner",
    url: "https://www.autodesk.com",
    category: "CAD & Simulation",
  },
  {
    name: "Altium",
    tier: "Software Partner",
    url: "https://www.altium.com",
    category: "ECAD PCB Design",
  },
  {
    name: "PCBWay",
    tier: "Manufacturing Partner",
    url: "https://www.pcbway.com",
    category: "Rapid PCB Fabrication",
  },
  {
    name: "Dassault Systèmes",
    tier: "Software Partner",
    url: "https://www.3ds.com",
    category: "3DEXPERIENCE CAD",
  },
  {
    name: "Altınay Grubu",
    tier: "Manufacturing Partner",
    url: "https://www.altinay.com",
    category: "Industrial Robotics",
  },
  {
    name: "Radore Hosting",
    tier: "Software Partner",
    url: "https://radore.com",
    category: "Cloud Infrastructure",
  },
  {
    name: "Egebant",
    tier: "Manufacturing Partner",
    url: "https://www.egebant.com.tr",
    category: "Industrial Abrasives",
  },
  {
    name: "Marmatek",
    tier: "Manufacturing Partner",
    url: "https://www.marmatek.com",
    category: "Precision Machining",
  },
];

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.54-.01 2.78-.01 3.16 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3v6Z" />
    </svg>
  );
}

export function SponsorsFooter() {
  return (
    <footer
      id="sponsors"
      className="bg-canvas border-t border-white/10 pt-20 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sponsors Wall */}
        <div data-testid="sponsors-wall" className="mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-accent-pink" />
            <span className="font-mono text-xs text-accent-yellow tracking-widest uppercase">
              {"// CORPORATE PATRONS & PARTNERS"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight mb-2">
            Sponsors &amp; Strategic Partners
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl mb-8 leading-relaxed">
            Our international expeditions to MDRS Utah and ERC Poland are made possible by industry leaders in robotics, composites, and engineering software.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SPONSORS.map((sp, idx) => (
              <a
                key={idx}
                href={sp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-white/10 bg-surface p-4 flex flex-col justify-between hover:border-accent-yellow/40 hover:bg-white/5 transition-all duration-300"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-white group-hover:text-accent-yellow transition-colors block">
                    {sp.name}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase block mt-1">
                    {sp.tier}
                  </span>
                </div>
                <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="truncate">{sp.category}</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ITU Institutional Governance Banner */}
        <div
          data-testid="footer-itu-banner"
          className="rounded-xl border border-white/10 bg-surface/60 p-6 sm:p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="h-8 w-8 rounded border border-white/20 bg-surface flex items-center justify-center font-mono font-black text-accent-yellow text-xs">
                  İTÜ
                </div>
                <span className="font-mono text-base font-bold text-white tracking-wide">
                  İstanbul Teknik Üniversitesi (İTÜ)
                </span>
                <span className="font-mono text-xs text-accent-yellow bg-accent-yellow/10 px-2 py-0.5 rounded border border-accent-yellow/20">
                  Est. 1773
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Ayazağa Campus, Maslak, Sarıyer, Istanbul, Turkey • Faculty of Mechanical Engineering / Makina Fakültesi
              </p>
              <p className="font-mono text-xs text-zinc-300">
                Takım Danışmanı / Faculty Advisor:{" "}
                <strong className="text-white">
                  Dr. Öğr. Üyesi Özlem Emanet
                </strong>{" "}
                (Department of Mechanical Engineering / Makina Fakültesi)
              </p>
            </div>

            {/* Carl Sagan Motto Reprise */}
            <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 max-w-md">
              <blockquote className="font-mono text-xs italic text-zinc-300">
                &ldquo;Somewhere, something incredible is waiting to be known.&rdquo;
              </blockquote>
              <cite className="block font-mono text-[11px] text-accent-yellow mt-1 not-italic">
                — Carl Sagan
              </cite>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div
            data-testid="footer-social-links"
            className="flex items-center gap-3"
          >
            <a
              href="https://github.com/itu-rover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-white/5"
              aria-label="ITU Rover GitHub"
            >
              <GithubIcon />
            </a>
            <a
              href="https://www.instagram.com/itu.roverteam/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-white/5"
              aria-label="ITU Rover Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.linkedin.com/company/ituroverteam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-white/5"
              aria-label="ITU Rover LinkedIn"
            >
              <LinkedinIcon />
            </a>
            <a
              href="https://twitter.com/ituroverteam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-white/5"
              aria-label="ITU Rover Twitter"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://www.youtube.com/@ITURoverTeam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-white/5"
              aria-label="ITU Rover YouTube"
            >
              <YoutubeIcon />
            </a>
          </div>

          <div className="font-mono text-xs text-zinc-500 text-center sm:text-right">
            © 2026 ITU Matrix Autonomous Rover Team. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
