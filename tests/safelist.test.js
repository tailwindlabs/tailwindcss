import { run, html, css } from './util/run'

it('should not safelist anything', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
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
    expect(result.css).toMatchFormattedCss(css`
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
        pattern: /^bg-(red)-(100|200)$/,
        variants: ['hover'],
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
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
        pattern: /^bg-(red)-(100|200)$/,
        variants: ['hover'],
      },
      {
        pattern: /^bg-(red)-(100|200)$/,
        variants: ['hover'],
      },
      {
        pattern: /^bg-(red)-(100|200)$/,
        variants: ['hover'],
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
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
        pattern: /^tw-bg-red-(100|200)$/g,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
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
    return expect(result.css).toMatchFormattedCss(css`
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
    return expect(result.css).toMatchFormattedCss(css`
      .uppercase {
        text-transform: uppercase;
      }
    `)
  })
})

it('should not safelist any invalid variants if provided', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: [
      {
        pattern: /^bg-(red)-(100|200)$/,
        variants: ['foo', 'bar'],
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
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
    return expect(result.css).toMatchFormattedCss(css`
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

it('should safelist negatives based on a pattern regex', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: [
      {
        pattern: /^bg-red-(400|500)(\/(40|50))?$/,
        variants: ['hover'],
      },
      {
        pattern: /^(fill|ring|text)-red-200\/50$/,
        variants: ['hover'],
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-red-400 {
        --tw-bg-opacity: 1;
        background-color: rgb(248 113 113 / var(--tw-bg-opacity));
      }
      .bg-red-400\/40 {
        background-color: #f8717166;
      }
      .bg-red-400\/50 {
        background-color: #f8717180;
      }
      .bg-red-500 {
        --tw-bg-opacity: 1;
        background-color: rgb(239 68 68 / var(--tw-bg-opacity));
      }
      .bg-red-500\/40 {
        background-color: #ef444466;
      }
      .bg-red-500\/50 {
        background-color: #ef444480;
      }
      .fill-red-200\/50 {
        fill: #fecaca80;
      }
      .uppercase {
        text-transform: uppercase;
      }
      .text-red-200\/50 {
        color: #fecaca80;
      }
      .ring-red-200\/50 {
        --tw-ring-color: #fecaca80;
      }
      .hover\:bg-red-400:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(248 113 113 / var(--tw-bg-opacity));
      }
      .hover\:bg-red-400\/40:hover {
        background-color: #f8717166;
      }
      .hover\:bg-red-400\/50:hover {
        background-color: #f8717180;
      }
      .hover\:bg-red-500:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(239 68 68 / var(--tw-bg-opacity));
      }
      .hover\:bg-red-500\/40:hover {
        background-color: #ef444466;
      }
      .hover\:bg-red-500\/50:hover {
        background-color: #ef444480;
      }
      .hover\:fill-red-200\/50:hover {
        fill: #fecaca80;
      }
      .hover\:text-red-200\/50:hover {
        color: #fecaca80;
      }
      .hover\:ring-red-200\/50:hover {
        --tw-ring-color: #fecaca80;
      }
    `)
  })
})

it('should safelist pattern regex with !important selector', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: [{ pattern: /^!grid-cols-(4|5|6)$/ }],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .\!grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }
      .\!grid-cols-5 {
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
      }
      .\!grid-cols-6 {
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      }
      .uppercase {
        text-transform: uppercase;
      }
    `)
  })
})

it('should safelist pattern regex with custom prefix along with !important selector', () => {
  let config = {
    prefix: 'tw-',
    content: [{ raw: html`<div class="tw-uppercase"></div>` }],
    safelist: [{ pattern: /^!tw-grid-cols-(4|5|6)$/ }],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .\!tw-grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }
      .\!tw-grid-cols-5 {
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
      }
      .\!tw-grid-cols-6 {
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      }
      .tw-uppercase {
        text-transform: uppercase;
      }
    `)
  })
})

it('should safelist pattern regex having !important selector with variants', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: [
      {
        pattern: /^!bg-gray-(500|600|700|800)$/,
        variants: ['hover'],
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .\!bg-gray-500 {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(107 114 128 / var(--tw-bg-opacity)) !important;
      }
      .\!bg-gray-600 {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(75 85 99 / var(--tw-bg-opacity)) !important;
      }
      .\!bg-gray-700 {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(55 65 81 / var(--tw-bg-opacity)) !important;
      }
      .\!bg-gray-800 {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(31 41 55 / var(--tw-bg-opacity)) !important;
      }
      .uppercase {
        text-transform: uppercase;
      }
      .hover\:\!bg-gray-500:hover {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(107 114 128 / var(--tw-bg-opacity)) !important;
      }
      .hover\:\!bg-gray-600:hover {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(75 85 99 / var(--tw-bg-opacity)) !important;
      }
      .hover\:\!bg-gray-700:hover {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(55 65 81 / var(--tw-bg-opacity)) !important;
      }
      .hover\:\!bg-gray-800:hover {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(31 41 55 / var(--tw-bg-opacity)) !important;
      }
    `)
  })
})

it('should safelist multiple patterns with !important selector', () => {
  let config = {
    content: [{ raw: html`<div class="uppercase"></div>` }],
    safelist: [
      {
        pattern: /^!text-gray-(700|800|900)$/,
        variants: ['hover'],
      },
      {
        pattern: /^!bg-gray-(200|300|400)$/,
        variants: ['hover'],
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .\!bg-gray-200 {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(229 231 235 / var(--tw-bg-opacity)) !important;
      }
      .\!bg-gray-300 {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(209 213 219 / var(--tw-bg-opacity)) !important;
      }
      .\!bg-gray-400 {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(156 163 175 / var(--tw-bg-opacity)) !important;
      }
      .uppercase {
        text-transform: uppercase;
      }
      .\!text-gray-700 {
        --tw-text-opacity: 1 !important;
        color: rgb(55 65 81 / var(--tw-text-opacity)) !important;
      }
      .\!text-gray-800 {
        --tw-text-opacity: 1 !important;
        color: rgb(31 41 55 / var(--tw-text-opacity)) !important;
      }
      .\!text-gray-900 {
        --tw-text-opacity: 1 !important;
        color: rgb(17 24 39 / var(--tw-text-opacity)) !important;
      }
      .hover\:\!bg-gray-200:hover {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(229 231 235 / var(--tw-bg-opacity)) !important;
      }
      .hover\:\!bg-gray-300:hover {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(209 213 219 / var(--tw-bg-opacity)) !important;
      }
      .hover\:\!bg-gray-400:hover {
        --tw-bg-opacity: 1 !important;
        background-color: rgb(156 163 175 / var(--tw-bg-opacity)) !important;
      }
      .hover\:\!text-gray-700:hover {
        --tw-text-opacity: 1 !important;
        color: rgb(55 65 81 / var(--tw-text-opacity)) !important;
      }
      .hover\:\!text-gray-800:hover {
        --tw-text-opacity: 1 !important;
        color: rgb(31 41 55 / var(--tw-text-opacity)) !important;
      }
      .hover\:\!text-gray-900:hover {
        --tw-text-opacity: 1 !important;
        color: rgb(17 24 39 / var(--tw-text-opacity)) !important;
      }
    `)
  })
})
