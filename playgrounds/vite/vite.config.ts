import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [vitePreprocess()],
    }),
    tailwindcss(),
  ],
})
