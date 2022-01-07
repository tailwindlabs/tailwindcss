import { run } from './util/run'

let css = String.raw

test('it detects classes in lit-html templates', () => {
  let config = {
    content: [
      {
        raw: `html\`<button class="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">\${data.title}</button>\`;`,
      },
    ],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .rounded {
        border-radius: 0.25rem;
      }
      .bg-blue-400 {
        --tw-bg-opacity: 1;
        background-color: rgb(96 165 250 / var(--tw-bg-opacity));
      }
      .py-2 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
      .px-4 {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      .font-bold {
        font-weight: 700;
      }
      .text-white {
        --tw-text-opacity: 1;
        color: rgb(255 255 255 / var(--tw-text-opacity));
      }
      .hover\:bg-blue-600:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(37 99 235 / var(--tw-bg-opacity));
      }
    `)
  })
})
