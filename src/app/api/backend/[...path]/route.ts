import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { backendClient } from "@/core/backend-client"
import { SESSION_COOKIE_NAME } from "@/features/auth/session"

const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"])

type RouteContext = { params: Promise<{ path: string[] }> }

async function getRequestData(request: NextRequest): Promise<unknown> {
  if (METHODS_WITHOUT_BODY.has(request.method) || !request.body) return undefined

  const contentType = request.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    return request.json()
  }
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return new URLSearchParams(await request.text())
  }
  if (contentType.includes("multipart/form-data")) {
    return request.formData()
  }

  const body = await request.arrayBuffer()
  return body.byteLength > 0 ? body : undefined
}

async function forwardRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  const headers = new Headers()
  const contentType = request.headers.get("content-type")
  const acceptLanguage = request.headers.get("accept-language")
  if (contentType) headers.set("Content-Type", contentType)
  if (acceptLanguage) headers.set("Accept-Language", acceptLanguage)
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (contentType?.includes("multipart/form-data")) headers.delete("Content-Type")

  const backendResponse = await backendClient.request<ArrayBuffer>({
    url: `/${path.join("/")}${request.nextUrl.search}`,
    method: request.method,
    headers: Object.fromEntries(headers),
    data: await getRequestData(request),
    responseType: "arraybuffer",
    cache: "no-store",
  })

  const responseHeaders = new Headers()
  const responseContentType = backendResponse.headers.get("content-type")
  if (responseContentType) responseHeaders.set("Content-Type", responseContentType)
  const response = new NextResponse(backendResponse.data, {
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
