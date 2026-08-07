"use client"

import NextLink from "next/link"
import { useParams, useRouter as useNextRouter } from "next/navigation"
import type { ComponentProps } from "react"

import type { Locale } from "@/i18n/locales"

function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//")
}

function withLocale(href: string, locale: Locale | undefined): string {
  if (!locale || !isInternalPath(href)) return href
  return `/${locale}${href}`
}

export function useRouter() {
  const router = useNextRouter()
  const { locale } = useParams<{ locale?: Locale }>()

  return {
    ...router,
    push: (href: string, options?: Parameters<typeof router.push>[1]) =>
      router.push(withLocale(href, locale), options),
    replace: (href: string, options?: Parameters<typeof router.replace>[1]) =>
      router.replace(withLocale(href, locale), options),
  }
}

export function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { locale } = useParams<{ locale?: Locale }>()
  const resolvedHref = typeof href === "string" ? withLocale(href, locale) : href
  return <NextLink href={resolvedHref} {...props} />
}
