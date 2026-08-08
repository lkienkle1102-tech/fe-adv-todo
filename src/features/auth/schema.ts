import { z } from "zod"

const CONTROL_CHARACTERS = /[\p{Cc}\p{Cs}]/u

export const usernameSchema = z
  .string()
  .transform((value) => value.normalize("NFC").trim())
  .superRefine((value, context) => {
    const length = Array.from(value).length

    if (length === 0) {
      context.addIssue({ code: "custom", message: "USERNAME_REQUIRED" })
    } else if (length < 3) {
      context.addIssue({ code: "custom", message: "USERNAME_TOO_SHORT" })
    } else if (length > 50) {
      context.addIssue({ code: "custom", message: "USERNAME_TOO_LONG" })
    }

    if (CONTROL_CHARACTERS.test(value)) {
      context.addIssue({ code: "custom", message: "USERNAME_INVALID" })
    }
  })

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const registerSchema = z.object({
  username: usernameSchema,
  email: z.string().email(),
  password: z.string().min(8),
})
