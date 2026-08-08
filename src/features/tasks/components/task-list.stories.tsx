import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fireEvent, userEvent, within } from "storybook/test"

import { TaskList } from "@/features/tasks/components/task-list"
import { toDateTimeLocal } from "@/features/tasks/schedule"

const meta: Meta<typeof TaskList> = {
  title: "features/tasks/TaskList",
  component: TaskList,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof TaskList>

export const EmptyWorkspace: Story = {
  args: { initialTasks: [] },
}

export const WithTasks: Story = {
  args: {
    initialTasks: [
      { id: "1", title: "Review the launch checklist", is_done: false, due_at: null },
      {
        id: "2",
        title: "Send the weekly progress note",
        is_done: true,
        due_at: new Date(Date.now() - 86_400_000).toISOString(),
      },
      {
        id: "3",
        title: "Prepare tomorrow's focus block",
        is_done: false,
        due_at: new Date(Date.now() + 86_400_000).toISOString(),
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText("Review the launch checklist")).toBeVisible()
    await expect(canvas.getByText("Send the weekly progress note")).toBeVisible()
    await expect(canvas.getByRole("link", { name: "Thêm công việc" })).toBeVisible()
    await expect(
      canvas.getByRole("link", { name: "Chỉnh sửa công việc: Review the launch checklist" })
    ).toHaveAttribute("href", "/vi/tasks/edit?taskId=1")
    const scheduleTrigger = canvas.getByRole("button", {
      name: "Chỉnh sửa lịch: Review the launch checklist",
    })
    await userEvent.click(scheduleTrigger)
    await expect(scheduleTrigger).toHaveAttribute("data-state", "open")
    const now = new Date()
    const today = toDateTimeLocal(now.toISOString()).slice(0, 10)
    const dateInput = canvasElement.ownerDocument.getElementById("task-due-1-date")
    const timeSelect = canvasElement.ownerDocument.getElementById("task-due-1-time")
    await expect(dateInput).toHaveAttribute("min", today)
    await expect(timeSelect).toBeDisabled()
    await fireEvent.change(dateInput as HTMLInputElement, { target: { value: today } })
    const availableTimes = Array.from((timeSelect as HTMLSelectElement).options)
      .map((option) => option.value)
      .filter(Boolean)
    await expect(
      availableTimes.every(
        (time) => new Date(`${today}T${time}`).getTime() > now.getTime()
      )
    ).toBe(true)
    await userEvent.keyboard("{Escape}")
    await expect(scheduleTrigger).toHaveAttribute("data-state", "closed")
    await expect(canvas.getByRole("button", { name: "Chưa tới hạn" })).toBeVisible()

    const fromInput = canvas.getByLabelText("Đến hạn từ")
    const toInput = canvas.getByLabelText("Đến hạn đến")
    await fireEvent.change(fromInput, { target: { value: "2026-08-10T10:00" } })
    await fireEvent.change(toInput, { target: { value: "2026-08-09T10:00" } })
    await userEvent.click(canvas.getByRole("button", { name: "Áp dụng" }))
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Thời điểm bắt đầu phải sớm hơn thời điểm kết thúc."
    )
  },
}

export const PaginatedWorkspace: Story = {
  args: {
    initialTotal: 23,
    initialTasks: [
      { id: "page-1", title: "First result on this page", is_done: false, due_at: null },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("navigation", { name: "Các trang công việc" })).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Trang 2" })).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Trang 3" })).toBeVisible()
  },
}
