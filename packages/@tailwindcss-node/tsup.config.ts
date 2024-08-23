import { defineConfig } from 'tsup'

export default defineConfig([
  {
    format: ['cjs', 'esm'],
    minify: true,
    dts: true,
    entry: ['src/index.ts'],
  },
  {
    format: ['esm'],
    minify: true,
    dts: true,
    entry: ['src/esm-cache.hook.mts', 'src/esm-cache.loader.mts'],
  },
  {
    format: ['cjs'],
    minify: true,
    dts: true,
    entry: ['src/esm-cache.hook.cts', 'src/require-cache.cts'],
  },
])
