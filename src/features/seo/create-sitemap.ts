import type { MetadataRoute } from "next"

import { locales, type Locale } from "@/i18n/locales"
import {
  getDefaultLocalizedUrl,
  getLocalizedUrl,
} from "@/features/seo/site-config"

type SitemapPage = {
  path: string
  lastModified?: string | Date
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority?: number
}

export function createLocalizedSitemap(
  pages: SitemapPage[]
): MetadataRoute.Sitemap {
  const supportedLocales = Object.keys(locales) as Locale[]

  return pages.flatMap((page) =>
    supportedLocales.map((locale) => ({
      url: getLocalizedUrl(locale, page.path).href,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            supportedLocales.map((supportedLocale) => [
              supportedLocale,
              getLocalizedUrl(supportedLocale, page.path).href,
            ])
          ),
          "x-default": getDefaultLocalizedUrl(page.path).href,
        },
      },
    }))
  )
}
