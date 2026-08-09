import { isXiorError } from "xior"

import { sessionClient } from "@/core/api-client"
import type { AuthUser } from "@/features/auth/api"

export async function createSession(email: string, password: string): Promise<void> {
  await sessionClient.post("/api/session", { email, password })
}

export async function fetchSessionUser(): Promise<AuthUser | null> {
  try {
    const { data } = await sessionClient.get<AuthUser>("/api/session", { cache: "no-store" })
    return data
  } catch (error) {
    if (isXiorError(error) && error.response?.status === 401) return null
    throw error
  }
}

export async function logoutSession(): Promise<void> {
  await sessionClient.delete("/api/session")
}
