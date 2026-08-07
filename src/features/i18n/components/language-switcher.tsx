"use client"

import { LanguagesIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { localeNames, locales, type Locale } from "@/i18n/locales"
import { useTranslation } from "@/features/i18n/hooks/use-translation"

const LOCALE_PREFIX = new RegExp(`^/(${Object.keys(locales).join("|")})`)

export function LanguageSwitcher() {
  const { locale } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(code: Locale) {
    const rest = pathname.replace(LOCALE_PREFIX, "")
    router.push(`/${code}${rest}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <LanguagesIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(localeNames) as Locale[]).map((code) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => switchTo(code)}
            className={code === locale ? "font-semibold" : undefined}
          >
            {localeNames[code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
