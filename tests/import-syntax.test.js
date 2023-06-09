import { run, html, css, defaults } from './util/run'

test('using @import instead of @tailwind', () => {
  let config = {
    content: [
      {
        raw: html`
          <h1>Hello world!</h1>
          <div class="container"></div>
          <div class="mt-6"></div>
          <div class="bg-black"></div>
          <div class="md:hover:text-center"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      function ({ addBase }) {
        addBase({
          h1: {
            fontSize: '32px',
          },
        })
      },
    ],
  }

  let input = css`
    @import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      h1 {
        font-size: 32px;
      }
      ${defaults}
      .container {
        width: 100%;
      }
      @media (min-width: 640px) {
        .container {
          max-width: 640px;
        }
      }
      @media (min-width: 768px) {
        .container {
          max-width: 768px;
        }
      }
      @media (min-width: 1024px) {
        .container {
          max-width: 1024px;
        }
      }
      @media (min-width: 1280px) {
        .container {
          max-width: 1280px;
        }
      }
      @media (min-width: 1536px) {
        .container {
          max-width: 1536px;
        }
      }
      .mt-6 {
        margin-top: 1.5rem;
      }
      .bg-black {
        --tw-bg-opacity: 1;
        background-color: rgb(0 0 0 / var(--tw-bg-opacity));
      }
      @media (min-width: 768px) {
        .md\:hover\:text-center:hover {
          text-align: center;
        }
      }
    `)
  })
})
