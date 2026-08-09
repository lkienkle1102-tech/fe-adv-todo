import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import type { XiorResponse } from "xior"
import { z } from "zod"

import { backendClient } from "@/core/backend-client"
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
  let backendResponse: XiorResponse<unknown>

  try {
    backendResponse = await backendClient.post<unknown>("/auth/jwt/login", form, {
      headers: { "Accept-Language": request.headers.get("accept-language") ?? "vi" },
      cache: "no-store",
    })
  } catch {
    return NextResponse.json(
      { code: "AUTH_SERVICE_UNAVAILABLE", message: "Authentication service unavailable." },
      { status: 502 }
    )
  }

  if (backendResponse.status < 200 || backendResponse.status >= 300) {
    return NextResponse.json(backendResponse.data, {
      status: backendResponse.status,
    })
  }

  const token = tokenSchema.safeParse(backendResponse.data)
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

  const backendResponse = await backendClient.get("/auth/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": request.headers.get("accept-language") ?? "vi",
    },
    cache: "no-store",
  })

  if (backendResponse.status < 200 || backendResponse.status >= 300) {
    const unauthorized = NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 })
    unauthorized.cookies.delete(SESSION_COOKIE_NAME)
    return unauthorized
  }

  return NextResponse.json(backendResponse.data)
}

export async function DELETE(request: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value

  if (token) {
    try {
      await backendClient.post("/auth/jwt/logout", undefined, {
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
