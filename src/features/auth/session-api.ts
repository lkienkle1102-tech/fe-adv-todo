import xior from "xior"

import type { AuthUser } from "@/features/auth/api"
import { useLocaleStore } from "@/features/i18n/store"

export async function createSession(email: string, password: string): Promise<void> {
  await xior.post(
    "/api/session",
    { email, password },
    { headers: { "Accept-Language": useLocaleStore.getState().locale } }
  )
}

export async function fetchSessionUser(): Promise<AuthUser | null> {
  const response = await fetch("/api/session", { cache: "no-store" })
  if (response.status === 401) return null
  if (!response.ok) throw new Error("Unable to load session")
  return response.json() as Promise<AuthUser>
}

export async function logoutSession(): Promise<void> {
  const response = await fetch("/api/session", { method: "DELETE" })
  if (!response.ok) throw new Error("Unable to log out")
}
