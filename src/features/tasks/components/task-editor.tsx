"use client"

import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import type { Task } from "@/features/tasks/api"
import {
  TaskForm,
} from "@/features/tasks/components/task-form"
import { useTask } from "@/features/tasks/hooks/use-tasks"

type TaskEditorProps =
  | { mode: "create"; taskId?: never; initialTask?: never; onSuccess?: () => void }
  | { mode: "edit"; taskId: string; initialTask?: Task; onSuccess?: () => void }

export function TaskEditor(props: TaskEditorProps) {
  const { mode, onSuccess } = props
  const { t } = useTranslation()
  const taskQuery = useTask(
    mode === "edit" ? props.taskId : "",
    mode === "edit" ? props.initialTask : undefined
  )

  if (mode === "create") {
    return <TaskForm mode="create" onSuccess={onSuccess} />
  }

  if (taskQuery.isLoading) {
    return (
      <div className="grid min-h-48 place-items-center" aria-live="polite">
        <Spinner className="size-6 text-[#3146c8]" />
      </div>
    )
  }

  if (taskQuery.isError || !taskQuery.data) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center text-center">
        <AlertCircle className="size-7 text-destructive" />
        <p className="mt-3 text-sm font-bold">{t("dashboard.edit.loadError")}</p>
        <Button variant="outline" className="mt-4" onClick={() => taskQuery.refetch()}>
          {t("dashboard.retry")}
        </Button>
      </div>
    )
  }

  return <TaskForm mode="edit" task={taskQuery.data} onSuccess={onSuccess} />
}
