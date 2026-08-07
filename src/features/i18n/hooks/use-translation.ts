"use client"

import { useEffect } from "react"

import { locales } from "@/i18n/locales"
import { useLocaleStore } from "@/features/i18n/store"

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  function t(path: string): string {
    const value = getByPath(locales[locale], path)
    return typeof value === "string" ? value : path
  }

  return { t, locale, setLocale }
}
