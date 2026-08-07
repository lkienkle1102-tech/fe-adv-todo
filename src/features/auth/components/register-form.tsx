"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
import { registerAction, type FormState } from "@/features/auth/actions/register-action"
import { useTranslation } from "@/features/i18n/hooks/use-translation"

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const { t } = useTranslation()
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      const result = await registerAction(prev, formData)
      if (!result.error) {
        onSuccess?.()
        router.push("/login")
      }
      return result
    },
    { error: null }
  )

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("auth.register.title")}</CardTitle>
        <CardDescription>{t("auth.register.description")}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="register-email">{t("common.email")}</Label>
            <Input id="register-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="register-password">{t("common.password")}</Label>
            <Input
              id="register-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("auth.register.submitting") : t("auth.register.submit")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t("auth.register.hasAccount")}{" "}
            <Link href="/login" className="underline">
              {t("auth.register.loginLink")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
