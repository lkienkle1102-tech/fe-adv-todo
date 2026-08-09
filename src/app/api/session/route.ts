import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { BACKEND_URL } from "@/core/backend-url"
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/features/auth/session"

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})
const tokenSchema = z.object({ access_token: z.string().min(1) })

function isSecureRequest(request: NextRequest): boolean {
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim()
  return forwardedProtocol === "https" || request.nextUrl.protocol === "https:"
}

export async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Invalid session payload." },
      { status: 400 }
    )
  }

  const form = new URLSearchParams({
    username: parsed.data.email,
    password: parsed.data.password,
  })
  let backendResponse: Response

  try {
    backendResponse = await fetch(`${BACKEND_URL}/auth/jwt/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Language": request.headers.get("accept-language") ?? "vi",
      },
      body: form,
      cache: "no-store",
    })
  } catch {
    return NextResponse.json(
      { code: "AUTH_SERVICE_UNAVAILABLE", message: "Authentication service unavailable." },
      { status: 502 }
    )
  }

  if (!backendResponse.ok) {
    const contentType = backendResponse.headers.get("content-type")
    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: contentType ? { "Content-Type": contentType } : undefined,
    })
  }

  const token = tokenSchema.safeParse(await backendResponse.json().catch(() => null))
  if (!token.success) {
    return NextResponse.json(
      { code: "INVALID_AUTH_RESPONSE", message: "Authentication service returned an invalid response." },
      { status: 502 }
    )
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(SESSION_COOKIE_NAME, token.data.access_token, {
    httpOnly: true,
    secure: isSecureRequest(request),
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

  const response = await fetch(`${BACKEND_URL}/auth/users/me`, {
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
      await fetch(`${BACKEND_URL}/auth/jwt/logout`, {
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
