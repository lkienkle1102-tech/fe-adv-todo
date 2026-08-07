import { isXiorError } from "xior"

export function getAuthErrorMessage(error: unknown): string {
  if (isXiorError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === "string") return detail
    if (Array.isArray(detail)) return detail.map((d) => d.msg ?? d.reason).join(", ")
    if (detail?.reason) return detail.reason
  }
  return "Đã có lỗi xảy ra. Vui lòng thử lại."
}
