"use client"

import { useMutation } from "@tanstack/react-query"

import { fetchCurrentUser, login } from "@/features/auth/api"
import { useAuthStore } from "@/features/auth/store"

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { access_token } = await login(email, password)
      useAuthStore.setState({ accessToken: access_token })
      const user = await fetchCurrentUser()
      return { user, access_token }
    },
    onSuccess: ({ user, access_token }) => {
      setAuth(user, access_token)
    },
    onError: () => {
      useAuthStore.setState({ accessToken: null })
    },
  })
}
