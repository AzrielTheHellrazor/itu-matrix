import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://itumatrix.com";
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-11-17T00:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
