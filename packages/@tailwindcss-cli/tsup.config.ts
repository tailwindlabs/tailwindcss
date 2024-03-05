import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm', 'cjs'],
  clean: true,
  minify: true,
  entry: {
    cli: 'src/index.ts',
  },
})
