import { z } from "zod"

const scheduleInputSchema = z.string().superRefine((value, context) => {
  if (value === "") return

  const dueAt = new Date(value)
  if (Number.isNaN(dueAt.getTime())) {
    context.addIssue({ code: "custom", message: "INVALID_SCHEDULE" })
  } else if (dueAt.getTime() <= Date.now()) {
    context.addIssue({ code: "custom", message: "PAST_SCHEDULE" })
  }
})

export const taskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  dueAt: scheduleInputSchema,
})

export const taskScheduleSchema = z.object({
  dueAt: scheduleInputSchema,
})

export const taskFilterSchema = z
  .object({
    search: z.string().trim().max(200),
    dueFrom: z.string(),
    dueTo: z.string(),
    sortBy: z.enum(["title", "due_at", "status"]),
    sortDirection: z.enum(["asc", "desc"]),
    pageSize: z.coerce.number().int().min(5).max(100),
  })
  .superRefine((value, context) => {
    if (Boolean(value.dueFrom) !== Boolean(value.dueTo)) {
      context.addIssue({ code: "custom", message: "RANGE_REQUIRED" })
      return
    }
    if (!value.dueFrom || !value.dueTo) return

    const from = new Date(value.dueFrom)
    const to = new Date(value.dueTo)
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      context.addIssue({ code: "custom", message: "INVALID_RANGE" })
    } else if (from.getTime() >= to.getTime()) {
      context.addIssue({ code: "custom", message: "RANGE_ORDER" })
    }
  })
