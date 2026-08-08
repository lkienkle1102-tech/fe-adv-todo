"use client"

import { useActionState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import { listTasks, type TaskQuery } from "@/features/tasks/api"
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks"
import { taskFilterSchema } from "@/features/tasks/schema"
import { toDateTimeLocal } from "@/features/tasks/schedule"
import { useTasksStore } from "@/features/tasks/store"

type FilterFormState = {
  error: "rangeOrder" | "invalid" | null
}

export function TaskQueryControls({ query }: { query: TaskQuery }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const applyFilters = useTasksStore((state) => state.applyFilters)
  const resetFilters = useTasksStore((state) => state.resetFilters)
  const [state, formAction, pending] = useActionState<FilterFormState, FormData>(
    async (_previous, formData) => {
      const parsed = taskFilterSchema.safeParse({
        search: formData.get("search"),
        dueFrom: formData.get("dueFrom"),
        dueTo: formData.get("dueTo"),
        sortBy: formData.get("sortBy"),
        sortDirection: formData.get("sortDirection"),
        pageSize: formData.get("pageSize"),
      })
      if (!parsed.success) {
        const message = parsed.error.issues[0]?.message
        if (message === "RANGE_ORDER") return { error: "rangeOrder" }
        return { error: "invalid" }
      }
      const filters = {
        ...parsed.data,
        dueFrom: parsed.data.dueFrom
          ? new Date(parsed.data.dueFrom).toISOString()
          : "",
        dueTo: parsed.data.dueTo ? new Date(parsed.data.dueTo).toISOString() : "",
      }
      const nextQuery = { ...query, ...filters, page: 1 }
      applyFilters(filters)
      await queryClient
        .fetchQuery({
          queryKey: [...tasksQueryKey, nextQuery],
          queryFn: () => listTasks(nextQuery),
        })
        .catch(() => undefined)
      return { error: null }
    },
    { error: null }
  )

  return (
    <form
      key={`${query.search}:${query.dueFrom}:${query.dueTo}:${query.sortBy}:${query.sortDirection}:${query.pageSize}`}
      action={formAction}
      noValidate
      aria-busy={pending}
      className="mt-5 rounded-2xl border border-[#e3e7f2] bg-[#f8f9fc] p-4"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#35405a]">
        <SlidersHorizontal className="size-4 text-[#5267e0]" />
        {t("dashboard.query.title")}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(13rem,1.25fr)_minmax(11rem,1fr)_minmax(11rem,1fr)_minmax(8rem,.7fr)_minmax(7rem,.55fr)_minmax(6rem,.45fr)]">
        <label className="grid gap-1.5 text-xs font-semibold text-[#697389]">
          {t("dashboard.query.search")}
          <Input
            name="search"
            defaultValue={query.search}
            maxLength={200}
            placeholder={t("dashboard.query.searchPlaceholder")}
            className="h-10 bg-white"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[#697389]">
          {t("dashboard.query.from")}
          <Input
            name="dueFrom"
            type="datetime-local"
            defaultValue={query.dueFrom ? toDateTimeLocal(query.dueFrom) : ""}
            className="h-10 bg-white"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[#697389]">
          {t("dashboard.query.to")}
          <Input
            name="dueTo"
            type="datetime-local"
            defaultValue={query.dueTo ? toDateTimeLocal(query.dueTo) : ""}
            className="h-10 bg-white"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[#697389]">
          {t("dashboard.query.sortBy")}
          <select name="sortBy" defaultValue={query.sortBy} className="h-10 rounded-md border border-input bg-white px-3 text-sm">
            <option value="due_at">{t("dashboard.query.dueAt")}</option>
            <option value="title">{t("dashboard.query.name")}</option>
            <option value="status">{t("dashboard.query.status")}</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[#697389]">
          {t("dashboard.query.direction")}
          <select name="sortDirection" defaultValue={query.sortDirection} className="h-10 rounded-md border border-input bg-white px-3 text-sm">
            <option value="asc">{t("dashboard.query.asc")}</option>
            <option value="desc">{t("dashboard.query.desc")}</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-[#697389]">
          {t("dashboard.query.pageSize")}
          <select name="pageSize" defaultValue={query.pageSize} className="h-10 rounded-md border border-input bg-white px-3 text-sm">
            {[5, 10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
        {state.error && (
          <p role="alert" className="mr-auto text-sm text-destructive">
            {t(`dashboard.query.error.${state.error}`)}
          </p>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="size-4" />{t("dashboard.query.reset")}
          </Button>
          <Button type="submit" size="sm" disabled={pending} className="bg-[#3146c8] text-white hover:bg-[#2639ad] disabled:opacity-100">
            <Search className="size-4" />
            {t(pending ? "dashboard.query.applying" : "dashboard.query.apply")}
          </Button>
        </div>
      </div>
    </form>
  )
}
