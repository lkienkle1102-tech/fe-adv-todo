"use client"

import { useEffect } from "react"
import {
  AlertCircle,
  Check,
  CircleCheck,
  CircleDashed,
  ListChecks,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { UserMenu } from "@/features/auth/components/user-menu"
import { useAuthStore } from "@/features/auth/store"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import type { Task } from "@/features/tasks/api"
import { TaskQueryControls } from "@/features/tasks/components/task-query-controls"
import { TaskScheduleControl } from "@/features/tasks/components/task-schedule-control"
import {
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "@/features/tasks/hooks/use-tasks"
import { useTasksStore } from "@/features/tasks/store"
import { Link } from "@/i18n/navigation"

const FILTERS = ["all", "active", "done", "upcoming"] as const

export function TaskList({
  initialTasks,
  initialTotal,
}: {
  initialTasks?: Task[]
  initialTotal?: number
}) {
  const { t } = useTranslation()
  const username = useAuthStore((state) => state.user?.username)
  const query = useTasksStore((state) => state.query)
  const setStatus = useTasksStore((state) => state.setStatus)
  const setPage = useTasksStore((state) => state.setPage)
  const initialPage = initialTasks
    ? {
        items: initialTasks,
        total: initialTotal ?? initialTasks.length,
        page: 1,
        page_size: query.pageSize,
        total_pages: Math.ceil((initialTotal ?? initialTasks.length) / query.pageSize),
        summary: {
          total: initialTotal ?? initialTasks.length,
          completed: initialTasks.filter((task) => task.is_done).length,
          incomplete: initialTasks.filter((task) => !task.is_done).length,
        },
        status_counts: {
          all: initialTotal ?? initialTasks.length,
          active: initialTasks.filter((task) => !task.is_done).length,
          done: initialTasks.filter((task) => task.is_done).length,
          upcoming: initialTasks.filter(
            (task) => !task.is_done && task.due_at && new Date(task.due_at) > new Date()
          ).length,
        },
      }
    : undefined
  const tasksQuery = useTasks(query, initialPage)
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  const pageData = tasksQuery.data
  const tasks = pageData?.items ?? []
  const mutationFailed = updateMutation.isError || deleteMutation.isError
  const showCountSkeletons = pageData === undefined && tasksQuery.isFetching

  useEffect(() => {
    if (pageData && pageData.total_pages > 0 && query.page > pageData.total_pages) {
      setPage(pageData.total_pages)
    }
  }, [pageData, query.page, setPage])

  const stats = [
    { key: "total", value: pageData?.summary.total, icon: ListChecks },
    { key: "completed", value: pageData?.summary.completed, icon: CircleCheck },
    { key: "incomplete", value: pageData?.summary.incomplete, icon: CircleDashed },
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
            <div
              className="mt-7 grid grid-cols-3 divide-x divide-white/10"
              aria-busy={showCountSkeletons}
            >
              {stats.map(({ key, value, icon: Icon }) => (
                <div key={key} className="px-3 first:pl-0 last:pr-0">
                  <Icon className="mb-4 size-4 text-[#77def7]" />
                  {showCountSkeletons ? (
                    <Skeleton className="h-9 w-12 bg-white/15" aria-hidden />
                  ) : (
                    <p className="font-mono text-3xl font-bold">{value ?? "—"}</p>
                  )}
                  <p className="mt-1 text-xs leading-4 text-white/55">{t(`dashboard.${key}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-10 rounded-[2rem] border border-[#dfe4f1] bg-white p-6 shadow-[0_18px_50px_rgba(40,54,113,0.08)] sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.035em] sm:text-3xl">{t("dashboard.taskTitle")}</h2>
              <p className="mt-1 text-sm text-[#7a8397]">{t("dashboard.taskDescription")}</p>
            </div>
            <Button asChild className="h-11 shrink-0 rounded-xl bg-[#3146c8] px-5 text-white hover:bg-[#2639ad]">
              <Link href="/tasks/create">
                <Plus className="size-4" />
                {t("dashboard.newTask")}
              </Link>
            </Button>
          </div>

          <div
            className="mt-8 flex flex-wrap gap-2"
            aria-label={t("dashboard.filterLabel")}
            aria-busy={showCountSkeletons}
          >
            {FILTERS.map((value) => (
              <Button
                key={value}
                type="button"
                variant={query.status === value ? "default" : "outline"}
                size="sm"
                aria-pressed={query.status === value}
                onClick={() => setStatus(value)}
                className={query.status === value ? "bg-[#18213a] text-white hover:bg-[#26304b]" : "border-[#dfe4ef]"}
              >
                {t(`dashboard.filter.${value}`)}
                {showCountSkeletons ? (
                  <Skeleton
                    className={query.status === value ? "h-5 w-6 rounded-full bg-white/15" : "h-5 w-6 rounded-full bg-[#dfe4ef]"}
                    aria-hidden
                  />
                ) : (
                  <Badge
                    variant="secondary"
                    className={query.status === value ? "bg-white/15 text-white" : "bg-[#eef1f8] text-[#526078]"}
                  >
                    {pageData?.status_counts[value] ?? "—"}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <TaskQueryControls query={query} />

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
          ) : tasks.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#eef1ff] text-[#3146c8]"><ListChecks className="size-6" /></span>
              <h3 className="mt-5 text-xl font-black tracking-[-0.025em]">{t(query.status === "all" && !query.search && !query.dueFrom ? "dashboard.emptyTitle" : "dashboard.filterEmpty")}</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[#727c91]">{t("dashboard.emptyDescription")}</p>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-[#e8ebf3]" aria-live="polite">
              {tasks.map((task) => (
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
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      asChild
                      size="icon-sm"
                      variant="ghost"
                      className="text-[#8b94a8] hover:bg-[#eef1ff] hover:text-[#3146c8]"
                    >
                      <Link
                        href={`/tasks/edit?taskId=${encodeURIComponent(task.id)}`}
                        aria-label={`${t("dashboard.editTask")}: ${task.title}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
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
                  </div>
                </li>
              ))}
            </ul>
          )}

          {pageData && pageData.total_pages > 1 && (
            <div className="mt-6 border-t border-[#e8ebf3] pt-5">
              <Pagination aria-label={t("dashboard.pagination.label")}>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={query.page <= 1}
                      onClick={() => setPage(query.page - 1)}
                    >
                      {t("dashboard.pagination.previous")}
                    </Button>
                  </PaginationItem>
                  {Array.from({ length: pageData.total_pages }, (_, index) => index + 1)
                    .filter((page) => page === 1 || page === pageData.total_pages || Math.abs(page - query.page) <= 1)
                    .map((page, index, pages) => (
                      <PaginationItem key={page} className="flex items-center">
                        {index > 0 && page - pages[index - 1] > 1 && <span className="px-2 text-[#8b94a8]">…</span>}
                        <Button
                          type="button"
                          variant={page === query.page ? "outline" : "ghost"}
                          size="icon-sm"
                          aria-current={page === query.page ? "page" : undefined}
                          aria-label={`${t("dashboard.pagination.page")} ${page}`}
                          onClick={() => setPage(page)}
                        >
                          {page}
                        </Button>
                      </PaginationItem>
                    ))}
                  <PaginationItem>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={query.page >= pageData.total_pages}
                      onClick={() => setPage(query.page + 1)}
                    >
                      {t("dashboard.pagination.next")}
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
