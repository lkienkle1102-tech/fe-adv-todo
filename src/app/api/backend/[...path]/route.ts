import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { SESSION_COOKIE_NAME } from "@/features/auth/session"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"])

type RouteContext = { params: Promise<{ path: string[] }> }

async function forwardRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  const headers = new Headers()
  const contentType = request.headers.get("content-type")
  const acceptLanguage = request.headers.get("accept-language")
  if (contentType) headers.set("Content-Type", contentType)
  if (acceptLanguage) headers.set("Accept-Language", acceptLanguage)
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const backendResponse = await fetch(
    `${API_URL}/${path.join("/")}${request.nextUrl.search}`,
    {
      method: request.method,
      headers,
      body: METHODS_WITHOUT_BODY.has(request.method)
        ? undefined
        : await request.arrayBuffer(),
      cache: "no-store",
    }
  )

  const responseHeaders = new Headers()
  const responseContentType = backendResponse.headers.get("content-type")
  if (responseContentType) responseHeaders.set("Content-Type", responseContentType)
  const response = new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  })
  if (backendResponse.status === 401) response.cookies.delete(SESSION_COOKIE_NAME)
  return response
}

export const GET = forwardRequest
export const POST = forwardRequest
export const PUT = forwardRequest
export const PATCH = forwardRequest
export const DELETE = forwardRequest
