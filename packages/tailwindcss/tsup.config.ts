import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs', 'esm'],
  clean: true,
  minify: true,
  dts: true,
  entry: {
    plugin: 'src/plugin.ts',
    lib: 'src/index.ts',
    colors: 'src/compat/colors.ts',
    'default-theme': 'src/compat/default-theme.ts',
    'flatten-color-palette': 'src/compat/flatten-color-palette.ts',
  },
})
