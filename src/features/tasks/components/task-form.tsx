"use client"

import { useActionState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { AlertCircle, Plus, Save } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import {
  createTask,
  type Task,
  updateTaskDetails,
} from "@/features/tasks/api"
import { TaskScheduleFields } from "@/features/tasks/components/task-schedule-fields"
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks"
import { toDateTimeLocal } from "@/features/tasks/schedule"
import { taskSchema } from "@/features/tasks/schema"

export type TaskFormMode = "create" | "edit"

type TaskFormProps =
  | { mode: "create"; task?: never; onSuccess?: () => void }
  | { mode: "edit"; task: Task; onSuccess?: () => void }

type TaskFormState = {
  error: "required" | "tooLong" | "past" | "request" | null
}

export function TaskForm(props: TaskFormProps) {
  const { mode, onSuccess } = props
  const task = mode === "edit" ? props.task : undefined
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const initialDueAt = toDateTimeLocal(task?.due_at ?? null)
  const [state, formAction, pending] = useActionState<TaskFormState, FormData>(
    async (_previous, formData) => {
      const dueAtValue = String(formData.get("dueAt") ?? "")
      const scheduleChanged = mode === "create" || dueAtValue !== initialDueAt
      const parsed = taskSchema.safeParse({
        title: formData.get("title"),
        dueAt: scheduleChanged ? dueAtValue : "",
      })
      if (!parsed.success) {
        const issue = parsed.error.issues[0]
        if (issue.message === "PAST_SCHEDULE") return { error: "past" }
        return { error: issue.code === "too_big" ? "tooLong" : "required" }
      }

      const dueAt = parsed.data.dueAt
        ? new Date(parsed.data.dueAt).toISOString()
        : null

      try {
        if (props.mode === "create") {
          await createTask(parsed.data.title, dueAt)
        } else {
          await updateTaskDetails(
            props.task.id,
            parsed.data.title,
            scheduleChanged ? dueAt : undefined
          )
        }
        await queryClient.invalidateQueries({ queryKey: tasksQueryKey })
        toast.success(t(`dashboard.${mode}.success`))
        onSuccess?.()
        return { error: null }
      } catch {
        return { error: "request" }
      }
    },
    { error: null }
  )

  const errorKey =
    state.error === "request"
      ? mode === "create"
        ? "createRequest"
        : "updateRequest"
      : state.error
  const submitLabel =
    mode === "create" ? t("dashboard.newTask") : t("dashboard.edit.save")
  const pendingLabel =
    mode === "create" ? t("dashboard.adding") : t("dashboard.edit.saving")

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor={`${mode}-task-title`}>{t("dashboard.taskForm.name")}</Label>
        <Input
          id={`${mode}-task-title`}
          name="title"
          autoFocus
          defaultValue={task?.title}
          maxLength={200}
          disabled={pending}
          aria-invalid={Boolean(state.error)}
          placeholder={t("dashboard.addPlaceholder")}
          className="h-12 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] px-4 text-base"
        />
      </div>

      <TaskScheduleFields
        idPrefix={`${mode}-task-due`}
        defaultDueAt={task?.due_at}
        disabled={pending}
        invalid={Boolean(state.error)}
        preserveInitialTime={mode === "edit"}
        showLabels
        className="gap-3"
      />

      {errorKey && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl bg-destructive/8 px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          {t(`dashboard.taskForm.error.${errorKey}`)}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-[#3146c8] text-white shadow-[0_12px_24px_rgba(49,70,200,0.2)] hover:bg-[#2639ad]"
      >
        {pending ? (
          <Spinner />
        ) : mode === "create" ? (
          <Plus className="size-4" />
        ) : (
          <Save className="size-4" />
        )}
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  )
}
