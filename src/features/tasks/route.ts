export function getTaskIdFromSearchParams(searchParams: {
  taskId?: string | string[]
}): string | null {
  if (typeof searchParams.taskId !== "string") return null
  return searchParams.taskId.trim() || null
}
