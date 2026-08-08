"use client"

import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  ListChecks,
  Plus,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/features/auth/store"
import { useTranslation } from "@/features/i18n/hooks/use-translation"

const STATS = [
  { key: "total", icon: ListChecks },
  { key: "completed", icon: CheckCircle2 },
  { key: "dueToday", icon: CalendarDays },
] as const

const GUIDE_STEPS = ["capture", "schedule", "finish"] as const

export function TaskList() {
  const { t } = useTranslation()
  const email = useAuthStore((state) => state.user?.email)

  return (
    <div className="min-h-screen bg-[#f6f8ff] text-[#172033]">
      <header className="border-b border-[#e0e5f2] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 pr-20 lg:px-10 lg:pr-24">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#3146c8] text-white shadow-[0_8px_24px_rgba(49,70,200,0.22)]">
              <Check className="size-5 stroke-[2.5]" />
            </span>
            <div>
              <p className="text-sm font-black tracking-[-0.02em]">
                ADV<span className="text-[#5267e0]">.TODO</span>
              </p>
              {email && (
                <p className="mt-0.5 max-w-44 truncate text-xs text-[#7a8397]">
                  {t("dashboard.signedInAs")} {email}
                </p>
              )}
            </div>
          </div>
          <Button
            disabled
            className="h-10 rounded-xl bg-[#3146c8] px-4 text-white opacity-60"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">{t("dashboard.newTask")}</span>
          </Button>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl overflow-hidden px-6 py-10 lg:px-10 lg:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 size-80 rounded-full bg-[#b9efff]/35 blur-3xl"
        />

        <section className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Badge className="mb-5 rounded-full border border-[#d6ddff] bg-white px-3 py-1.5 text-[#4054c7] shadow-sm">
              <Sparkles className="size-3.5" />
              {t("dashboard.eyebrow")}
            </Badge>
            <h1 className="max-w-3xl text-[clamp(2.7rem,6vw,5.2rem)] leading-[0.94] font-black tracking-[-0.065em]">
              {t("dashboard.greeting")}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#697389] sm:text-lg">
              {t("dashboard.description")}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white bg-[#18213a] p-6 text-white shadow-[0_24px_60px_rgba(24,33,58,0.17)] sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-[0.16em] text-white/55 uppercase">
                {t("dashboard.overview")}
              </p>
              <CircleDot className="size-4 text-[#77def7]" />
            </div>
            <div className="mt-7 grid grid-cols-3 divide-x divide-white/10">
              {STATS.map(({ key, icon: Icon }) => (
                <div key={key} className="px-3 first:pl-0 last:pr-0">
                  <Icon className="mb-4 size-4 text-[#77def7]" />
                  <p className="font-mono text-3xl font-bold">0</p>
                  <p className="mt-1 text-xs leading-4 text-white/55">
                    {t(`dashboard.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-10 overflow-hidden rounded-[2rem] border border-[#dfe4f1] bg-white p-6 shadow-[0_18px_50px_rgba(40,54,113,0.08)] sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xl font-black tracking-[-0.025em]">
                {t("dashboard.focusTitle")}
              </p>
              <p className="mt-1 text-sm text-[#7a8397]">
                {t("dashboard.focusDescription")}
              </p>
            </div>
            <span className="font-mono text-xs font-bold tracking-[0.12em] text-[#5267e0] uppercase">
              {t("dashboard.today")}
            </span>
          </div>

          <div className="relative mt-10 h-20" aria-hidden>
            <div className="absolute top-8 right-0 left-0 h-px bg-[repeating-linear-gradient(to_right,#cdd4e8_0,#cdd4e8_8px,transparent_8px,transparent_16px)]" />
            <div className="absolute top-0 left-[14%] flex flex-col items-center">
              <span className="h-16 w-px bg-[#77def7]" />
              <span className="size-2.5 rounded-full bg-[#3146c8] ring-4 ring-[#dfe4ff]" />
            </div>
            {[35, 55, 75, 95].map((position) => (
              <span
                key={position}
                className="absolute top-6 size-4 -translate-x-1/2 rounded-full border-2 border-[#d8deec] bg-white"
                style={{ left: `${position}%` }}
              />
            ))}
          </div>
        </section>

        <section className="relative mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex min-h-72 flex-col items-start justify-center rounded-[2rem] border border-[#dfe4f1] bg-white p-7 sm:p-10">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#eef1ff] text-[#3146c8]">
              <ListChecks className="size-6" />
            </span>
            <h2 className="mt-6 max-w-xl text-2xl font-black tracking-[-0.035em] sm:text-3xl">
              {t("dashboard.emptyTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#727c91] sm:text-base">
              {t("dashboard.emptyDescription")}
            </p>
            <Button disabled variant="outline" className="mt-6 h-11 rounded-xl px-5 opacity-60">
              {t("dashboard.emptyAction")}
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <aside className="rounded-[2rem] border border-[#cfd7ff] bg-[#e9edff] p-7 sm:p-8">
            <p className="text-xs font-black tracking-[0.16em] text-[#4054c7] uppercase">
              {t("dashboard.guideTitle")}
            </p>
            <ol className="mt-7 space-y-6">
              {GUIDE_STEPS.map((step, index) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white font-mono text-xs font-bold text-[#3146c8] shadow-sm">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm font-bold leading-6 text-[#303b56]">
                    {t(`dashboard.guide.${step}`)}
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        </section>
      </main>
    </div>
  )
}
