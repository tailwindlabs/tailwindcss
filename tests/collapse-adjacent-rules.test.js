import { run, html, css, defaults } from './util/run'

test('collapse adjacent rules', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="custom-component"></div>
          <div class="sm:custom-component"></div>
          <div class="md:custom-component"></div>
          <div class="lg:custom-component"></div>
          <div class="font-bold"></div>
          <div class="sm:font-bold"></div>
          <div class="sm:text-center"></div>
          <div class="md:font-bold"></div>
          <div class="md:text-center"></div>
          <div class="lg:font-bold"></div>
          <div class="lg:text-center"></div>
          <div class="some-apply-thing"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [
      function ({ addVariant }) {
        addVariant('foo-bar', '@supports (foo: bar)')
      },
    ],
  }

  let input = css`
    @tailwind base;
    @font-face {
      font-family: 'Inter';
      src: url('/fonts/Inter.woff2') format('woff2'), url('/fonts/Inter.woff') format('woff');
    }
    @font-face {
      font-family: 'Gilroy';
      src: url('/fonts/Gilroy.woff2') format('woff2'), url('/fonts/Gilroy.woff') format('woff');
    }
    @page {
      margin: 1cm;
    }
    @tailwind components;
    @tailwind utilities;
    @layer base {
      @font-face {
        font-family: 'Poppins';
        src: url('/fonts/Poppins.woff2') format('woff2'), url('/fonts/Poppins.woff') format('woff');
      }
      @font-face {
        font-family: 'Proxima Nova';
        src: url('/fonts/ProximaNova.woff2') format('woff2'),
          url('/fonts/ProximaNova.woff') format('woff');
      }
    }
    .foo,
    .bar {
      color: black;
    }
    .foo,
    .bar {
      font-weight: 700;
    }
    .some-apply-thing {
      @apply foo-bar:md:text-black foo-bar:md:font-bold foo-bar:text-black foo-bar:font-bold md:font-bold md:text-black;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @font-face {
        font-family: Poppins;
        src: url('/fonts/Poppins.woff2') format('woff2'), url('/fonts/Poppins.woff') format('woff');
      }
      @font-face {
        font-family: Proxima Nova;
        src: url('/fonts/ProximaNova.woff2') format('woff2'),
          url('/fonts/ProximaNova.woff') format('woff');
      }
      ${defaults}
      @font-face {
        font-family: Inter;
        src: url('/fonts/Inter.woff2') format('woff2'), url('/fonts/Inter.woff') format('woff');
      }
      @font-face {
        font-family: Gilroy;
        src: url('/fonts/Gilroy.woff2') format('woff2'), url('/fonts/Gilroy.woff') format('woff');
      }
      @page {
        margin: 1cm;
      }
      .font-bold {
        font-weight: 700;
      }
      .foo,
      .bar {
        color: #000;
        font-weight: 700;
      }
      @supports (foo: bar) {
        .some-apply-thing {
          --tw-text-opacity: 1;
          color: rgb(0 0 0 / var(--tw-text-opacity));
          font-weight: 700;
        }
      }
      @media (min-width: 768px) {
        .some-apply-thing {
          --tw-text-opacity: 1;
          color: rgb(0 0 0 / var(--tw-text-opacity));
          font-weight: 700;
        }
      }
      @supports (foo: bar) {
        @media (min-width: 768px) {
          .some-apply-thing {
            --tw-text-opacity: 1;
            color: rgb(0 0 0 / var(--tw-text-opacity));
            font-weight: 700;
          }
        }
      }
      @media (min-width: 640px) {
        .sm\:text-center {
          text-align: center;
        }
        .sm\:font-bold {
          font-weight: 700;
        }
      }
      @media (min-width: 768px) {
        .md\:text-center {
          text-align: center;
        }
        .md\:font-bold {
          font-weight: 700;
        }
      }
      @media (min-width: 1024px) {
        .lg\:text-center {
          text-align: center;
        }
        .lg\:font-bold {
          font-weight: 700;
        }
      }
    `)
  })
})

test('duplicate url imports does not break rule collapsing', () => {
  let config = {
    content: [{ raw: html`` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @import url('https://example.com');
    @import url('https://example.com');
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @import 'https://example.com';
    `)
  })
})
