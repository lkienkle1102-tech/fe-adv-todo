"use client"

import { useActionState, useRef } from "react"
import { AlertCircle, KeyRound } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { changeCurrentUserPassword } from "@/features/auth/api"
import {
  localizeAuthError,
  parseAuthError,
  type AuthError,
} from "@/features/auth/error"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { passwordSchema } from "@/features/profile/schema"

type PasswordFormState = { error: AuthError | null }

export function PasswordForm({ email }: { email: string }) {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState<PasswordFormState, FormData>(
    async (_previous, formData) => {
      const parsed = passwordSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        password: formData.get("password"),
        confirmation: formData.get("confirmation"),
      })

      if (!parsed.success) {
        return {
          error: {
            code: parsed.error.issues[0]?.message ?? "VALIDATION_ERROR",
            backendMessage: null,
          },
        }
      }

      try {
        await changeCurrentUserPassword(
          parsed.data.currentPassword,
          parsed.data.password
        )
        formRef.current?.reset()
        toast.success(t("profile.security.success"))
        return { error: null }
      } catch (error) {
        return { error: parseAuthError(error) }
      }
    },
    { error: null }
  )
  const currentPasswordInvalid =
    state.error?.code === "CURRENT_PASSWORD_REQUIRED" ||
    state.error?.code === "CURRENT_PASSWORD_INCORRECT"
  const passwordInvalid = state.error?.code === "PASSWORD_TOO_SHORT"
  const confirmationInvalid = state.error?.code === "PASSWORD_MISMATCH"

  return (
    <form ref={formRef} action={formAction} noValidate className="mt-7 space-y-5">
      <input
        name="username"
        value={email}
        autoComplete="username"
        readOnly
        tabIndex={-1}
        className="sr-only"
        aria-hidden="true"
      />
      <div className="space-y-2">
        <Label htmlFor="profile-current-password">
          {t("profile.security.currentPassword")}
        </Label>
        <Input
          id="profile-current-password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          disabled={pending}
          aria-invalid={currentPasswordInvalid}
          className="h-12 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] px-4 text-base"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-password">{t("profile.security.newPassword")}</Label>
          <Input
            id="profile-password"
            name="password"
            type="password"
            minLength={8}
            autoComplete="new-password"
            disabled={pending}
            aria-invalid={passwordInvalid}
            className="h-12 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] px-4 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-password-confirmation">
            {t("profile.security.confirmPassword")}
          </Label>
          <Input
            id="profile-password-confirmation"
            name="confirmation"
            type="password"
            minLength={8}
            autoComplete="new-password"
            disabled={pending}
            aria-invalid={confirmationInvalid}
            className="h-12 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] px-4 text-base"
          />
        </div>
      </div>

      <p className="text-sm leading-6 text-[#626b80]">{t("profile.security.hint")}</p>

      {state.error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl bg-destructive/8 px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          {state.error.code === "PASSWORD_MISMATCH"
            ? t("profile.security.mismatch")
            : state.error.code === "CURRENT_PASSWORD_REQUIRED"
              ? t("profile.security.currentRequired")
              : state.error.code === "CURRENT_PASSWORD_INCORRECT"
                ? t("profile.security.currentIncorrect")
                : localizeAuthError(state.error, t)}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="outline"
          disabled={pending}
          className="h-11 rounded-xl border-[#ced6ec] px-5 text-[#3146c8] hover:bg-[#eef1ff]"
        >
          {pending ? <Spinner /> : <KeyRound className="size-4" />}
          {pending ? t("profile.security.updating") : t("profile.security.update")}
        </Button>
      </div>
    </form>
  )
}
