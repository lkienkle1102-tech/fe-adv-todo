"use client"

import { useParams } from "next/navigation"

import { locales, type Locale } from "@/i18n/locales"

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

export function useTranslation() {
  const { locale } = useParams<{ locale: Locale }>()

  function t(path: string): string {
    const value = getByPath(locales[locale], path)
    return typeof value === "string" ? value : path
  }

  return { t, locale }
}
