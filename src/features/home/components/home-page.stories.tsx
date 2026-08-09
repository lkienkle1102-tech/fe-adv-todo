import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"

import { HomePage } from "./home-page"

const meta = {
  title: "features/home/HomePage",
  component: HomePage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HomePage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole("heading", { name: "Advanced Todo" })
    ).toBeVisible()
    const registerLinks = canvas.getAllByRole("link", { name: "Đăng ký" })
    await expect(registerLinks).toHaveLength(2)
    for (const link of registerLinks) {
      await expect(link).toHaveAttribute("href", "/vi/register")
    }
  },
}
