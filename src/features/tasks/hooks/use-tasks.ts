"use client"

import { useQuery } from "@tanstack/react-query"

import { listTasks } from "@/features/tasks/api"

export function useTasks() {
  return useQuery({ queryKey: ["tasks"], queryFn: listTasks })
}
