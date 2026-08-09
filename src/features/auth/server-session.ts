import "server-only"

import { cookies } from "next/headers"

import { BACKEND_URL } from "@/core/backend-url"
import type { AuthUser } from "@/features/auth/api"
import { SESSION_COOKIE_NAME } from "@/features/auth/session"

export async function getServerSessionUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  try {
    const response = await fetch(`${BACKEND_URL}/auth/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!response.ok) return null
    return response.json() as Promise<AuthUser>
  } catch {
    return null
  }
}
