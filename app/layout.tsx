import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0E",
};

export const metadata: Metadata = {
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-canvas text-white antialiased overflow-x-hidden selection:bg-accent-yellow selection:text-black">
        <div className="flex min-h-screen flex-col max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
