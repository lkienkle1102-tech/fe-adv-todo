import { notFound } from "next/navigation"

import { TaskModal } from "@/features/tasks/components/task-modal"
import { getTaskIdFromSearchParams } from "@/features/tasks/route"

export default async function TaskEditInterceptedPage({
  searchParams,
}: {
  searchParams: Promise<{ taskId?: string | string[] }>
}) {
  const taskId = getTaskIdFromSearchParams(await searchParams)
  if (!taskId) notFound()
  return <TaskModal mode="edit" taskId={taskId} />
}
