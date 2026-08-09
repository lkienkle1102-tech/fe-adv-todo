import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/features/seo/site-config"

type RobotsConfigOptions = {
  disallow?: string[]
  sitemapPaths?: string[]
}

export function createRobotsConfig({
  disallow = [],
  sitemapPaths = ["/sitemap.xml"],
}: RobotsConfigOptions = {}): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      ...(disallow.length > 0 ? { disallow } : {}),
    },
    sitemap: sitemapPaths.map((path) => new URL(path, siteUrl).href),
    host: siteUrl.origin,
  }
}
