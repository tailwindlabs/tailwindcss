import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [
        // sveltePreprocess({
        //   aliases: [
        //     ['tailwindcss', 'tailwindcss'],
        //     ['tailwind', 'tailwindcss'],
        //     ['postcss', 'tailwindcss'],
        //   ],
        //   /** Add a custom language preprocessor */
        //   tailwindcss({ content, filename, attributes }) {
        //     let compiled = compile(content.replace('@tailwind ', '@failwind '), {}).build(
        //       Array.from(['']),
        //     )
        //     console.log({ compiled, attributes })
        //     return Promise.resolve({
        //       code: compiled.replace('@failwind ', '@tailwind '),
        //       map: '',
        //       attributes,
        //     })
        //   },
        // }),
        vitePreprocess(),
      ],
    }),
    tailwindcss(),
  ],
})

// @tailwindcss/svelte
