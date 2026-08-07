"use client"

import { register } from "@/features/auth/api"
import { getAuthErrorMessage } from "@/features/auth/error"
import { registerSchema } from "@/features/auth/schema"

export type FormState = { error: string | null }

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  try {
    await register(parsed.data.email, parsed.data.password)
    return { error: null }
  } catch (err) {
    return { error: getAuthErrorMessage(err) }
  }
}
