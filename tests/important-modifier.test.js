import { run, css, html } from './util/run'

test('important modifier', () => {
  let config = {
    important: false,
    darkMode: 'class',
    content: [
      {
        raw: html`
          <div class="!container"></div>
          <div class="!font-bold"></div>
          <div class="hover:!text-center"></div>
          <div class="lg:!opacity-50"></div>
          <div class="xl:focus:disabled:!float-right"></div>
          <div class="!custom-parent-5"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      function ({ theme, matchUtilities }) {
        matchUtilities(
          {
            'custom-parent': (value) => {
              return {
                '.custom-child': {
                  margin: value,
                },
              }
            },
          },
          { values: theme('spacing') }
        )
      },
    ],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .\!container {
        width: 100% !important;
      }
      @media (min-width: 640px) {
        .\!container {
          max-width: 640px !important;
        }
      }
      @media (min-width: 768px) {
        .\!container {
          max-width: 768px !important;
        }
      }
      @media (min-width: 1024px) {
        .\!container {
          max-width: 1024px !important;
        }
      }
      @media (min-width: 1280px) {
        .\!container {
          max-width: 1280px !important;
        }
      }
      @media (min-width: 1536px) {
        .\!container {
          max-width: 1536px !important;
        }
      }
      .\!font-bold {
        font-weight: 700 !important;
      }
      .\!custom-parent-5 .custom-child {
        margin: 1.25rem !important;
      }
      .hover\:\!text-center:hover {
        text-align: center !important;
      }
      @media (min-width: 1024px) {
        .lg\:\!opacity-50 {
          opacity: 0.5 !important;
        }
      }
      @media (min-width: 1280px) {
        .xl\:focus\:disabled\:\!float-right:disabled:focus {
          float: right !important;
        }
      }
    `)
  })
})
