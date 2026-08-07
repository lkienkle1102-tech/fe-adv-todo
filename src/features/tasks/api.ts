import { apiClient } from "@/core/api-client"

export type Task = { id: string; title: string; is_done: boolean }

// Placeholder: endpoint /tasks thuc te se them sau.
export async function listTasks(): Promise<Task[]> {
  const { data } = await apiClient.get("/tasks")
  return data
}
