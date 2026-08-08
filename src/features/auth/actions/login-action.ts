"use client"

import { fetchCurrentUser, login } from "@/features/auth/api"
import { parseAuthError, type AuthFormState } from "@/features/auth/error"
import { loginSchema } from "@/features/auth/schema"
import { createSession } from "@/features/auth/session-api"
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
    useAuthStore.setState({ accessToken: access_token })
    const user = await fetchCurrentUser()
    await createSession(access_token)
    useAuthStore.getState().setAuth(user, access_token)
    return { error: null }
  } catch (err) {
    useAuthStore.setState({ accessToken: null })
    return { error: parseAuthError(err) }
  }
}
