import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/features/auth/session"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const sessionSchema = z.object({ accessToken: z.string().min(1) })

export async function POST(request: NextRequest) {
  const parsed = sessionSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Invalid session payload." },
      { status: 400 }
    )
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(SESSION_COOKIE_NAME, parsed.data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return response
}

export async function GET(request: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 })
  }

  const response = await fetch(`${API_URL}/auth/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": request.headers.get("accept-language") ?? "vi",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const unauthorized = NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 })
    unauthorized.cookies.delete(SESSION_COOKIE_NAME)
    return unauthorized
  }

  return NextResponse.json(await response.json())
}

export async function DELETE(request: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value

  if (token) {
    try {
      await fetch(`${API_URL}/auth/jwt/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": request.headers.get("accept-language") ?? "vi",
        },
        cache: "no-store",
      })
    } catch {
      // JWT logout is best-effort; the local session is always removed.
    }
  }

  const response = new NextResponse(null, { status: 204 })
  response.cookies.delete(SESSION_COOKIE_NAME)
  return response
}
