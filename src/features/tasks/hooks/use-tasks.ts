"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  deleteTask,
  listTasks,
  type TaskPage,
  type TaskQuery,
  updateTask,
} from "@/features/tasks/api"

export const tasksQueryKey = ["tasks"] as const

export function useTasks(query: TaskQuery, initialData?: TaskPage) {
  return useQuery({
    queryKey: [...tasksQueryKey, query],
    queryFn: () => listTasks(query),
    initialData,
    enabled: initialData === undefined,
    placeholderData: (previousData) => previousData,
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
