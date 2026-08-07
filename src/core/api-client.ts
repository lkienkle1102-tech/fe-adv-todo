import xior from "xior"

export const apiClient = xior.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
})
