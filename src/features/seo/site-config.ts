import { defaultLocale, type Locale } from "@/i18n/locales"

export const SITE_NAME = "Advanced Todo"

const FALLBACK_SITE_URL = "http://localhost:3000"

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (!configuredUrl) return new URL(FALLBACK_SITE_URL)

  try {
    const url = new URL(configuredUrl)
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return new URL(FALLBACK_SITE_URL)
    }
    return new URL(url.origin)
  } catch {
    return new URL(FALLBACK_SITE_URL)
  }
}

export function getLocalizedPath(locale: Locale, path = "/"): string {
  const normalizedPath = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`
  return `/${locale}${normalizedPath}`
}

export function getLocalizedUrl(locale: Locale, path = "/"): URL {
  return new URL(getLocalizedPath(locale, path), getSiteUrl())
}

export function getDefaultLocalizedUrl(path = "/"): URL {
  return getLocalizedUrl(defaultLocale, path)
}
