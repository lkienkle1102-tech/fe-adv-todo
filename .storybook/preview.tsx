import type { Preview } from '@storybook/nextjs-vite'
import { QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import React from 'react'

import { makeQueryClient } from '../src/core/query-client'
import vi from '../src/i18n/locales/vi'
import '../src/app/globals.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="vi" messages={vi}>
        <QueryClientProvider client={makeQueryClient()}>
          <Story />
        </QueryClientProvider>
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [['locale', 'vi']],
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
