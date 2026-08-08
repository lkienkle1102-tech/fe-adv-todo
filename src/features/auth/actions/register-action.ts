"use client"

import { register } from "@/features/auth/api"
import { parseAuthError, type AuthFormState } from "@/features/auth/error"
import { registerSchema } from "@/features/auth/schema"

export type FormState = AuthFormState

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const field = issue.path[0]
    const usernameCodes = new Set([
      "USERNAME_REQUIRED",
      "USERNAME_TOO_SHORT",
      "USERNAME_TOO_LONG",
      "USERNAME_INVALID",
    ])
    const code =
      field === "username"
        ? usernameCodes.has(issue.message)
          ? issue.message
          : "USERNAME_REQUIRED"
        : field === "email"
          ? "INVALID_EMAIL"
          : "PASSWORD_TOO_SHORT"
    return {
      error: {
        code,
        backendMessage: null,
      },
    }
  }
  try {
    await register(parsed.data.username, parsed.data.email, parsed.data.password)
    return { error: null }
  } catch (err) {
    return { error: parseAuthError(err) }
  }
}
