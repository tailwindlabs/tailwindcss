import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    hideSkippedTests: true,
    bail: 1,
    globalSetup: './vitest.global-setup.ts',
  },
})
