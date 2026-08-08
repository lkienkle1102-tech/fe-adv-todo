import { apiClient } from "@/core/api-client"

export type Task = {
  id: string
  title: string
  is_done: boolean
  due_at: string | null
}

export async function listTasks(): Promise<Task[]> {
  const { data } = await apiClient.get("/tasks")
  return data
}

export async function createTask(title: string, dueAt: string | null): Promise<Task> {
  const { data } = await apiClient.post("/tasks", { title, due_at: dueAt })
  return data
}

export async function updateTask(id: string, isDone: boolean): Promise<Task> {
  const { data } = await apiClient.patch(`/tasks/${id}`, { is_done: isDone })
  return data
}

export async function updateTaskSchedule(id: string, dueAt: string | null): Promise<Task> {
  const { data } = await apiClient.patch(`/tasks/${id}`, { due_at: dueAt })
  return data
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`)
}
