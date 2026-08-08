"use client"

import { useActionState, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { CalendarClock, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { type Task, updateTaskSchedule } from "@/features/tasks/api"
import { TaskScheduleFields } from "@/features/tasks/components/task-schedule-fields"
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks"
import {
  formatTaskDueAt,
  getTaskScheduleState,
} from "@/features/tasks/schedule"
import { taskScheduleSchema } from "@/features/tasks/schema"
import { cn } from "@/lib/utils"

type ScheduleFormState = { error: "past" | "request" | null }

export function TaskScheduleControl({ task }: { task: Task }) {
  const { t, locale } = useTranslation()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const scheduleState = getTaskScheduleState(task.due_at)
  const label = task.due_at
    ? formatTaskDueAt(task.due_at, locale)
    : t("dashboard.schedule.unscheduled")

  const [state, formAction, isPending] = useActionState<ScheduleFormState, FormData>(
    async (_previous, formData) => {
      const shouldClear = formData.get("intent") === "clear"
      const parsed = taskScheduleSchema.safeParse({ dueAt: formData.get("dueAt") })
      if (!shouldClear && !parsed.success) return { error: "past" }

      try {
        let dueAt: string | null = null
        if (!shouldClear) {
          if (!parsed.success) return { error: "past" }
          dueAt = parsed.data.dueAt
            ? new Date(parsed.data.dueAt).toISOString()
            : null
        }
        await updateTaskSchedule(task.id, dueAt)
        await queryClient.invalidateQueries({ queryKey: tasksQueryKey })
        setIsOpen(false)
        return { error: null }
      } catch {
        return { error: "request" }
      }
    },
    { error: null }
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`${t("dashboard.schedule.edit")}: ${task.title}`}
          className={cn(
            "-ml-2 h-7 gap-1.5 rounded-lg px-2 text-xs font-semibold",
            scheduleState === "overdue" && !task.is_done && "bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800",
            scheduleState === "today" && !task.is_done && "bg-[#e9edff] text-[#3146c8] hover:bg-[#dfe4ff] hover:text-[#2639ad]",
            (scheduleState === "upcoming" || task.is_done) && "text-[#68738a] hover:bg-[#f0f2f8]",
            scheduleState === "unscheduled" && "text-[#8b94a8] hover:bg-[#f0f2f8]"
          )}
        >
          <CalendarClock className="size-3.5" />
          {scheduleState === "overdue" && !task.is_done
            ? `${t("dashboard.schedule.overdue")} · ${label}`
            : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 rounded-2xl p-4">
        <PopoverHeader>
          <PopoverTitle>{t("dashboard.schedule.title")}</PopoverTitle>
        </PopoverHeader>
        <form action={formAction} noValidate className="mt-2 space-y-3">
          <TaskScheduleFields
            idPrefix={`task-due-${task.id}`}
            defaultDueAt={task.due_at}
            disabled={isPending}
            invalid={Boolean(state.error)}
            showLabels
          />
          {state.error && (
            <p role="alert" className="text-xs text-destructive">
              {t(`dashboard.schedule.${state.error === "past" ? "pastError" : "error"}`)}
            </p>
          )}
          <div className="flex justify-between gap-2">
            <Button type="submit" name="intent" value="clear" variant="ghost" size="sm" disabled={isPending || !task.due_at}>
              <X className="size-3.5" />
              {t("dashboard.schedule.clear")}
            </Button>
            <Button type="submit" name="intent" value="save" size="sm" disabled={isPending} className="bg-[#3146c8] text-white hover:bg-[#2639ad]">
              {isPending ? <Spinner /> : <Save className="size-3.5" />}
              {t("dashboard.schedule.save")}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
