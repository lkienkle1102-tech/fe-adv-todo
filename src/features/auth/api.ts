import { apiClient } from "@/core/api-client"

export type AuthUser = {
  id: string
  username: string
  email: string
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
}

export type LoginResponse = {
  access_token: string
  token_type: string
}

export async function login(email: string, password: string) {
  const form = new URLSearchParams({ username: email, password })
  const { data } = await apiClient.post<LoginResponse>("/auth/jwt/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
  return data
}

export async function register(username: string, email: string, password: string) {
  const { data } = await apiClient.post<AuthUser>("/auth/register", {
    username,
    email,
    password,
  })
  return data
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<AuthUser>("/auth/users/me")
  return data
}
