import { notFound } from "next/navigation"

import { TaskPage } from "@/features/tasks/components/task-page"
import { getTaskIdFromSearchParams } from "@/features/tasks/route"

export default async function TaskEditPage({
  searchParams,
}: {
  searchParams: Promise<{ taskId?: string | string[] }>
}) {
  const taskId = getTaskIdFromSearchParams(await searchParams)
  if (!taskId) notFound()
  return <TaskPage mode="edit" taskId={taskId} />
}
