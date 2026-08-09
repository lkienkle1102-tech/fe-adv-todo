import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { UserProfilePage } from "@/features/profile/components/user-profile-page"

const meta: Meta<typeof UserProfilePage> = {
  title: "features/profile/UserProfilePage",
  component: UserProfilePage,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    initialUser: {
      id: "c45e3ad5-df91-4daa-a257-d038d433a671",
      username: "Nguyễn Minh Anh",
      email: "minhanh@example.com",
      is_active: true,
      is_superuser: false,
      is_verified: true,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Administrator: Story = {
  args: {
    initialUser: {
      id: "241d3f83-01b1-4ad5-8e99-696651007a26",
      username: "Lê Kỳ An",
      email: "admin@example.com",
      is_active: true,
      is_superuser: true,
      is_verified: false,
    },
  },
}
