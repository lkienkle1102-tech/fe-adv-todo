import { NextRequest, NextResponse } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

import { locales as localeMap, defaultLocale } from "@/i18n/locales"

const locales = Object.keys(localeMap)

function getLocale(request: NextRequest): string {
  const headers = { "accept-language": request.headers.get("accept-language") ?? "" }
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (hasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
}
