import { TaskPage } from "@/features/tasks/components/task-page"

export default async function TaskEditPage({
  params,
}: {
  params: Promise<{ taskId: string }>
}) {
  const { taskId } = await params
  return <TaskPage mode="edit" taskId={taskId} />
}
