"use client"

import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Fingerprint,
  KeyRound,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { AuthUser } from "@/features/auth/api"
import { UserMenu } from "@/features/auth/components/user-menu"
import { useAuthStore } from "@/features/auth/store"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { PasswordForm } from "@/features/profile/components/password-form"
import { ProfileDetailsForm } from "@/features/profile/components/profile-details-form"
import { Link } from "@/i18n/navigation"

function getInitials(username: string) {
  const parts = username.trim().split(/\s+/u)
  return (parts.length > 1 ? [parts[0], parts.at(-1)] : parts)
    .filter(Boolean)
    .map((part) => Array.from(part ?? "")[0])
    .join("")
    .toLocaleUpperCase()
}

function ProfileSkeleton() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-10">
      <Skeleton className="h-10 w-36 rounded-xl" />
      <Skeleton className="mt-7 h-72 rounded-[2rem]" />
      <div className="mt-7 grid gap-7 lg:grid-cols-[18rem_1fr]">
        <Skeleton className="h-72 rounded-[1.75rem]" />
        <Skeleton className="h-[30rem] rounded-[1.75rem]" />
      </div>
    </main>
  )
}

export function UserProfilePage({ initialUser }: { initialUser?: AuthUser }) {
  const { t } = useTranslation()
  const sessionUser = useAuthStore((state) => state.user)
  const user = sessionUser ?? initialUser

  return (
    <div className="min-h-screen bg-[#f6f8ff] text-[#172033]">
      <header className="border-b border-[#e0e5f2] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 pr-20 sm:px-6 lg:px-10 lg:pr-24">
          <Link href="/tasks" className="flex items-center gap-3 rounded-xl">
            <span className="grid size-10 place-items-center rounded-xl bg-[#3146c8] text-white shadow-[0_8px_24px_rgba(49,70,200,0.22)]">
              <Check className="size-5 stroke-[2.5]" />
            </span>
            <span className="text-sm font-black">
              ADV<span className="text-[#5267e0]">.TODO</span>
            </span>
          </Link>
          <UserMenu username={user?.username} />
        </div>
      </header>

      {!user ? (
        <ProfileSkeleton />
      ) : (
        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-10 lg:py-12">
          <Button asChild variant="ghost" className="-ml-3 rounded-xl text-[#526078]">
            <Link href="/tasks">
              <ArrowLeft className="size-4" />
              {t("profile.back")}
            </Link>
          </Button>

          <section className="relative mt-7 overflow-hidden rounded-[2rem] bg-[#17234d] text-white shadow-[0_22px_60px_rgba(28,39,81,0.18)]">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_center,rgba(111,226,229,0.3),transparent_68%)]"
            />
            <div className="relative grid min-h-64 items-end gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-11">
              <div>
                <Badge className="border-white/15 bg-white/10 text-[#cbd6ff]">
                  <Fingerprint className="size-3.5" />
                  {t("profile.eyebrow")}
                </Badge>
                <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <Avatar className="size-20 border-4 border-white/12 shadow-xl">
                    <AvatarFallback className="bg-[#6fe2e5] text-xl font-black text-[#17234d]">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-black tracking-[-0.045em] sm:text-5xl">
                      {user.username}
                    </h1>
                    <p className="mt-2 flex items-center gap-2 text-sm text-[#b9c4e7] sm:text-base">
                      <Mail className="size-4" />
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 lg:max-w-48 lg:justify-end">
                <Badge className="border-emerald-300/20 bg-emerald-300/12 text-emerald-100">
                  <ShieldCheck className="size-3.5" />
                  {user.is_active ? t("profile.status.active") : t("profile.status.inactive")}
                </Badge>
                {user.is_verified && (
                  <Badge className="border-sky-300/20 bg-sky-300/12 text-sky-100">
                    <BadgeCheck className="size-3.5" />
                    {t("profile.status.verified")}
                  </Badge>
                )}
              </div>
            </div>
          </section>

          <div className="mt-7 grid items-start gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <aside className="rounded-[1.75rem] border border-[#dfe4f1] bg-white p-6 shadow-[0_14px_40px_rgba(40,54,113,0.06)]">
              <p className="text-xs font-black tracking-[0.14em] text-[#5f687e] uppercase">
                {t("profile.account.title")}
              </p>
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="flex items-center gap-2 text-xs font-bold text-[#5f687e]">
                    <UserRound className="size-3.5" />
                    {t("profile.account.type")}
                  </dt>
                  <dd className="mt-1.5 text-sm font-bold text-[#28324a]">
                    {user.is_superuser
                      ? t("profile.account.administrator")
                      : t("profile.account.member")}
                  </dd>
                </div>
                <div className="border-t border-[#edf0f7] pt-5">
                  <dt className="text-xs font-bold text-[#5f687e]">{t("profile.account.id")}</dt>
                  <dd className="mt-1.5 truncate font-mono text-xs text-[#526078]" title={user.id}>
                    {user.id}
                  </dd>
                </div>
                <div className="border-t border-[#edf0f7] pt-5">
                  <dt className="text-xs font-bold text-[#5f687e]">
                    {t("profile.account.verification")}
                  </dt>
                  <dd className="mt-1.5 text-sm font-bold text-[#28324a]">
                    {user.is_verified
                      ? t("profile.status.verified")
                      : t("profile.status.unverified")}
                  </dd>
                </div>
              </dl>
            </aside>

            <div className="space-y-7">
              <section className="rounded-[1.75rem] border border-[#dfe4f1] bg-white p-6 shadow-[0_14px_40px_rgba(40,54,113,0.06)] sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#eef1ff] text-[#3146c8]">
                    <UserRound className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-black tracking-[-0.025em]">
                      {t("profile.details.title")}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-[#626b80]">
                      {t("profile.details.description")}
                    </p>
                  </div>
                </div>
                <ProfileDetailsForm key={`${user.username}:${user.email}`} user={user} />
              </section>

              <section className="rounded-[1.75rem] border border-[#dfe4f1] bg-white p-6 shadow-[0_14px_40px_rgba(40,54,113,0.06)] sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e8f8f8] text-[#177c83]">
                    <KeyRound className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-black tracking-[-0.025em]">
                      {t("profile.security.title")}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-[#626b80]">
                      {t("profile.security.description")}
                    </p>
                  </div>
                </div>
                <PasswordForm email={user.email} />
              </section>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
