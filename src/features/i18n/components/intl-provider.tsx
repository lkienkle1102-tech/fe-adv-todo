"use client"

import { NextIntlClientProvider } from "next-intl"
import type { ReactNode } from "react"

import type { Messages } from "@/i18n/locales"

export function IntlProvider({
  children,
  locale,
  messages,
}: {
  children: ReactNode
  locale: string
  messages: Messages
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
