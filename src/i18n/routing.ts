import { defineRouting } from "next-intl/routing"

import { defaultLocale, locales as messages, type Locale } from "@/i18n/locales"

const availableLocales = Object.keys(messages) as [Locale, ...Locale[]]

export const routing = defineRouting({
  locales: availableLocales,
  defaultLocale,
  localePrefix: "always",
})
