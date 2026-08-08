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
    await expect(canvas.getByLabelText("Ngày đến hạn")).toHaveAttribute("min", today)
    await userEvent.keyboard("{Escape}")
    await expect(scheduleTrigger).toHaveAttribute("data-state", "closed")
    await userEvent.click(canvas.getByRole("button", { name: "Đang làm" }))
    await expect(canvas.getByText("Review the launch checklist")).toBeVisible()
    await expect(canvas.queryByText("Send the weekly progress note")).not.toBeInTheDocument()
  },
}
