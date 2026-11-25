import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './packages/*',
      '!./packages/tsconfig.base.json',
      '!./packages/globals.d.ts',
      './scripts',
    ],
    exclude: ['**/*.spec.?(c|m)[jt]s?(x)', 'integrations/**/*'],
  },
})
