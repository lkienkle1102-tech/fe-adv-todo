import { z } from "zod"

import { usernameSchema } from "@/features/auth/schema"

export const profileDetailsSchema = z.object({
  username: usernameSchema,
  email: z.string().trim().email("INVALID_EMAIL"),
})

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "CURRENT_PASSWORD_REQUIRED"),
    password: z.string().min(8, "PASSWORD_TOO_SHORT"),
    confirmation: z.string(),
  })
  .refine(({ password, confirmation }) => password === confirmation, {
    message: "PASSWORD_MISMATCH",
    path: ["confirmation"],
  })
