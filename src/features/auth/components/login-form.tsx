"use client"

import { useActionState } from "react"
import { ArrowRight, Check, LockKeyhole, Mail } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction, type FormState } from "@/features/auth/actions/login-action"
import { localizeAuthError } from "@/features/auth/error"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { Link, useRouter } from "@/i18n/navigation"

export function LoginForm({
  onSuccess,
  successDestination = "/tasks",
}: {
  onSuccess?: () => void
  successDestination?: string
}) {
  const router = useRouter()
  const { t } = useTranslation()
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      const result = await loginAction(prev, formData)
      if (result.error) {
        toast.error(localizeAuthError(result.error, t))
      } else {
        toast.success(t("auth.login.success"))
        onSuccess?.()
        router.replace(successDestination)
      }
      return result
    },
    { error: null }
  )
  const errorMessage = state.error ? localizeAuthError(state.error, t) : null

  return (
    <Card className="w-full max-w-md gap-0 overflow-hidden rounded-[1.75rem] border border-white/80 bg-white py-0 shadow-[0_28px_70px_rgba(30,43,94,0.18)] ring-0">
      <div className="relative overflow-hidden bg-[#18213a] px-6 py-7 text-white sm:px-8">
        <div
          aria-hidden
          className="absolute -top-20 -right-16 size-48 rounded-full border-[28px] border-[#77def7]/15"
        />
        <div className="relative flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#5267e0] shadow-lg shadow-black/10">
            <Check className="size-5 stroke-[2.5]" />
          </span>
          <span className="text-xs font-black tracking-[0.16em] text-white/80">
            ADV.TODO
          </span>
        </div>
        <CardHeader className="relative mt-8 gap-2 px-0">
          <CardTitle className="text-3xl font-black tracking-[-0.04em] text-white">
            {t("auth.login.title")}
          </CardTitle>
          <CardDescription className="text-[15px] leading-6 text-white/60">
            {t("auth.login.description")}
          </CardDescription>
        </CardHeader>
      </div>
      <form action={formAction} noValidate>
        <CardContent className="flex flex-col gap-5 px-6 pt-7 sm:px-8">
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="login-email">{t("common.email")}</Label>
            <div className="relative">
              <Mail
                aria-hidden
                className="absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-[#8b94a8]"
              />
              <Input
                className="h-12 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] pl-11 text-base shadow-none focus-visible:bg-white md:text-sm"
                id="login-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                aria-invalid={Boolean(errorMessage)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="login-password">{t("common.password")}</Label>
            <div className="relative">
              <LockKeyhole
                aria-hidden
                className="absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-[#8b94a8]"
              />
              <Input
                className="h-12 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] pl-11 text-base shadow-none focus-visible:bg-white md:text-sm"
                id="login-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                aria-invalid={Boolean(errorMessage)}
              />
            </div>
          </div>
          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/8 px-3.5 py-3 text-sm leading-5 text-destructive"
            >
              {errorMessage}
            </p>
          )}
        </CardContent>
        <CardFooter className="mt-7 flex flex-col gap-4 border-0 bg-transparent px-6 pb-7 sm:px-8 sm:pb-8">
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#3146c8] text-[15px] text-white shadow-[0_12px_24px_rgba(49,70,200,0.24)] hover:bg-[#2639ad]"
            disabled={isPending}
          >
            <span>{isPending ? t("auth.login.submitting") : t("auth.login.submit")}</span>
            {!isPending && (
              <ArrowRight className="ml-1 size-4 transition-transform group-hover/button:translate-x-1" />
            )}
          </Button>
          <p className="text-center text-sm text-[#667087]">
            {t("auth.login.noAccount")}{" "}
            <Link
              href="/register"
              className="font-bold text-[#4054c7] underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {t("auth.login.registerLink")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
