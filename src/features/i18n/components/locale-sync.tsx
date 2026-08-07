"use client"

import { useEffect } from "react"

import { useLocaleStore } from "@/features/i18n/store"
import type { Locale } from "@/i18n/locales"

export function LocaleSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    useLocaleStore.setState({ locale })
  }, [locale])
  return null
}
