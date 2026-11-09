import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    ...(process.platform === 'win32'
      ? []
      : [{ name: 'webkit', use: { browserName: 'webkit' as const } }]),
  ],
})
