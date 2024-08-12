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
    minify: true,
    dts: true,
    entry: {
      plugin: 'src/plugin.ts',
    },
  },
  {
    format: ['cjs'],
    minify: true,
    dts: true,
    entry: {
      plugin: 'src/plugin.cts',
    },
  },
])
