import xior, { type XiorError } from "xior"

import { AUTH_UNAUTHORIZED_EVENT } from "@/features/auth/session-events"
import { useLocaleStore } from "@/features/i18n/store"

export const apiClient = xior.create({
  baseURL: "/api/backend",
})

apiClient.interceptors.request.use((config) => {
  const locale = useLocaleStore.getState().locale
  config.headers = {
    ...config.headers,
    "Accept-Language": locale,
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: XiorError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
    }
    return Promise.reject(error)
  }
)
