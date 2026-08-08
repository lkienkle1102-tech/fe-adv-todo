"use client"

import { register } from "@/features/auth/api"
import { parseAuthError, type AuthFormState } from "@/features/auth/error"
import { registerSchema } from "@/features/auth/schema"

export type FormState = AuthFormState

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    const field = parsed.error.issues[0].path[0]
    return {
      error: {
        code: field === "email" ? "INVALID_EMAIL" : "PASSWORD_TOO_SHORT",
        backendMessage: null,
      },
    }
  }
  try {
    await register(parsed.data.email, parsed.data.password)
    return { error: null }
  } catch (err) {
    return { error: parseAuthError(err) }
  }
}
