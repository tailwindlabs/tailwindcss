import { run, html, css } from './util/run'

it('should not safelist anything', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .uppercase {
        text-transform: uppercase;
      }
    `)
  })
})

it('should safelist strings', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: ['mt-[20px]', 'font-bold', 'text-gray-200', 'hover:underline'],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .mt-\[20px\] {
        margin-top: 20px;
      }

      .font-bold {
        font-weight: 700;
      }

      .uppercase {
        text-transform: uppercase;
      }

      .text-gray-200 {
        --tw-text-opacity: 1;
        color: rgb(229 231 235 / var(--tw-text-opacity));
      }

      .hover\:underline:hover {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should safelist based on a pattern regex', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: [
      {
        pattern: /bg-(red)-(100|200)/,
        variants: ['hover'],
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .bg-red-100 {
        --tw-bg-opacity: 1;
        background-color: rgb(254 226 226 / var(--tw-bg-opacity));
      }

      .bg-red-200 {
        --tw-bg-opacity: 1;
        background-color: rgb(254 202 202 / var(--tw-bg-opacity));
      }

      .uppercase {
        text-transform: uppercase;
      }

      .hover\:bg-red-100:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(254 226 226 / var(--tw-bg-opacity));
      }

      .hover\:bg-red-200:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(254 202 202 / var(--tw-bg-opacity));
      }
    `)
  })
})

it('should not generate duplicates', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: [
      'uppercase',
      {
        pattern: /bg-(red)-(100|200)/,
        variants: ['hover'],
      },
      {
        pattern: /bg-(red)-(100|200)/,
        variants: ['hover'],
      },
      {
        pattern: /bg-(red)-(100|200)/,
        variants: ['hover'],
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .bg-red-100 {
        --tw-bg-opacity: 1;
        background-color: rgb(254 226 226 / var(--tw-bg-opacity));
      }

      .bg-red-200 {
        --tw-bg-opacity: 1;
        background-color: rgb(254 202 202 / var(--tw-bg-opacity));
      }

      .uppercase {
        text-transform: uppercase;
      }

      .hover\:bg-red-100:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(254 226 226 / var(--tw-bg-opacity));
      }

      .hover\:bg-red-200:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(254 202 202 / var(--tw-bg-opacity));
      }
    `)
  })
})

it('should safelist when using a custom prefix', () => {
  let config = {
    prefix: 'tw-',
    content: [{ raw: html`<div class="tw-uppercase"></div>` }],
    safelist: [
      {
        pattern: /tw-bg-red-(100|200)/g,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .tw-bg-red-100 {
        --tw-bg-opacity: 1;
        background-color: rgb(254 226 226 / var(--tw-bg-opacity));
      }

      .tw-bg-red-200 {
        --tw-bg-opacity: 1;
        background-color: rgb(254 202 202 / var(--tw-bg-opacity));
      }

      .tw-uppercase {
        text-transform: uppercase;
      }
    `)
  })
})

it('should not safelist when an empty list is provided', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .uppercase {
        text-transform: uppercase;
      }
    `)
  })
})

it('should not safelist when an sparse/holey list is provided', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: [, , ,],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .uppercase {
        text-transform: uppercase;
      }
    `)
  })
})

it('should safelist negatives based on a pattern regex', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: [
      {
        pattern: /^-top-1$/,
        variants: ['hover'],
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .-top-1 {
        top: -0.25rem;
      }

      .uppercase {
        text-transform: uppercase;
      }

      .hover\:-top-1:hover {
        top: -0.25rem;
      }
    `)
  })
})
