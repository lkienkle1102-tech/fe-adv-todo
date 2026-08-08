import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { TaskList } from "@/features/tasks/components/task-list"

const meta: Meta<typeof TaskList> = {
  title: "features/tasks/EmptyDashboard",
  component: TaskList,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof TaskList>

export const EmptyWorkspace: Story = {}
