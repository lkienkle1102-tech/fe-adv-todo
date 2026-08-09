import "server-only"

const DEFAULT_BACKEND_URL = "http://localhost:8000"

function normalizeBackendUrl(value: string): string {
  const url = new URL(value)

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("BACKEND_URL must use http or https")
  }

  return url.toString().replace(/\/+$/, "")
}

export const BACKEND_URL = normalizeBackendUrl(
  process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_BACKEND_URL
)
