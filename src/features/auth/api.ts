import { apiClient } from "@/core/api-client"

// Placeholder: goi /auth/jwt/login, /auth/register (fastapi-users) se them sau.
export async function login(email: string, password: string) {
  const form = new URLSearchParams({ username: email, password })
  const { data } = await apiClient.post("/auth/jwt/login", form)
  return data
}
