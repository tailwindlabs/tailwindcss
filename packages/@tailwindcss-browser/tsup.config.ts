import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  clean: true,
  minify: true,
  entry: ['src/index.ts'],
  noExternal: [/.*/],
  loader: {
    '.css': 'text',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
