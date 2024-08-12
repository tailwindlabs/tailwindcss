import { defineConfig } from 'tsup'

export default defineConfig([
  {
    format: ['esm', 'cjs'],
    cjsInterop: false,
    clean: true,
    minify: true,
    dts: true,
    entry: {
      lib: 'src/index.ts',
    },
  },
  {
    format: ['esm'],
    splitting: false,
    minify: false,
    dts: true,
    entry: {
      plugin: 'src/plugin.ts',
    },
  },
  {
    format: ['cjs'],
    minify: false,
    dts: true,
    entry: {
      plugin: 'src/plugin.cts',
    },
  },
])
