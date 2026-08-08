import type { ReactNode } from "react"

export default function TasksLayout({
  children,
  taskModal,
}: {
  children: ReactNode
  taskModal: ReactNode
}) {
  return (
    <>
      {children}
      {taskModal}
    </>
  )
}
