import type { AuthUser } from "@/features/auth/api"

export async function createSession(accessToken: string): Promise<void> {
  const response = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  })

  if (!response.ok) throw new Error("Unable to create session")
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
