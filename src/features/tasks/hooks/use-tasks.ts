"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  deleteTask,
  listTasks,
  type Task,
  updateTask,
} from "@/features/tasks/api"

export const tasksQueryKey = ["tasks"] as const

export function useTasks(initialData?: Task[]) {
  return useQuery({
    queryKey: tasksQueryKey,
    queryFn: listTasks,
    initialData,
    enabled: initialData === undefined,
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      updateTask(id, isDone),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
  })
}
