"use client"

import { useMutation } from "@tanstack/react-query"

import { register } from "@/features/auth/api"

export function useRegister() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      register(email, password),
  })
}
