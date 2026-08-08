import { NextRequest, NextResponse } from "next/server"

import { SESSION_COOKIE_NAME } from "@/features/auth/session"
import { getPathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value)

  if (!hasSession) return NextResponse.next()

  const homepageLocale = routing.locales.find((locale) => pathname === `/${locale}`)
  if (!homepageLocale) return NextResponse.next()

  return NextResponse.redirect(
    new URL(getPathname({ href: "/tasks", locale: homepageLocale }), request.url)
  )
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}
