import { run, html, css, defaults } from './util/run'

test('important modifier with prefix', () => {
  let config = {
    important: false,
    prefix: 'tw-',
    darkMode: 'selector',
    content: [
      {
        raw: html`<!-- The string "!*" can cause problems if we don't handle it, let's include it -->
          <div class="!*"></div>
          <div class="!tw-container"></div>
          <div class="!tw-font-bold"></div>
          <div class="hover:!tw-text-center"></div>
          <div class="lg:!tw-opacity-50"></div>
          <div class="xl:focus:disabled:!tw-float-right"></div> `,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      .\!tw-container {
        width: 100% !important;
      }
      @media (min-width: 640px) {
        .\!tw-container {
          max-width: 640px !important;
        }
      }
      @media (min-width: 768px) {
        .\!tw-container {
          max-width: 768px !important;
        }
      }
      @media (min-width: 1024px) {
        .\!tw-container {
          max-width: 1024px !important;
        }
      }
      @media (min-width: 1280px) {
        .\!tw-container {
          max-width: 1280px !important;
        }
      }
      @media (min-width: 1536px) {
        .\!tw-container {
          max-width: 1536px !important;
        }
      }
      .\!tw-font-bold {
        font-weight: 700 !important;
      }
      .hover\:\!tw-text-center:hover {
        text-align: center !important;
      }
      @media (min-width: 1024px) {
        .lg\:\!tw-opacity-50 {
          opacity: 0.5 !important;
        }
      }
      @media (min-width: 1280px) {
        .xl\:focus\:disabled\:\!tw-float-right:disabled:focus {
          float: right !important;
        }
      }
    `)
  })
})
