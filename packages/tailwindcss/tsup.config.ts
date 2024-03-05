import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm', 'cjs'],
  clean: true,
  treeshake: true,
  dts: true,
  entry: {
    lib: 'src/index.ts',
    cli: 'src/cli/index.ts',
  },
})
