import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { SitePreferencesProvider } from "@/components/site-preferences";
import { Navbar } from "@/components/navbar";
import { MinimalFooter } from "@/components/minimal-footer";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0E",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "ITU MATRIX | Metallurgy & Materials Science",
  description:
    "Student-led metallurgy and materials science team at Istanbul Technical University advancing alloy design, composite matrices, powder metallurgy, and phase characterization.",
  keywords: [
    "ITU Matrix",
    "Metallurgy",
    "Materials Science",
    "Istanbul Technical University",
    "Alloy Design",
    "Composite Matrices",
    "Powder Metallurgy",
  ],
  authors: [{ name: "ITU Matrix" }],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ITU MATRIX | Metallurgy & Materials Science",
    description:
      "Student-led metallurgy and materials science team at Istanbul Technical University advancing alloy design, composite matrices, and phase characterization.",
    type: "website",
    locale: "en_US",
    siteName: "ITU MATRIX",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "ITU MATRIX — Metallurgy and Materials Science",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ITU MATRIX | Metallurgy & Materials Science",
    description:
      "Metallurgy and materials science at Istanbul Technical University.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth overflow-x-hidden">
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} min-h-screen bg-canvas text-zinc-100 antialiased overflow-x-clip selection:bg-accent-cyan selection:text-black`}
      >
        <div className="flex min-h-screen flex-col w-full overflow-x-clip">
          <SitePreferencesProvider>
            <MotionProvider>
              <Navbar />
              <main className="flex-1 w-full flex flex-col">
                {children}
              </main>
              <MinimalFooter />
            </MotionProvider>
          </SitePreferencesProvider>
        </div>
      </body>
    </html>
  );
}
