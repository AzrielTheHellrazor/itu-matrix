"use client";

import React from "react";
import Link from "next/link";
import { Github, Instagram, Linkedin, Twitter, Youtube, ExternalLink } from "lucide-react";

export const SPONSORS = [
  { name: "AXA Sigorta", tier: "Platinum Partner", url: "https://www.axasigorta.com.tr" },
  { name: "Autodesk", tier: "Platinum Partner", url: "https://www.autodesk.com" },
  { name: "Altium", tier: "Gold Partner", url: "https://www.altium.com" },
  { name: "PCBWay", tier: "Gold Partner", url: "https://www.pcbway.com" },
  { name: "SolidWorks", tier: "Silver Partner", url: "https://www.solidworks.com" },
  { name: "Ansys", tier: "Silver Partner", url: "https://www.ansys.com" },
];

export const SOCIAL_LINKS = [
  { name: "GitHub", url: "https://github.com/itu-rover", icon: Github },
  { name: "Instagram", url: "https://www.instagram.com/itu.roverteam/", icon: Instagram },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/ituroverteam", icon: Linkedin },
  { name: "Twitter", url: "https://twitter.com/ituroverteam", icon: Twitter },
  { name: "YouTube", url: "https://www.youtube.com/@ITURoverTeam", icon: Youtube },
];

export function SponsorsFooter() {
  return (
    <footer id="sponsors" className="w-full pt-16 pb-12 border-t border-white/10 mt-20">
      {/* Sponsors Wall Section */}
      <div data-testid="sponsors-wall" className="mb-16">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-3xl font-bold font-mono text-white mb-2">
            Corporate Sponsors & Strategic Partners
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            Powering advanced robotics research and international championship campaigns.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {SPONSORS.map((sp) => (
            <a
              key={sp.name}
              href={sp.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="sponsor-card"
              className="p-4 rounded-xl bg-surface border border-white/10 hover:border-accent-yellow/40 flex flex-col items-center justify-center text-center transition-all group"
            >
              <span className="font-bold font-mono text-sm text-white group-hover:text-accent-yellow transition-colors">
                {sp.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 mt-1">{sp.tier}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Institutional Banner */}
      <div
        data-testid="footer-itu-banner"
        className="p-6 rounded-2xl bg-surface/50 border border-white/5 mb-12 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4"
      >
        <div>
          <h4 className="font-bold font-mono text-white text-sm sm:text-base">
            İstanbul Teknik Üniversitesi (İTÜ) &mdash; Faculty of Mechanical Engineering
          </h4>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Ayazağa Campus, 34469 Maslak, Istanbul, Turkey &bull; Founded 1773
          </p>
        </div>
        <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
          ITU Rover Team &bull; Est. Nov 2016
        </div>
      </div>

      {/* Footer Bottom Links & Socials */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5 text-xs font-mono text-zinc-500">
        <div>
          &copy; 2026 ITU Matrix Rover Team. All rights reserved.
        </div>

        <div data-testid="footer-social-links" className="flex items-center space-x-4">
          {SOCIAL_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="p-2 rounded-lg bg-surface border border-white/10 hover:border-accent-yellow hover:text-accent-yellow text-zinc-400 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
