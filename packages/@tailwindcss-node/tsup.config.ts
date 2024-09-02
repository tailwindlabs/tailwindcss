import { defineConfig } from 'tsup'

export default defineConfig([
  {
    format: ['cjs'],
    minify: true,
    dts: true,
    entry: ['src/index.cts'],
  },
  {
    format: ['esm'],
    minify: true,
    dts: true,
    entry: ['src/index.ts'],
  },
  {
    format: ['esm'],
    minify: true,
    dts: true,
    entry: ['src/esm-cache.loader.mts'],
  },
  {
    format: ['cjs'],
    minify: true,
    dts: true,
    entry: ['src/require-cache.cts'],
  },
])
