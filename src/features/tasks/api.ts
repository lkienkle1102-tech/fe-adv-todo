import { apiClient } from "@/core/api-client"

export type Task = {
  id: string
  title: string
  is_done: boolean
  due_at: string | null
}

export type TaskStatusFilter = "all" | "active" | "done" | "upcoming"
export type TaskSortBy = "title" | "due_at" | "status"
export type SortDirection = "asc" | "desc"

export type TaskQuery = {
  page: number
  pageSize: number
  search: string
  status: TaskStatusFilter
  sortBy: TaskSortBy
  sortDirection: SortDirection
  dueFrom: string
  dueTo: string
}

export type TaskPage = {
  items: Task[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export async function listTasks(query: TaskQuery): Promise<TaskPage> {
  const params = new URLSearchParams({
    page: String(query.page),
    page_size: String(query.pageSize),
    status: query.status,
    sort_by: query.sortBy,
    sort_direction: query.sortDirection,
  })
  if (query.search) params.set("search", query.search)
  if (query.dueFrom) params.set("due_from", query.dueFrom)
  if (query.dueTo) params.set("due_to", query.dueTo)
  const { data } = await apiClient.get(`/tasks?${params.toString()}`)
  return data
}

export async function createTask(title: string, dueAt: string | null): Promise<Task> {
  const { data } = await apiClient.post("/tasks", { title, due_at: dueAt })
  return data
}

export async function getTask(id: string): Promise<Task> {
  const { data } = await apiClient.get(`/tasks/${id}`)
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

export async function updateTaskDetails(
  id: string,
  title: string,
  dueAt?: string | null
): Promise<Task> {
  const payload: { title: string; due_at?: string | null } = { title }
  if (dueAt !== undefined) payload.due_at = dueAt
  const { data } = await apiClient.patch(`/tasks/${id}`, payload)
  return data
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`)
}
