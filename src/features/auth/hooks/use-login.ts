"use client"

import { useMutation } from "@tanstack/react-query"

import { login } from "@/features/auth/api"
import { useAuthStore } from "@/features/auth/store"

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data, variables) => {
      setAuth({ id: "", email: variables.email }, data.access_token)
    },
  })
}
