"use client"

import { useActionState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  ListChecks,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { UserMenu } from "@/features/auth/components/user-menu"
import { useAuthStore } from "@/features/auth/store"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { createTask, type Task } from "@/features/tasks/api"
import { TaskScheduleControl } from "@/features/tasks/components/task-schedule-control"
import {
  tasksQueryKey,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "@/features/tasks/hooks/use-tasks"
import { taskSchema } from "@/features/tasks/schema"
import { getTaskScheduleState } from "@/features/tasks/schedule"
import { TaskScheduleFields } from "@/features/tasks/components/task-schedule-fields"
import { useTasksStore } from "@/features/tasks/store"

type TaskFormState = { error: "required" | "tooLong" | "past" | "request" | null }

const FILTERS = ["all", "active", "done"] as const

export function TaskList({ initialTasks }: { initialTasks?: Task[] }) {
  const { t } = useTranslation()
  const username = useAuthStore((state) => state.user?.username)
  const filter = useTasksStore((state) => state.filter)
  const setFilter = useTasksStore((state) => state.setFilter)
  const queryClient = useQueryClient()
  const tasksQuery = useTasks(initialTasks)
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  const [formState, formAction, isCreating] = useActionState<TaskFormState, FormData>(
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
        return { error: null }
      } catch {
        return { error: "request" }
      }
    },
    { error: null }
  )

  const tasks = tasksQuery.data ?? []
  const completed = tasks.filter((task) => task.is_done).length
  const dueToday = tasks.filter(
    (task) => !task.is_done && getTaskScheduleState(task.due_at) === "today"
  ).length
  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.is_done
    if (filter === "done") return task.is_done
    return true
  })
  const mutationFailed = updateMutation.isError || deleteMutation.isError

  const stats = [
    { key: "total", value: tasks.length, icon: ListChecks },
    { key: "completed", value: completed, icon: CheckCircle2 },
    { key: "dueToday", value: dueToday, icon: CalendarDays },
  ] as const

  return (
    <div className="min-h-screen bg-[#f6f8ff] text-[#172033]">
      <header className="border-b border-[#e0e5f2] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 pr-20 lg:px-10 lg:pr-24">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#3146c8] text-white shadow-[0_8px_24px_rgba(49,70,200,0.22)]">
              <Check className="size-5 stroke-[2.5]" />
            </span>
            <p className="text-sm font-black tracking-[-0.02em]">
              ADV<span className="text-[#5267e0]">.TODO</span>
            </p>
          </div>
          <UserMenu username={username} />
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl overflow-hidden px-6 py-10 lg:px-10 lg:py-14">
        <div aria-hidden className="pointer-events-none absolute top-0 right-0 size-80 rounded-full bg-[#b9efff]/35 blur-3xl" />

        <section className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Badge className="mb-5 rounded-full border border-[#d6ddff] bg-white px-3 py-1.5 text-[#4054c7] shadow-sm">
              <Sparkles className="size-3.5" />
              {t("dashboard.eyebrow")}
            </Badge>
            <h1 className="max-w-3xl text-[clamp(2.7rem,6vw,5.2rem)] leading-[0.94] font-black tracking-[-0.065em]">
              {t("dashboard.greeting")}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#697389] sm:text-lg">
              {t("dashboard.description")}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white bg-[#18213a] p-6 text-white shadow-[0_24px_60px_rgba(24,33,58,0.17)] sm:p-7">
            <p className="text-xs font-bold tracking-[0.16em] text-white/55 uppercase">
              {t("dashboard.overview")}
            </p>
            <div className="mt-7 grid grid-cols-3 divide-x divide-white/10">
              {stats.map(({ key, value, icon: Icon }) => (
                <div key={key} className="px-3 first:pl-0 last:pr-0">
                  <Icon className="mb-4 size-4 text-[#77def7]" />
                  <p className="font-mono text-3xl font-bold">{value}</p>
                  <p className="mt-1 text-xs leading-4 text-white/55">{t(`dashboard.${key}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-10 rounded-[2rem] border border-[#dfe4f1] bg-white p-6 shadow-[0_18px_50px_rgba(40,54,113,0.08)] sm:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.035em] sm:text-3xl">{t("dashboard.taskTitle")}</h2>
              <p className="mt-1 text-sm text-[#7a8397]">{t("dashboard.taskDescription")}</p>
            </div>
            <form action={formAction} noValidate className="grid w-full max-w-3xl gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(18rem,auto)_auto]">
              <Input
                name="title"
                aria-label={t("dashboard.addPlaceholder")}
                aria-invalid={Boolean(formState.error)}
                placeholder={t("dashboard.addPlaceholder")}
                maxLength={200}
                disabled={isCreating}
                className="h-11 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] px-4"
              />
              <TaskScheduleFields idPrefix="new-task-due" disabled={isCreating} />
              <Button type="submit" disabled={isCreating} className="h-11 shrink-0 rounded-xl bg-[#3146c8] px-4 text-white hover:bg-[#2639ad]">
                {isCreating ? <Spinner /> : <Plus className="size-4" />}
                <span className="hidden sm:inline">{isCreating ? t("dashboard.adding") : t("dashboard.newTask")}</span>
              </Button>
            </form>
          </div>

          {formState.error && (
            <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-destructive lg:justify-end">
              <AlertCircle className="size-4" />
              {t(`dashboard.formError.${formState.error}`)}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-2" aria-label={t("dashboard.filterLabel")}>
            {FILTERS.map((value) => (
              <Button
                key={value}
                type="button"
                variant={filter === value ? "default" : "outline"}
                size="sm"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={filter === value ? "bg-[#18213a] text-white hover:bg-[#26304b]" : "border-[#dfe4ef]"}
              >
                {t(`dashboard.filter.${value}`)}
              </Button>
            ))}
          </div>

          {mutationFailed && (
            <p role="alert" className="mt-5 rounded-xl bg-destructive/8 px-4 py-3 text-sm text-destructive">
              {t("dashboard.actionError")}
            </p>
          )}

          {tasksQuery.isLoading ? (
            <div className="grid min-h-64 place-items-center" aria-live="polite">
              <Spinner className="size-6 text-[#3146c8]" />
            </div>
          ) : tasksQuery.isError ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <AlertCircle className="size-8 text-destructive" />
              <p className="mt-3 font-bold">{t("dashboard.loadError")}</p>
              <Button variant="outline" className="mt-4" onClick={() => tasksQuery.refetch()}>{t("dashboard.retry")}</Button>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#eef1ff] text-[#3146c8]"><ListChecks className="size-6" /></span>
              <h3 className="mt-5 text-xl font-black tracking-[-0.025em]">{t(filter === "all" ? "dashboard.emptyTitle" : "dashboard.filterEmpty")}</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[#727c91]">{t("dashboard.emptyDescription")}</p>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-[#e8ebf3]" aria-live="polite">
              {visibleTasks.map((task) => (
                <li key={task.id} className="group flex items-center gap-4 py-4 first:pt-2">
                  <Checkbox
                    checked={task.is_done}
                    disabled={updateMutation.isPending}
                    aria-label={`${t("dashboard.toggleTask")}: ${task.title}`}
                    onCheckedChange={(checked) => updateMutation.mutate({ id: task.id, isDone: checked === true })}
                    className="size-5 rounded-md data-checked:border-[#3146c8] data-checked:bg-[#3146c8]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[15px] font-medium ${task.is_done ? "text-[#8b94a8] line-through" : "text-[#26304b]"}`}>
                      {task.title}
                    </p>
                    <TaskScheduleControl task={task} />
                  </div>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={deleteMutation.isPending}
                    aria-label={`${t("dashboard.deleteTask")}: ${task.title}`}
                    onClick={() => deleteMutation.mutate(task.id)}
                    className="text-[#8b94a8] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
