import { create } from "zustand"

import type { AuthUser } from "@/features/auth/api"

type AuthState = {
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (user: AuthState["user"]) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}))
