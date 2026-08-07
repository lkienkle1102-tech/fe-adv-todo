"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
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
import { getAuthErrorMessage } from "@/features/auth/error"
import { useRegister } from "@/features/auth/hooks/use-register"
import { useTranslation } from "@/features/i18n/hooks/use-translation"

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const register = useRegister()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    register.mutate(
      { email, password },
      {
        onSuccess: () => {
          onSuccess?.()
          router.push("/login")
        },
      }
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("auth.register.title")}</CardTitle>
        <CardDescription>{t("auth.register.description")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="register-email">{t("common.email")}</Label>
            <Input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="register-password">{t("common.password")}</Label>
            <Input
              id="register-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {register.isError && (
            <p className="text-sm text-destructive">{getAuthErrorMessage(register.error)}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending ? t("auth.register.submitting") : t("auth.register.submit")}
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
