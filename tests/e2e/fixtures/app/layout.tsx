import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ITU Matrix // Planetary Exploration Rover",
  description: "Autonomous Planetary Rover Showcase inspired by JetBrains PyCharm aesthetic.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-canvas text-white font-mono antialiased overflow-x-hidden min-h-screen selection:bg-accent-yellow selection:text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
