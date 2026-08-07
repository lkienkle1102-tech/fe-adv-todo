import { create } from "zustand"

import { defaultLocale, type Locale } from "@/i18n/locales"

type LocaleState = {
  locale: Locale
}

export const useLocaleStore = create<LocaleState>(() => ({
  locale: defaultLocale,
}))
