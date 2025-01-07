import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['**/*.spec.?(c|m)[jt]s?(x)', '**/node_modules/**'],
  },
})
