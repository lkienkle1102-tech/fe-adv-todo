"use client"

import { useActionState } from "react"

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
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { Link, useRouter } from "@/features/i18n/navigation"

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const { t } = useTranslation()
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      const result = await loginAction(prev, formData)
      if (!result.error) {
        onSuccess?.()
        router.push("/tasks")
      }
      return result
    },
    { error: null }
  )

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("auth.login.title")}</CardTitle>
        <CardDescription>{t("auth.login.description")}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">{t("common.email")}</Label>
            <Input id="login-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">{t("common.password")}</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("auth.login.submitting") : t("auth.login.submit")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t("auth.login.noAccount")}{" "}
            <Link href="/register" className="underline">
              {t("auth.login.registerLink")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
