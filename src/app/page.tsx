"use client"

import Link from "next/link"
import { CheckCircle2, ListTodo, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/features/i18n/hooks/use-translation"

const FEATURES = [
  { icon: ListTodo, key: "organize" },
  { icon: CheckCircle2, key: "track" },
  { icon: Sparkles, key: "smooth" },
] as const

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-linear-to-b from-primary/10 via-background to-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-160 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <main className="relative flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3.5" />
          {t("home.badge")}
        </Badge>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          {t("home.title")} <span className="text-primary">{t("home.titleHighlight")}</span>
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">{t("home.subtitle")}</p>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/login">{t("common.login")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">{t("common.register")}</Link>
          </Button>
        </div>

        <div className="mt-8 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.key} className="text-left">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle className="mt-2">{t(`home.features.${feature.key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t(`home.features.${feature.key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
