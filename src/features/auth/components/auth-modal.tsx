"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "@/features/i18n/navigation"

export function AuthModal({ children, title }: { children: React.ReactNode; title: string }) {
  const router = useRouter()

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent className="sm:max-w-sm" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  )
}
