"use client"

import { useEffect, type ReactNode } from "react"

import type { AuthUser } from "@/features/auth/api"
import { AUTH_UNAUTHORIZED_EVENT } from "@/features/auth/session-events"
import { useAuthStore } from "@/features/auth/store"
import { useRouter } from "@/i18n/navigation"

export function AuthSessionGuard({
  children,
  user,
}: {
  children: ReactNode
  user: AuthUser
}) {
  const router = useRouter()

  useEffect(() => {
    useAuthStore.getState().setAuth(user)

    const handleUnauthorized = () => {
      useAuthStore.getState().clearAuth()
      router.replace("/login")
    }
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [router, user])

  return children
}
