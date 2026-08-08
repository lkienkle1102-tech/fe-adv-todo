import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { UserMenu } from "@/features/auth/components/user-menu"

const meta: Meta<typeof UserMenu> = {
  title: "features/auth/UserMenu",
  component: UserMenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { username: "Nguyễn Minh Anh" },
}

export default meta
type Story = StoryObj<typeof UserMenu>

export const Default: Story = {}
