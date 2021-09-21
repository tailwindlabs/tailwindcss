import path from 'path'

import { run } from './util/run'

let css = String.raw

test('it detects svelte based on the file extension', () => {
  let config = {
    content: [path.resolve(__dirname, './syntax-svelte.test.svelte')],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchCss(css`
      .bg-red-500 {
        --tw-bg-opacity: 1;
        background-color: rgb(239 68 68 / var(--tw-bg-opacity));
      }
      @media (min-width: 1024px) {
        .lg\:hover\:bg-blue-500:hover {
          --tw-bg-opacity: 1;
          background-color: rgb(59 130 246 / var(--tw-bg-opacity));
        }
      }
    `)
  })
})

test('using raw with svelte extension', () => {
  let config = {
    content: [
      {
        raw: `
        <script>
          let current = 'foo'
        </script>

        <button class:lg:hover:bg-blue-500={current === 'foo'}>Click me</button>

        <button
          class:bg-red-500={current === 'foo'}
        >
          Click me
        </button>
        `,
        extension: 'svelte',
      },
    ],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchCss(css`
      .bg-red-500 {
        --tw-bg-opacity: 1;
        background-color: rgb(239 68 68 / var(--tw-bg-opacity));
      }
      @media (min-width: 1024px) {
        .lg\:hover\:bg-blue-500:hover {
          --tw-bg-opacity: 1;
          background-color: rgb(59 130 246 / var(--tw-bg-opacity));
        }
      }
    `)
  })
})
