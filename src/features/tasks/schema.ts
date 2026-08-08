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
