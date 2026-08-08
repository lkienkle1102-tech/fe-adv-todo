"use client"

import { ArrowLeft, Check, ShieldCheck, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/features/auth/components/user-menu"
import { useAuthStore } from "@/features/auth/store"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { Link } from "@/features/i18n/navigation"

export function UserManagementPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)

  return (
    <div className="min-h-screen bg-[#f6f8ff] text-[#172033]">
      <header className="border-b border-[#e0e5f2] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 pr-20 lg:px-10 lg:pr-24">
          <Link href="/tasks" className="flex items-center gap-3 rounded-xl">
            <span className="grid size-10 place-items-center rounded-xl bg-[#3146c8] text-white shadow-[0_8px_24px_rgba(49,70,200,0.22)]">
              <Check className="size-5 stroke-[2.5]" />
            </span>
            <span className="text-sm font-black">
              ADV<span className="text-[#5267e0]">.TODO</span>
            </span>
          </Link>
          <UserMenu email={user?.email} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
        <Button asChild variant="ghost" className="mb-8 -ml-3 rounded-xl text-[#526078]">
          <Link href="/tasks">
            <ArrowLeft className="size-4" />
            {t("users.back")}
          </Link>
        </Button>

        <Badge className="rounded-full border border-[#d6ddff] bg-white px-3 py-1.5 text-[#4054c7]">
          <ShieldCheck className="size-3.5" />
          {t("users.eyebrow")}
        </Badge>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
          {t("users.title")}
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#6f788d]">{t("users.description")}</p>

        <section className="mt-10 rounded-[2rem] border border-[#dfe4f1] bg-white p-7 shadow-[0_18px_50px_rgba(40,54,113,0.08)] sm:p-9">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#eef1ff] text-[#3146c8]">
              <UserRound className="size-5" />
            </span>
            <div>
              <p className="text-xs font-black tracking-[0.14em] text-[#8a93a8] uppercase">
                {t("users.currentAccount")}
              </p>
              <p className="mt-1 font-bold text-[#28324a]">
                {user?.email ?? t("users.sessionAccount")}
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-[#e5e9f3] pt-6">
            <p className="text-sm leading-6 text-[#6f788d]">{t("users.placeholder")}</p>
          </div>
        </section>
      </main>
    </div>
  )
}
