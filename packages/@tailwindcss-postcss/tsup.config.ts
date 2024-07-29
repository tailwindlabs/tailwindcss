import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm', 'cjs'],
  clean: true,
  minify: true,
  splitting: true,
  cjsInterop: true,
  dts: true,
  entry: ['src/index.ts'],
  noExternal: ['postcss-fix-relative-paths-plugin'],
})
