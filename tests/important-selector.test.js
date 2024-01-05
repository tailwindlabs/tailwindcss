import { run, html, css, defaults } from './util/run'

test('important selector', () => {
  let config = {
    important: '#app',
    darkMode: 'selector',
    content: [
      {
        raw: html`
          <div class="container"></div>
          <div class="btn"></div>
          <div class="animate-spin"></div>
          <div class="custom-util"></div>
          <div class="custom-component"></div>
          <div class="custom-important-component"></div>
          <div class="font-bold"></div>
          <div class="md:hover:text-right"></div>
          <div class="motion-safe:hover:text-center"></div>
          <div class="dark:focus:text-left"></div>
          <div class="group-hover:focus-within:text-left"></div>
          <div class="rtl:active:text-center"></div>
          <div class="dark:before:underline"></div>
          <div class="hover:[&::file-selector-button]:rtl:dark:bg-black/100"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      function ({ addComponents, addUtilities }) {
        addComponents(
          {
            '.btn': {
              button: 'yes',
            },
          },
          { respectImportant: true }
        )
        addComponents(
          {
            '@font-face': {
              'font-family': 'Inter',
            },
            '@page': {
              margin: '1cm',
            },
          },
          { respectImportant: true }
        )
        addUtilities(
          {
            '.custom-util': {
              button: 'no',
            },
          },
          { respectImportant: false }
        )
      },
    ],
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @layer components {
      .custom-component {
        @apply font-bold;
      }
      .custom-important-component {
        @apply text-center !important;
      }
    }
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
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
      #app .btn {
        button: yes;
      }
      @font-face {
        font-family: Inter;
      }
      @page {
        margin: 1cm;
      }
      .custom-component {
        font-weight: 700;
      }
      .custom-important-component {
        text-align: center !important;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      #app .animate-spin {
        animation: 1s linear infinite spin;
      }
      #app .font-bold {
        font-weight: 700;
      }
      .custom-util {
        button: no;
      }
      #app :is(.group:hover .group-hover\:focus-within\:text-left:focus-within) {
        text-align: left;
      }
      @media (prefers-reduced-motion: no-preference) {
        #app .motion-safe\:hover\:text-center:hover {
          text-align: center;
        }
      }
      @media (min-width: 768px) {
        #app .md\:hover\:text-right:hover {
          text-align: right;
        }
      }
      #app .rtl\:active\:text-center:active:where([dir='rtl'], [dir='rtl'] *) {
        text-align: center;
      }
      #app .dark\:before\:underline:where(.dark, .dark *):before {
        content: var(--tw-content);
        text-decoration-line: underline;
      }
      #app .dark\:focus\:text-left:focus:where(.dark, .dark *) {
        text-align: left;
      }
      #app
        .hover\:\[\&\:\:file-selector-button\]\:rtl\:dark\:bg-black\/100:where(
          .dark,
          .dark *
        ):where([dir='rtl'], [dir='rtl'] *)::-webkit-file-upload-button:hover {
        background-color: #000;
      }
      #app
        .hover\:\[\&\:\:file-selector-button\]\:rtl\:dark\:bg-black\/100:where(
          .dark,
          .dark *
        ):where([dir='rtl'], [dir='rtl'] *)::file-selector-button:hover {
        background-color: #000;
      }
    `)
  })
})

test('pseudo-elements are appended after the `:-webkit-any()`', () => {
  let config = {
    important: '#app',
    darkMode: 'selector',
    content: [
      {
        raw: html` <div class="dark:before:flex"></div> `,
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
      #app .dark\:before\:flex:where(.dark, .dark *):before {
        content: var(--tw-content);
        display: flex;
      }
    `)
  })
})
