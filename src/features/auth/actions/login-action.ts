"use client"

import { fetchCurrentUser, login } from "@/features/auth/api"
import { getAuthErrorMessage } from "@/features/auth/error"
import { loginSchema } from "@/features/auth/schema"
import { useAuthStore } from "@/features/auth/store"

export type FormState = { error: string | null }

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  try {
    const { access_token } = await login(parsed.data.email, parsed.data.password)
    useAuthStore.setState({ accessToken: access_token })
    const user = await fetchCurrentUser()
    useAuthStore.getState().setAuth(user, access_token)
    return { error: null }
  } catch (err) {
    useAuthStore.setState({ accessToken: null })
    return { error: getAuthErrorMessage(err) }
  }
}
