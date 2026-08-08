import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { RegisterForm } from "@/features/auth/components/register-form"

const meta: Meta<typeof RegisterForm> = {
  title: "features/auth/RegisterForm",
  component: RegisterForm,
  parameters: {
    layout: "centered",
    backgrounds: { default: "auth" },
  },
}

export default meta
type Story = StoryObj<typeof RegisterForm>

export const Default: Story = {}
