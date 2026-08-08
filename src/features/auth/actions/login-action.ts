"use client"

import { fetchCurrentUser, login } from "@/features/auth/api"
import { parseAuthError, type AuthFormState } from "@/features/auth/error"
import { loginSchema } from "@/features/auth/schema"
import { createSession, logoutSession } from "@/features/auth/session-api"
import { useAuthStore } from "@/features/auth/store"

export type FormState = AuthFormState

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    const field = parsed.error.issues[0].path[0]
    return {
      error: {
        code: field === "email" ? "INVALID_EMAIL" : "PASSWORD_REQUIRED",
        backendMessage: null,
      },
    }
  }
  try {
    const { access_token } = await login(parsed.data.email, parsed.data.password)
    await createSession(access_token)
    const user = await fetchCurrentUser()
    useAuthStore.getState().setAuth(user)
    return { error: null }
  } catch (err) {
    await logoutSession().catch(() => undefined)
    useAuthStore.getState().clearAuth()
    return { error: parseAuthError(err) }
  }
}
