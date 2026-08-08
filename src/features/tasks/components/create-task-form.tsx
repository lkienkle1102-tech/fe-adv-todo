"use client"

import { useActionState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { AlertCircle, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { createTask } from "@/features/tasks/api"
import { TaskScheduleFields } from "@/features/tasks/components/task-schedule-fields"
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks"
import { taskSchema } from "@/features/tasks/schema"

type TaskFormState = { error: "required" | "tooLong" | "past" | "request" | null }

export function CreateTaskForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [state, formAction, pending] = useActionState<TaskFormState, FormData>(
    async (_previous, formData) => {
      const parsed = taskSchema.safeParse({
        title: formData.get("title"),
        dueAt: formData.get("dueAt"),
      })
      if (!parsed.success) {
        const issue = parsed.error.issues[0]
        if (issue.message === "PAST_SCHEDULE") return { error: "past" }
        return { error: issue.code === "too_big" ? "tooLong" : "required" }
      }

      try {
        const dueAt = parsed.data.dueAt
          ? new Date(parsed.data.dueAt).toISOString()
          : null
        await createTask(parsed.data.title, dueAt)
        await queryClient.invalidateQueries({ queryKey: tasksQueryKey })
        toast.success(t("dashboard.create.success"))
        onSuccess?.()
        return { error: null }
      } catch {
        return { error: "request" }
      }
    },
    { error: null }
  )

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="create-task-title">{t("dashboard.create.name")}</Label>
        <Input
          id="create-task-title"
          name="title"
          autoFocus
          maxLength={200}
          disabled={pending}
          aria-invalid={Boolean(state.error)}
          placeholder={t("dashboard.addPlaceholder")}
          className="h-12 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] px-4 text-base"
        />
      </div>

      <TaskScheduleFields
        idPrefix="create-task-due"
        disabled={pending}
        invalid={Boolean(state.error)}
        showLabels
        className="gap-3"
      />

      {state.error && (
        <p role="alert" className="flex items-center gap-2 rounded-xl bg-destructive/8 px-3.5 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {t(`dashboard.formError.${state.error}`)}
        </p>
      )}

      <Button type="submit" disabled={pending} className="h-12 w-full rounded-xl bg-[#3146c8] text-white shadow-[0_12px_24px_rgba(49,70,200,0.2)] hover:bg-[#2639ad]">
        {pending ? <Spinner /> : <Plus className="size-4" />}
        {pending ? t("dashboard.adding") : t("dashboard.newTask")}
      </Button>
    </form>
  )
}
