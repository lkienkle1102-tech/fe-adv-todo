import { AuthSessionGuard } from "@/features/auth/components/auth-session-guard"
import { getServerSessionUser } from "@/features/auth/server-session"
import type { Locale } from "@/i18n/locales"
import { redirect } from "@/i18n/navigation"

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const [{ locale }, user] = await Promise.all([params, getServerSessionUser()])
  if (!user) {
    redirect({ href: "/login", locale: locale as Locale })
    return null
  }

  return <AuthSessionGuard user={user}>{children}</AuthSessionGuard>
}
import type { ReactNode } from "react"
