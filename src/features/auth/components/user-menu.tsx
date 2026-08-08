"use client"

import { useEffect, useState } from "react"
import { ChevronDown, LogOut, Users } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetchSessionUser, logoutSession } from "@/features/auth/session-api"
import { useAuthStore } from "@/features/auth/store"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { Link, useRouter } from "@/features/i18n/navigation"

export function UserMenu({ email }: { email?: string }) {
  const router = useRouter()
  const { t } = useTranslation()
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const displayEmail = email ?? sessionEmail

  useEffect(() => {
    if (email) return

    let isActive = true
    void fetchSessionUser()
      .then((user) => {
        if (isActive) setSessionEmail(user?.email ?? null)
      })
      .catch(() => undefined)

    return () => {
      isActive = false
    }
  }, [email])

  async function handleLogout() {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logoutSession()
      useAuthStore.getState().clearAuth()
      toast.success(t("userMenu.logoutSuccess"))
      router.replace("/")
    } catch {
      toast.error(t("userMenu.logoutError"))
      setIsLoggingOut(false)
    }
  }

  const initials = displayEmail?.slice(0, 2).toUpperCase() ?? "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 max-w-64 gap-2 rounded-xl border border-[#e0e5f2] bg-white px-2.5 text-[#28324a] shadow-sm hover:bg-[#f7f8ff] data-[state=open]:bg-[#eef1ff]"
          aria-label={t("userMenu.open")}
        >
          <Avatar size="sm" className="size-7">
            <AvatarFallback className="bg-[#3146c8] text-[10px] font-black text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 max-w-40 truncate text-sm font-bold sm:block">
            {displayEmail ?? t("userMenu.account")}
          </span>
          <ChevronDown className="size-3.5 text-[#8a93a8]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-2xl border border-[#e0e5f2] bg-white p-2 shadow-[0_18px_45px_rgba(28,39,81,0.16)]"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <span className="block text-[10px] font-black tracking-[0.14em] text-[#8a93a8] uppercase">
            {t("userMenu.signedIn")}
          </span>
          <span className="mt-1 block truncate text-sm font-bold text-[#28324a]">
            {displayEmail ?? t("userMenu.account")}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1.5" />
        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 font-medium">
          <Link href="/users">
            <Users className="size-4 text-[#5267e0]" />
            {t("userMenu.manageUsers")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={isLoggingOut}
          className="rounded-xl px-3 py-2.5 font-medium"
          onSelect={() => void handleLogout()}
        >
          <LogOut className="size-4" />
          {isLoggingOut ? t("userMenu.loggingOut") : t("userMenu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
