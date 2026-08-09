import "server-only"

import { cookies } from "next/headers"

import { backendClient } from "@/core/backend-client"
import type { AuthUser } from "@/features/auth/api"
import { SESSION_COOKIE_NAME } from "@/features/auth/session"

export async function getServerSessionUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  try {
    const response = await backendClient.get<AuthUser>("/auth/users/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (response.status < 200 || response.status >= 300) return null
    return response.data
  } catch {
    return null
  }
}
