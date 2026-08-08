"use client"

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  ListTodo,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { Link } from "@/features/i18n/navigation"

const FEATURES = [
  { icon: ListTodo, key: "organize" },
  { icon: CheckCircle2, key: "track" },
  { icon: Sparkles, key: "smooth" },
] as const

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#f7f9ff] text-[#172033]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#6574d50a_1px,transparent_1px),linear-gradient(to_bottom,#6574d50a_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10rem] size-[34rem] rounded-full bg-[#b9efff]/45 blur-3xl"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 pr-20 lg:px-10 lg:pr-24">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-[#3146c8] text-white shadow-[0_8px_24px_rgba(49,70,200,0.25)] transition-transform group-hover:-rotate-3">
            <Check className="size-5 stroke-[2.5]" />
          </span>
          <span className="text-sm font-black tracking-[-0.02em] text-[#172033]">
            ADV<span className="text-[#5267e0]">.TODO</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 sm:flex" aria-label="Authentication">
          <Button
            asChild
            variant="ghost"
            className="h-10 rounded-xl px-4 text-[#3f4b63] hover:bg-white/80"
          >
            <Link href="/login">{t("common.login")}</Link>
          </Button>
          <Button
            asChild
            className="h-10 rounded-xl bg-[#3146c8] px-5 text-white shadow-[0_10px_24px_rgba(49,70,200,0.22)] hover:bg-[#2639ad]"
          >
            <Link href="/register">{t("common.register")}</Link>
          </Button>
        </nav>
      </header>

      <main className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-10 lg:px-10">
        <section className="grid min-h-[calc(100vh-10rem)] items-center gap-14 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-16">
          <div className="max-w-2xl">
            <Badge className="mb-7 gap-2 rounded-full border border-[#cfd7ff] bg-white/80 px-3.5 py-1.5 text-[#4054c7] shadow-sm backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              {t("home.badge")}
            </Badge>
            <h1 className="text-[clamp(3.4rem,8vw,6.8rem)] leading-[0.88] font-black tracking-[-0.075em] text-[#172033]">
              {t("home.title")}
              <span className="relative ml-[0.12em] inline-block text-[#3146c8]">
                {t("home.titleHighlight")}
                <span
                  aria-hidden
                  className="absolute -right-1 -bottom-2 left-1 h-2 -rotate-1 rounded-full bg-[#77def7]/70"
                />
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#667087] sm:text-xl">
              {t("home.subtitle")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-13 rounded-2xl bg-[#3146c8] px-6 text-base text-white shadow-[0_16px_36px_rgba(49,70,200,0.25)] hover:-translate-y-0.5 hover:bg-[#2639ad]"
              >
                <Link href="/register">
                  {t("common.register")}
                  <ArrowRight className="ml-1 size-4.5 transition-transform group-hover/button:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-13 rounded-2xl border-[#d9deef] bg-white/75 px-6 text-base text-[#344056] shadow-sm hover:bg-white"
              >
                <Link href="/login">{t("common.login")}</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px] py-10 lg:py-0">
            <div
              aria-hidden
              className="absolute inset-x-[12%] top-[10%] bottom-[8%] rotate-3 rounded-[3rem] bg-[#dfe4ff]"
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-[0_32px_80px_rgba(38,53,118,0.18)] backdrop-blur sm:p-6">
              <div className="flex items-center justify-between border-b border-[#e8ebf5] pb-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[#eef1ff] text-[#3146c8]">
                    <ListTodo className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-[0.14em] text-[#8b94a8] uppercase">
                      ADV.TODO
                    </p>
                    <p className="font-bold text-[#252f45]">{t("home.badge")}</p>
                  </div>
                </div>
                <div className="flex -space-x-2" aria-hidden>
                  <span className="size-8 rounded-full border-2 border-white bg-[#ffd6b8]" />
                  <span className="size-8 rounded-full border-2 border-white bg-[#b9efff]" />
                  <span className="grid size-8 place-items-center rounded-full border-2 border-white bg-[#3146c8] text-[10px] font-bold text-white">
                    +3
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {FEATURES.map((feature, index) => (
                  <div
                    key={feature.key}
                    className="group flex items-start gap-3 rounded-2xl border border-[#e4e8f3] bg-white p-4 shadow-[0_6px_20px_rgba(35,49,94,0.06)] transition-transform hover:-translate-y-0.5 sm:items-center sm:p-5"
                  >
                    <span
                      className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full sm:mt-0 ${
                        index === 0
                          ? "bg-[#3146c8] text-white"
                          : "border-2 border-[#cfd5e5] text-transparent"
                      }`}
                    >
                      {index === 0 ? (
                        <Check className="size-4" />
                      ) : (
                        <Circle className="size-3" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#2c354a]">
                        {t(`home.features.${feature.key}.title`)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#7a8397]">
                        {t(`home.features.${feature.key}.description`)}
                      </p>
                    </div>
                    <span
                      className={`hidden size-10 shrink-0 place-items-center rounded-xl sm:grid ${
                        index === 1
                          ? "bg-[#e7fbff] text-[#168aa7]"
                          : "bg-[#f0f2ff] text-[#5367d7]"
                      }`}
                    >
                      <feature.icon className="size-4.5" />
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#18213a] p-4 text-white sm:px-5">
                <CheckCircle2 className="size-5 text-[#77def7]" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/12">
                  <div className="h-full w-2/3 rounded-full bg-[#77def7]" />
                </div>
                <span className="font-mono text-xs text-white/65">2 / 3</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid border-t border-[#dfe4f1] py-8 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Card
              key={feature.key}
              className="rounded-none bg-transparent py-5 shadow-none ring-0 md:border-r md:border-[#dfe4f1] md:px-7 md:first:pl-0 md:last:border-r-0"
            >
              <CardHeader className="px-0">
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#5267e0]">
                    0{index + 1}
                  </span>
                  <span className="h-px w-8 bg-[#b9c2df]" />
                  <feature.icon className="size-4.5 text-[#5267e0]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#273148]">
                  {t(`home.features.${feature.key}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <p className="max-w-sm text-sm leading-6 text-[#737d91]">
                  {t(`home.features.${feature.key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  )
}
