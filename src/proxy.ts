import { NextRequest, NextResponse } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

import { locales as localeMap, defaultLocale } from "@/i18n/locales"
import { SESSION_COOKIE_NAME } from "@/features/auth/session"

const locales = Object.keys(localeMap)

function getLocale(request: NextRequest): string {
  const headers = { "accept-language": request.headers.get("accept-language") ?? "" }
  const languages = new Negotiator({ headers }).languages()
  return match(languages, locales, defaultLocale)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value)

  if (pathnameLocale) {
    if (hasSession && pathname === `/${pathnameLocale}`) {
      return NextResponse.redirect(new URL(`/${pathnameLocale}/tasks`, request.url))
    }
    return
  }

  const locale = getLocale(request)
  request.nextUrl.pathname = hasSession && pathname === "/" ? `/${locale}/tasks` : `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}
