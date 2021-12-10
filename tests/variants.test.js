import fs from 'fs'
import path from 'path'

import { run, css, html } from './util/run'

test('variants', () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './variants.test.html')],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './variants.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('order matters and produces different behaviour', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="hover:file:bg-pink-600"></div>
          <div class="file:hover:bg-pink-600"></div>
        `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .hover\:file\:bg-pink-600::file-selector-button:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(219 39 119 / var(--tw-bg-opacity));
      }

      .file\:hover\:bg-pink-600:hover::file-selector-button {
        --tw-bg-opacity: 1;
        background-color: rgb(219 39 119 / var(--tw-bg-opacity));
      }
    `)
  })
})

describe('custom advanced variants', () => {
  test('prose-headings usage on its own', () => {
    let config = {
      content: [
        {
          raw: html` <div class="prose-headings:text-center"></div> `,
        },
      ],
      plugins: [
        function ({ addVariant }) {
          addVariant('prose-headings', ':where(&) :is(h1, h2, h3, h4)')
        },
      ],
    }

    return run('@tailwind components;@tailwind utilities', config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        :where(.prose-headings\:text-center) :is(h1, h2, h3, h4) {
          text-align: center;
        }
      `)
    })
  })

  test('prose-headings with another "simple" variant', () => {
    let config = {
      content: [
        {
          raw: html`
            <div class="hover:prose-headings:text-center"></div>
            <div class="prose-headings:hover:text-center"></div>
          `,
        },
      ],
      plugins: [
        function ({ addVariant }) {
          addVariant('prose-headings', ':where(&) :is(h1, h2, h3, h4)')
        },
      ],
    }

    return run('@tailwind components;@tailwind utilities', config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        :where(.hover\:prose-headings\:text-center) :is(h1, h2, h3, h4):hover {
          text-align: center;
        }

        :where(.prose-headings\:hover\:text-center:hover) :is(h1, h2, h3, h4) {
          text-align: center;
        }
      `)
    })
  })

  test('prose-headings with another "complex" variant', () => {
    let config = {
      content: [
        {
          raw: html`
            <div class="group-hover:prose-headings:text-center"></div>
            <div class="prose-headings:group-hover:text-center"></div>
          `,
        },
      ],
      plugins: [
        function ({ addVariant }) {
          addVariant('prose-headings', ':where(&) :is(h1, h2, h3, h4)')
        },
      ],
    }

    return run('@tailwind utilities', config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        .group:hover :where(.group-hover\:prose-headings\:text-center) :is(h1, h2, h3, h4) {
          text-align: center;
        }

        :where(.group:hover .prose-headings\:group-hover\:text-center) :is(h1, h2, h3, h4) {
          text-align: center;
        }
      `)
    })
  })

  test('using variants with multi-class selectors', () => {
    let config = {
      content: [
        {
          raw: html` <div class="screen:parent screen:child"></div> `,
        },
      ],
      plugins: [
        function ({ addVariant, addComponents }) {
          addComponents({
            '.parent .child': {
              foo: 'bar',
            },
          })
          addVariant('screen', '@media screen')
        },
      ],
    }

    return run('@tailwind components;@tailwind utilities', config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        @media screen {
          .screen\:parent .child {
            foo: bar;
          }
          .parent .screen\:child {
            foo: bar;
          }
        }
      `)
    })
  })

  test('using multiple classNames in your custom variant', () => {
    let config = {
      content: [
        {
          raw: html` <div class="my-variant:underline test"></div> `,
        },
      ],
      plugins: [
        function ({ addVariant }) {
          addVariant('my-variant', '&:where(.one, .two, .three)')
        },
      ],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      @layer components {
        .test {
          @apply my-variant:italic;
        }
      }
    `

    return run(input, config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        .test:where(.one, .two, .three) {
          font-style: italic;
        }

        .my-variant\:underline:where(.one, .two, .three) {
          text-decoration: underline;
        }
      `)
    })
  })
})

test('stacked peer variants', async () => {
  let config = {
    content: [{ raw: 'peer-disabled:peer-focus:peer-hover:border-blue-500' }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  let expected = css`
    .peer:disabled:focus:hover ~ .peer-disabled\:peer-focus\:peer-hover\:border-blue-500 {
      --tw-border-opacity: 1;
      border-color: rgb(59 130 246 / var(--tw-border-opacity));
    }
  `

  let result = await run(input, config)
  expect(result.css).toIncludeCss(expected)
})

it('should properly handle keyframes with multiple variants', async () => {
  let config = {
    content: [
      {
        raw: 'animate-spin hover:animate-spin focus:animate-spin hover:animate-bounce focus:animate-bounce',
      },
    ],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;
  `

  let result = await run(input, config)
  expect(result.css).toMatchFormattedCss(css`
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .hover\:animate-spin:hover {
      animation: spin 1s linear infinite;
    }

    @keyframes bounce {
      0%,
      100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: none;
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }

    .hover\:animate-bounce:hover {
      animation: bounce 1s infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .focus\:animate-spin:focus {
      animation: spin 1s linear infinite;
    }

    @keyframes bounce {
      0%,
      100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: none;
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }

    .focus\:animate-bounce:focus {
      animation: bounce 1s infinite;
    }
  `)
})

test('custom addVariant with more complex media query params', () => {
  let config = {
    content: [
      {
        raw: html` <div class="magic:text-center"></div> `,
      },
    ],
    plugins: [
      function ({ addVariant }) {
        addVariant('magic', '@media screen and (max-wdith: 600px)')
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media screen and (max-wdith: 600px) {
        .magic\:text-center {
          text-align: center;
        }
      }
    `)
  })
})

test('custom addVariant with nested media & format shorthand', () => {
  let config = {
    content: [
      {
        raw: html` <div class="magic:text-center"></div> `,
      },
    ],
    plugins: [
      function ({ addVariant }) {
        addVariant('magic', '@supports (hover: hover) { @media print { &:disabled } }')
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @supports (hover: hover) {
        @media print {
          .magic\:text-center:disabled {
            text-align: center;
          }
        }
      }
    `)
  })
})

test('before and after variants are a bit special, and forced to the end', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="before:hover:text-center"></div>
          <div class="hover:before:text-center"></div>
        `,
      },
    ],
    plugins: [],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .before\:hover\:text-center:hover::before {
        content: var(--tw-content);
        text-align: center;
      }

      .hover\:before\:text-center:hover::before {
        content: var(--tw-content);
        text-align: center;
      }
    `)
  })
})

test('before and after variants are a bit special, and forced to the end (2)', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="before:prose-headings:text-center"></div>
          <div class="prose-headings:before:text-center"></div>
        `,
      },
    ],
    plugins: [
      function ({ addVariant }) {
        addVariant('prose-headings', ':where(&) :is(h1, h2, h3, h4)')
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      :where(.before\:prose-headings\:text-center) :is(h1, h2, h3, h4)::before {
        content: var(--tw-content);
        text-align: center;
      }

      :where(.prose-headings\:before\:text-center) :is(h1, h2, h3, h4)::before {
        content: var(--tw-content);
        text-align: center;
      }
    `)
  })
})
