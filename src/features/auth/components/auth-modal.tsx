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
      <DialogContent
        className="max-h-[calc(100vh-1.5rem)] overflow-y-auto border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-md [&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:z-20 [&_[data-slot=dialog-close]]:text-white/70 [&_[data-slot=dialog-close]]:hover:bg-white/10 [&_[data-slot=dialog-close]]:hover:text-white"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  )
}
