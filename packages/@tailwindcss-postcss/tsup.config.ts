import { defineConfig } from 'tsup'

export default defineConfig([
  {
    format: ['esm'],
    minify: true,
    cjsInterop: true,
    dts: true,
    entry: ['src/index.ts'],
    noExternal: ['internal-postcss-fix-relative-paths'],
  },
  {
    format: ['cjs'],
    minify: true,
    cjsInterop: true,
    dts: true,
    entry: ['src/index.cts'],
    noExternal: ['internal-postcss-fix-relative-paths'],
  },
])
