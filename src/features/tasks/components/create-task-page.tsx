"use client"

import { ArrowLeft, CalendarPlus2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { CreateTaskForm } from "@/features/tasks/components/create-task-form"
import { Link, useRouter } from "@/i18n/navigation"

export function CreateTaskPage() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <main className="relative grid min-h-[calc(100vh-4.5rem)] place-items-center overflow-hidden bg-[#f6f8ff] px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 size-96 rounded-full bg-[#b9efff]/40 blur-3xl" />
      <section className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_24px_70px_rgba(35,49,105,0.14)]">
        <header className="bg-[#18213a] px-6 py-8 text-white sm:px-8">
          <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[#5267e0]">
            <CalendarPlus2 className="size-5" />
          </span>
          <h1 className="text-3xl font-black tracking-[-0.04em]">{t("dashboard.create.title")}</h1>
          <p className="mt-2 text-sm leading-6 text-white/60">{t("dashboard.create.description")}</p>
        </header>
        <div className="p-6 sm:p-8">
          <CreateTaskForm onSuccess={() => router.replace("/tasks")} />
          <Button asChild variant="ghost" className="mt-3 w-full">
            <Link href="/tasks"><ArrowLeft className="size-4" />{t("dashboard.create.back")}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
