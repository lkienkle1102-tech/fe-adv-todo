"use client"

import { useActionState } from "react"
import { AlertCircle, CheckCircle2, Save } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  type AuthUser,
  updateCurrentUser,
} from "@/features/auth/api"
import {
  localizeAuthError,
  parseAuthError,
  type AuthError,
} from "@/features/auth/error"
import { useAuthStore } from "@/features/auth/store"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { profileDetailsSchema } from "@/features/profile/schema"

type ProfileFormState = {
  error: AuthError | null
  saved: boolean
}

export function ProfileDetailsForm({ user }: { user: AuthUser }) {
  const { t } = useTranslation()
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(
    async (_previous, formData) => {
      const parsed = profileDetailsSchema.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
      })

      if (!parsed.success) {
        return {
          error: {
            code: parsed.error.issues[0]?.message ?? "VALIDATION_ERROR",
            backendMessage: null,
          },
          saved: false,
        }
      }

      try {
        const updatedUser = await updateCurrentUser(parsed.data)
        useAuthStore.getState().setAuth(updatedUser)
        toast.success(t("profile.details.success"))
        return { error: null, saved: true }
      } catch (error) {
        return { error: parseAuthError(error), saved: false }
      }
    },
    { error: null, saved: false }
  )
  const usernameInvalid = state.error?.code.startsWith("USERNAME_") ?? false
  const emailInvalid = state.error?.code === "INVALID_EMAIL"

  return (
    <form action={formAction} noValidate className="mt-7 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-username">{t("profile.details.username")}</Label>
          <Input
            id="profile-username"
            name="username"
            defaultValue={user.username}
            autoComplete="name"
            maxLength={50}
            disabled={pending}
            aria-invalid={usernameInvalid}
            className="h-12 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] px-4 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">{t("profile.details.email")}</Label>
          <Input
            id="profile-email"
            name="email"
            type="email"
            defaultValue={user.email}
            autoComplete="email"
            disabled={pending}
            aria-invalid={emailInvalid}
            className="h-12 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] px-4 text-base"
          />
        </div>
      </div>

      {state.error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl bg-destructive/8 px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          {localizeAuthError(state.error, t)}
        </p>
      )}

      {state.saved && !state.error && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm font-medium text-emerald-700"
        >
          <CheckCircle2 className="size-4" />
          {t("profile.details.saved")}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="h-11 rounded-xl bg-[#3146c8] px-5 text-white shadow-[0_10px_20px_rgba(49,70,200,0.18)] hover:bg-[#2639ad]"
        >
          {pending ? <Spinner /> : <Save className="size-4" />}
          {pending ? t("profile.details.saving") : t("profile.details.save")}
        </Button>
      </div>
    </form>
  )
}
