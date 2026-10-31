import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  test: {
    snapshotSerializers: [path.resolve(__dirname, 'src/test-utils/custom-serializer.ts')],
    exclude: ['**/*.spec.?(c|m)[jt]s?(x)', 'integrations/**/*'],
  },
})
