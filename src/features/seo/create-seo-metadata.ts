import type { Metadata } from "next"

import { defaultLocale, locales, type Locale } from "@/i18n/locales"
import {
  getLocalizedPath,
  getSiteUrl,
  SITE_NAME,
} from "@/features/seo/site-config"

type SeoMetadataInput = {
  locale: Locale
  title: string
  description: string
  path?: string
}

const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: "en_US",
  vi: "vi_VN",
}

export function createSeoMetadata({
  locale,
  title,
  description,
  path = "/",
}: SeoMetadataInput): Metadata {
  const localizedPath = getLocalizedPath(locale, path)
  const languageAlternates = Object.fromEntries(
    (Object.keys(locales) as Locale[]).map((supportedLocale) => [
      supportedLocale,
      getLocalizedPath(supportedLocale, path),
    ])
  )

  return {
    metadataBase: getSiteUrl(),
    title: { absolute: title },
    description,
    applicationName: SITE_NAME,
    alternates: {
      canonical: localizedPath,
      languages: {
        ...languageAlternates,
        "x-default": getLocalizedPath(defaultLocale, path),
      },
    },
    openGraph: {
      type: "website",
      url: localizedPath,
      title,
      description,
      siteName: SITE_NAME,
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: (Object.keys(OPEN_GRAPH_LOCALES) as Locale[])
        .filter((supportedLocale) => supportedLocale !== locale)
        .map((supportedLocale) => OPEN_GRAPH_LOCALES[supportedLocale]),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}
