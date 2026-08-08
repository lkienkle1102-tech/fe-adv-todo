import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"

import { TaskModal } from "@/features/tasks/components/task-modal"

type TaskModalStoryProps = {
  mode: "create" | "edit"
}

function TaskModalStory({ mode }: TaskModalStoryProps) {
  if (mode === "create") return <TaskModal mode="create" />

  return (
    <TaskModal
      mode="edit"
      taskId="edit-story-task"
      initialTask={{
        id: "edit-story-task",
        title: "Chuẩn bị bản kế hoạch tuần",
        is_done: false,
        due_at: "2030-08-09T01:00:00.000Z",
      }}
    />
  )
}

const meta: Meta<typeof TaskModalStory> = {
  title: "features/tasks/TaskModal",
  component: TaskModalStory,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

function getVisibleModal(canvasElement: HTMLElement) {
  const screen = within(canvasElement.ownerDocument.body)
  const dialog = screen
    .getAllByRole("dialog")
    .find((element) => element.getClientRects().length > 0)
  if (!dialog) throw new Error("Visible task dialog was not found")
  return within(dialog)
}

export const Create: Story = {
  args: { mode: "create" },
  play: async ({ canvasElement }) => {
    const modal = getVisibleModal(canvasElement)
    await expect(
      modal.getByRole("heading", { name: "Thêm công việc" })
    ).toBeInTheDocument()
    await expect(modal.getByLabelText("Tên công việc")).toHaveValue("")
    await expect(
      modal.getByRole("button", { name: "Thêm công việc" })
    ).toBeInTheDocument()
  },
}

export const Edit: Story = {
  args: { mode: "edit" },
  play: async ({ canvasElement }) => {
    const modal = getVisibleModal(canvasElement)
    await expect(
      modal.getByRole("heading", { name: "Chỉnh sửa công việc" })
    ).toBeInTheDocument()
    await expect(modal.getByLabelText("Tên công việc")).toHaveValue(
      "Chuẩn bị bản kế hoạch tuần"
    )
    await expect(
      modal.getByRole("button", { name: "Lưu thay đổi" })
    ).toBeInTheDocument()
  },
}
