import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm', 'cjs'],
  clean: true,
  treeshake: true,
  entry: {
    cli: 'src/index.ts',
  },
})
