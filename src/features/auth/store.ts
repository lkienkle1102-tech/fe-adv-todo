import { create } from "zustand"

type AuthState = {
  user: { id: string; email: string } | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: AuthState["user"], accessToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}))
