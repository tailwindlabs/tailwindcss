import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  clean: true,
  minify: true,
  dts: true,
  entry: ['src/index.ts'],
})
