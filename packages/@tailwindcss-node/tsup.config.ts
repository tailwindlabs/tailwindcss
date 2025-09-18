import { defineConfig } from 'tsup'

export default defineConfig([
  {
    format: ['cjs'],
    minify: true,
    dts: true,
    entry: ['src/index.cts'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  },
  {
    format: ['esm'],
    minify: true,
    dts: true,
    entry: ['src/index.ts'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  },
  {
    format: ['esm'],
    minify: true,
    dts: true,
    entry: ['src/esm-cache.loader.mts'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  },
  {
    format: ['cjs'],
    minify: true,
    dts: true,
    entry: ['src/require-cache.cts'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  },
])
