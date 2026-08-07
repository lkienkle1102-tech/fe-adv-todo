import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { LoginForm } from "@/features/auth/components/login-form"

const meta: Meta<typeof LoginForm> = {
  title: "features/auth/LoginForm",
  component: LoginForm,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof LoginForm>

export const Default: Story = {}
