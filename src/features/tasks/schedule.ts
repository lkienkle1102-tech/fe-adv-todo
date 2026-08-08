export type TaskScheduleState = "unscheduled" | "today" | "overdue" | "upcoming"

export function getTaskScheduleState(
  dueAt: string | null,
  now = new Date()
): TaskScheduleState {
  if (!dueAt) return "unscheduled"

  const due = new Date(dueAt)
  const isToday =
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate()

  if (isToday) return "today"
  if (due.getTime() < now.getTime()) return "overdue"
  return "upcoming"
}

export function formatTaskDueAt(dueAt: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dueAt))
}

export function toDateTimeLocal(dueAt: string | null): string {
  if (!dueAt) return ""
  const date = new Date(dueAt)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 16)
}

export function getMinimumScheduleDateTimeLocal(now = new Date()): string {
  const nextMinute = new Date((Math.floor(now.getTime() / 60_000) + 1) * 60_000)
  return toDateTimeLocal(nextMinute.toISOString())
}

export function getScheduleTimeOptions(
  dateValue: string,
  now = new Date()
): string[] {
  if (!dateValue) return []

  return Array.from({ length: 96 }, (_, index) => {
    const hour = Math.floor(index / 4).toString().padStart(2, "0")
    const minute = ((index % 4) * 15).toString().padStart(2, "0")
    return `${hour}:${minute}`
  }).filter((timeValue) => new Date(`${dateValue}T${timeValue}`).getTime() > now.getTime())
}
