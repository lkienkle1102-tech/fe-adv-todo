import xior from "xior"

import { useAuthStore } from "@/features/auth/store"
import { useLocaleStore } from "@/features/i18n/store"

export const apiClient = xior.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  const locale = useLocaleStore.getState().locale
  config.headers = {
    ...config.headers,
    "Accept-Language": locale,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  return config
})
