import { create } from "zustand"

type TasksUiState = {
  filter: "all" | "active" | "done"
  setFilter: (filter: TasksUiState["filter"]) => void
}

export const useTasksStore = create<TasksUiState>((set) => ({
  filter: "all",
  setFilter: (filter) => set({ filter }),
}))
