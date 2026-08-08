import { create } from "zustand"

import type {
  SortDirection,
  TaskQuery,
  TaskSortBy,
  TaskStatusFilter,
} from "@/features/tasks/api"

export const defaultTaskQuery: TaskQuery = {
  page: 1,
  pageSize: 10,
  search: "",
  status: "all",
  sortBy: "due_at",
  sortDirection: "asc",
  dueFrom: "",
  dueTo: "",
}

type TaskFilterInput = {
  search: string
  sortBy: TaskSortBy
  sortDirection: SortDirection
  pageSize: number
  dueFrom: string
  dueTo: string
}

type TasksUiState = {
  query: TaskQuery
  setStatus: (status: TaskStatusFilter) => void
  setPage: (page: number) => void
  applyFilters: (filters: TaskFilterInput) => void
  resetFilters: () => void
}

export const useTasksStore = create<TasksUiState>((set) => ({
  query: defaultTaskQuery,
  setStatus: (status) => set((state) => ({ query: { ...state.query, status, page: 1 } })),
  setPage: (page) => set((state) => ({ query: { ...state.query, page } })),
  applyFilters: (filters) =>
    set((state) => ({ query: { ...state.query, ...filters, page: 1 } })),
  resetFilters: () =>
    set((state) => ({ query: { ...defaultTaskQuery, status: state.query.status } })),
}))
