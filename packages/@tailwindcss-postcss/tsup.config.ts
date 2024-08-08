import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm', 'cjs'],
  clean: true,
  minify: true,
  cjsInterop: true,
  dts: true,
  entry: ['src/index.ts'],
  noExternal: ['internal-postcss-fix-relative-paths'],
})
