import fs from 'fs'
import path from 'path'
import postcss from 'postcss'

import { run, css, html, defaults } from './util/run'

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
          text-decoration-line: underline;
        }
      `)
    })
  })

  test('variant format string must include at-rule or & (1)', async () => {
    let config = {
      content: [
        {
          raw: html` <div class="wtf-bbq:text-center"></div> `,
        },
      ],
      plugins: [
        function ({ addVariant }) {
          addVariant('wtf-bbq', 'lol')
        },
      ],
    }

    await expect(run('@tailwind components;@tailwind utilities', config)).rejects.toThrowError(
      "Your custom variant `wtf-bbq` has an invalid format string. Make sure it's an at-rule or contains a `&` placeholder."
    )
  })

  test('variant format string must include at-rule or & (2)', async () => {
    let config = {
      content: [
        {
          raw: html` <div class="wtf-bbq:text-center"></div> `,
        },
      ],
      plugins: [
        function ({ addVariant }) {
          addVariant('wtf-bbq', () => 'lol')
        },
      ],
    }

    await expect(run('@tailwind components;@tailwind utilities', config)).rejects.toThrowError(
      "Your custom variant `wtf-bbq` has an invalid format string. Make sure it's an at-rule or contains a `&` placeholder."
    )
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

it('should not generate variants of user css if it is not inside a layer', () => {
  let config = {
    content: [{ raw: html`<div class="hover:foo"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    .foo {
      color: red;
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .foo {
        color: red;
      }
    `)
  })
})

it('should be possible to use responsive modifiers that are defined with special characters', () => {
  let config = {
    content: [{ raw: html`<div class="<sm:underline"></div>` }],
    theme: {
      screens: {
        '<sm': { max: '399px' },
      },
    },
    plugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media (max-width: 399px) {
        .\<sm\:underline {
          text-decoration-line: underline;
        }
      }
    `)
  })
})

it('including just the base layer should not produce variants', () => {
  let config = {
    content: [{ raw: html`<div class="sm:container sm:underline"></div>` }],
    corePlugins: { preflight: false },
  }

  return run('@tailwind base', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(
      css`
        ${defaults}
      `
    )
  })
})

it('variants for components should not be produced in a file without a components layer', () => {
  let config = {
    content: [{ raw: html`<div class="sm:container sm:underline"></div>` }],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 640px) {
        .sm\:underline {
          text-decoration-line: underline;
        }
      }
    `)
  })
})

it('variants for utilities should not be produced in a file without a utilities layer', () => {
  let config = {
    content: [{ raw: html`<div class="sm:container sm:underline"></div>` }],
  }

  return run('@tailwind components', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 640px) {
        .sm\:container {
          width: 100%;
        }
        @media (min-width: 640px) {
          .sm\:container {
            max-width: 640px;
          }
        }
        @media (min-width: 768px) {
          .sm\:container {
            max-width: 768px;
          }
        }
        @media (min-width: 1024px) {
          .sm\:container {
            max-width: 1024px;
          }
        }
        @media (min-width: 1280px) {
          .sm\:container {
            max-width: 1280px;
          }
        }
        @media (min-width: 1536px) {
          .sm\:container {
            max-width: 1536px;
          }
        }
      }
    `)
  })
})

test('The visited variant removes opacity support', () => {
  let config = {
    content: [
      {
        raw: html`
          <a class="visited:border-red-500 visited:bg-red-500 visited:text-red-500"
            >Look, it's a link!</a
          >
        `,
      },
    ],
    plugins: [],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .visited\:border-red-500:visited {
        border-color: rgb(239 68 68);
      }
      .visited\:bg-red-500:visited {
        background-color: rgb(239 68 68);
      }
      .visited\:text-red-500:visited {
        color: rgb(239 68 68);
      }
    `)
  })
})

it('appends variants to the correct place when using postcss documents', () => {
  let config = {
    content: [{ raw: html`<div class="underline sm:underline"></div>` }],
    plugins: [],
    corePlugins: { preflight: false },
  }

  const doc = postcss.document()
  doc.append(postcss.parse(`a {}`))
  doc.append(postcss.parse(`@tailwind base`))
  doc.append(postcss.parse(`@tailwind utilities`))
  doc.append(postcss.parse(`b {}`))

  const result = doc.toResult()

  return run(result, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      a {
      }
      ${defaults}
      .underline {
        text-decoration-line: underline;
      }
      @media (min-width: 640px) {
        .sm\:underline {
          text-decoration-line: underline;
        }
      }
      b {
      }
    `)
  })
})

it('variants support multiple, grouped selectors (html)', () => {
  let config = {
    content: [{ raw: html`<div class="sm:base1 sm:base2"></div>` }],
    plugins: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      .base1 .foo,
      .base1 .bar {
        color: red;
      }

      .base2 .bar .base2-foo {
        color: red;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 640px) {
        .sm\:base1 .foo,
        .sm\:base1 .bar {
          color: red;
        }

        .sm\:base2 .bar .base2-foo {
          color: red;
        }
      }
    `)
  })
})

it('variants support multiple, grouped selectors (apply)', () => {
  let config = {
    content: [{ raw: html`<div class="baz"></div>` }],
    plugins: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      .base .foo,
      .base .bar {
        color: red;
      }
    }
    .baz {
      @apply sm:base;
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 640px) {
        .baz .foo,
        .baz .bar {
          color: red;
        }
      }
    `)
  })
})

it('variants only picks the used selectors in a group (html)', () => {
  let config = {
    content: [{ raw: html`<div class="sm:b"></div>` }],
    plugins: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      .a,
      .b {
        color: red;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 640px) {
        .sm\:b {
          color: red;
        }
      }
    `)
  })
})

it('variants only picks the used selectors in a group (apply)', () => {
  let config = {
    content: [{ raw: html`<div class="baz"></div>` }],
    plugins: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      .a,
      .b {
        color: red;
      }
    }
    .baz {
      @apply sm:b;
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 640px) {
        .baz {
          color: red;
        }
      }
    `)
  })
})

test('hoverOnlyWhenSupported adds hover and pointer media features by default', () => {
  let config = {
    future: {
      hoverOnlyWhenSupported: true,
    },
    content: [
      { raw: html`<div class="hover:underline group-hover:underline peer-hover:underline"></div>` },
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

      @media (hover: hover) and (pointer: fine) {
        .hover\:underline:hover {
          text-decoration-line: underline;
        }
        .group:hover .group-hover\:underline {
          text-decoration-line: underline;
        }
        .peer:hover ~ .peer-hover\:underline {
          text-decoration-line: underline;
        }
      }
    `)
  })
})
