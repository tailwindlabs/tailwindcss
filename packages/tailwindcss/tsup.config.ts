import { defineConfig } from 'tsup'

export default defineConfig([
  {
    format: ['esm'],
    minify: true,
    dts: true,
    entry: {
      lib: 'src/index.ts',
      plugin: 'src/plugin.ts',
      colors: 'src/compat/colors.ts',
      'default-theme': 'src/compat/default-theme.ts',
      'flatten-color-palette': 'src/compat/flatten-color-palette.ts',
    },
    define: {
      'process.env.FEATURES_ENV': JSON.stringify(process.env.FEATURES_ENV ?? 'insiders'),
    },
  },
  {
    format: ['cjs'],
    minify: true,
    dts: true,
    entry: {
      plugin: 'src/plugin.cts',
      lib: 'src/index.cts',
      colors: 'src/compat/colors.cts',
      'default-theme': 'src/compat/default-theme.cts',
      'flatten-color-palette': 'src/compat/flatten-color-palette.cts',
    },
    define: {
      'process.env.FEATURES_ENV': JSON.stringify(process.env.FEATURES_ENV ?? 'insiders'),
    },
  },
])
