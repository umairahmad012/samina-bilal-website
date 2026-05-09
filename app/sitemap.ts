import type { MetadataRoute } from "next";
import { communities } from "@/lib/communities";

const SITE = "https://saminarealtor.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/buyers",
    "/sellers",
    "/path-to-ownership",
    "/communities",
    "/closings",
    "/partners",
    "/reviews",
    "/contact",
    "/privacy",
  ];

  const now = new Date();

  return [
    ...pages.map((path) => ({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1.0 : 0.8,
    })),
    ...communities.map((c) => ({
      url: `${SITE}/communities/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
