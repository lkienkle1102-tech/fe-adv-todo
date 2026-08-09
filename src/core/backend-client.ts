import "server-only"

import xior from "xior"

import { BACKEND_URL } from "@/core/backend-url"

export const backendClient = xior.create({
  baseURL: BACKEND_URL,
  validateResponse: () => true,
})
