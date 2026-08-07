import en from "./en"
import vi from "./vi"

export const locales = { en, vi } as const

export type Locale = keyof typeof locales
export type Messages = typeof en

export const localeNames: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
}

export const defaultLocale: Locale = "vi"
