"use client"

import { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"

import { makeQueryClient } from "@/core/query-client"

// QueryClientProvider dung Context noi bo cua react-query (thu vien thu 3) - mien tru
// khoi luat cam Context. Khong tu tao Context nao khac ngoai day.
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient)

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
