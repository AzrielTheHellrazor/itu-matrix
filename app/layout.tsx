import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0E",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://itumatrix.com"
  ),
  title: "ITU MATRIX | Autonomous Planetary Rover Team",
  description:
    "Official showcase of ITU Matrix Rover Team. Engineering autonomous planetary exploration rovers, competing at URC and ERC.",
  keywords: [
    "ITU Matrix",
    "Rover Team",
    "URC",
    "ERC",
    "Robotics",
    "Autonomous Rover",
    "Space Exploration",
  ],
  authors: [{ name: "ITU Matrix Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ITU MATRIX | Autonomous Planetary Rover Team",
    description:
      "Official showcase of ITU Matrix Rover Team. Engineering autonomous planetary exploration rovers, competing at URC and ERC.",
    type: "website",
    locale: "en_US",
    siteName: "ITU MATRIX",
  },
  twitter: {
    card: "summary_large_image",
    title: "ITU MATRIX | Autonomous Planetary Rover Team",
    description:
      "Autonomous planetary exploration rovers engineered at Istanbul Technical University (ITU).",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth overflow-x-hidden">
      <body className="min-h-screen bg-canvas text-white antialiased overflow-x-clip selection:bg-accent-yellow selection:text-black">
        <div className="flex min-h-screen flex-col max-w-7xl mx-auto overflow-x-clip">
          {children}
        </div>
      </body>
    </html>
  );
}
