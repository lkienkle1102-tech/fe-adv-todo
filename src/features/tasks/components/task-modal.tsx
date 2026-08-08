"use client"

import { CalendarPlus2, FilePenLine } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import type { Task } from "@/features/tasks/api"
import { TaskEditor } from "@/features/tasks/components/task-editor"
import { useRouter } from "@/i18n/navigation"

type TaskModalProps =
  | { mode: "create"; taskId?: never; initialTask?: never }
  | { mode: "edit"; taskId: string; initialTask?: Task }

export function TaskModal(props: TaskModalProps) {
  const { mode } = props
  const router = useRouter()
  const { t } = useTranslation()
  const Icon = mode === "create" ? CalendarPlus2 : FilePenLine

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[1.75rem] border-0 p-0 shadow-[0_28px_80px_rgba(18,27,54,0.28)] sm:max-w-lg [&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:z-20 [&_[data-slot=dialog-close]]:text-white/70 [&_[data-slot=dialog-close]]:hover:bg-white/10 [&_[data-slot=dialog-close]]:hover:text-white">
        <DialogHeader className="relative overflow-hidden bg-[#18213a] px-6 py-7 text-left text-white sm:px-8">
          <div
            aria-hidden
            className="absolute -top-16 -right-12 size-40 rounded-full border-[24px] border-[#77def7]/15"
          />
          <span className="relative mb-3 grid size-10 place-items-center rounded-xl bg-[#5267e0] text-white">
            <Icon className="size-5" />
          </span>
          <DialogTitle className="relative text-2xl font-black tracking-[-0.035em] text-white">
            {t(`dashboard.${mode}.title`)}
          </DialogTitle>
          <DialogDescription className="relative text-sm leading-6 text-white/60">
            {t(`dashboard.${mode}.description`)}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pt-2 pb-7 sm:px-8 sm:pb-8">
          {mode === "create" ? (
            <TaskEditor
              mode="create"
              onSuccess={() => router.replace("/tasks")}
            />
          ) : (
            <TaskEditor
              mode="edit"
              taskId={props.taskId}
              initialTask={props.initialTask}
              onSuccess={() => router.replace("/tasks")}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
