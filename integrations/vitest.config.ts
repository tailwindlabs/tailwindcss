import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    hideSkippedTests: true,
    bail: 1,
    testTimeout: 600_000, // 10min
  },
})
