import { run, html, css } from './util/run'

test('important modifier', () => {
  let config = {
    important: false,
    darkMode: 'selector',
    content: [
      {
        raw: html`
          <div class="!container"></div>
          <div class="!font-bold"></div>
          <div class="hover:!text-center"></div>
          <div class="lg:!opacity-50"></div>
          <div class="xl:focus:disabled:!float-right"></div>
          <div class="!custom-parent-5"></div>
          <div class="btn !disabled"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      function ({ theme, matchUtilities, addComponents }) {
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
        addComponents({
          '.btn': {
            '&.disabled, &:disabled': {
              color: 'gray',
            },
          },
        })
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
      .btn.disabled,
      .btn:disabled {
        color: gray;
      }
      .btn.\!disabled {
        color: gray !important;
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

test('the important modifier works on utilities using :where()', () => {
  let config = {
    content: [
      {
        raw: html` <div class="btn hover:btn !btn hover:focus:disabled:!btn"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      function ({ addComponents }) {
        addComponents({
          ':where(.btn)': {
            backgroundColor: '#00f',
          },
        })
      },
    ],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      :where(.\!btn) {
        background-color: #00f !important;
      }
      :where(.btn) {
        background-color: #00f;
      }
      :where(.hover\:btn:hover) {
        background-color: #00f;
      }
      :where(.hover\:focus\:disabled\:\!btn:disabled:focus:hover) {
        background-color: #00f !important;
      }
    `)
  })
})

test('the important modifier does not break keyframes', () => {
  let config = {
    content: [
      {
        raw: html` <div class="!animate-pulse"></div> `,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @keyframes pulse {
        50% {
          opacity: 0.5;
        }
      }

      .\!animate-pulse {
        animation: 2s cubic-bezier(0.4, 0, 0.6, 1) infinite pulse !important;
      }
    `)
  })
})
