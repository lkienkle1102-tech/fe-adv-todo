import "server-only"

import { cookies } from "next/headers"

import type { AuthUser } from "@/features/auth/api"
import { SESSION_COOKIE_NAME } from "@/features/auth/session"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export async function getServerSessionUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  try {
    const response = await fetch(`${API_URL}/auth/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!response.ok) return null
    return response.json() as Promise<AuthUser>
  } catch {
    return null
  }
}
