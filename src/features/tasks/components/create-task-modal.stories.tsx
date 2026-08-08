import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"

import { CreateTaskModal } from "@/features/tasks/components/create-task-modal"

const meta: Meta<typeof CreateTaskModal> = {
  title: "features/tasks/CreateTaskModal",
  component: CreateTaskModal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const screen = within(canvasElement.ownerDocument.body)
    await expect(screen.getByRole("dialog")).toBeInTheDocument()
    await expect(screen.getByRole("heading", { name: "Thêm công việc" })).toBeInTheDocument()
    await expect(screen.getByLabelText("Tên công việc")).toBeInTheDocument()
    await expect(screen.getByLabelText("Ngày đến hạn")).toBeInTheDocument()
    await expect(screen.getByLabelText("Giờ đến hạn")).toBeInTheDocument()
  },
}
