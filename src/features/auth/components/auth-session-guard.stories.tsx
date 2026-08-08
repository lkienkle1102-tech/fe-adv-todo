import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, waitFor, within } from "storybook/test"

import { AuthSessionGuard } from "@/features/auth/components/auth-session-guard"
import { useAuthStore } from "@/features/auth/store"

const storyUser = {
  id: "session-user",
  username: "Session owner",
  email: "owner@example.com",
  is_active: true,
  is_superuser: false,
  is_verified: true,
}

const meta: Meta<typeof AuthSessionGuard> = {
  title: "features/auth/AuthSessionGuard",
  component: AuthSessionGuard,
  tags: ["autodocs"],
  args: {
    user: storyUser,
    children: <p>Protected workspace</p>,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Authenticated: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Protected workspace")).toBeVisible()
    await waitFor(() => expect(useAuthStore.getState().user).toEqual(storyUser))
  },
}
