import { isXiorError } from "xior"

export type AuthError = {
  code: string
  backendMessage: string | null
}

export type AuthFormState = {
  error: AuthError | null
}

const FRONTEND_ERROR_CODES = new Set([
  "INVALID_EMAIL",
  "PASSWORD_REQUIRED",
  "PASSWORD_TOO_SHORT",
  "USERNAME_REQUIRED",
  "USERNAME_TOO_SHORT",
  "USERNAME_TOO_LONG",
  "USERNAME_INVALID",
  "LOGIN_BAD_CREDENTIALS",
  "LOGIN_USER_NOT_VERIFIED",
  "REGISTER_USER_ALREADY_EXISTS",
  "REGISTER_INVALID_PASSWORD",
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
])

export function parseAuthError(error: unknown): AuthError {
  if (isXiorError(error)) {
    const payload = error.response?.data
    if (payload && typeof payload === "object") {
      const code = typeof payload.code === "string" ? payload.code : "GENERIC"
      const backendMessage = typeof payload.message === "string" ? payload.message : null
      return { code, backendMessage }
    }
  }
  return { code: "GENERIC", backendMessage: null }
}

export function localizeAuthError(
  error: AuthError,
  t: (path: string) => string
): string {
  if (FRONTEND_ERROR_CODES.has(error.code)) {
    return t(`auth.error.${error.code}`)
  }
  return error.backendMessage ?? t("auth.error.GENERIC")
}
