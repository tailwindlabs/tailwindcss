import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import { run, html, css, defaults } from './util/run'

test('variants', () => {
  let config = {
    darkMode: 'selector',
    content: [path.resolve(__dirname, './variants.test.html')],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(
      fs.readFileSync(path.resolve(__dirname, './variants.test.css'), 'utf8')
    )
  })
})

test('order matters and produces different behaviour', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="hover:file:[--value:1]"></div>
          <div class="file:hover:[--value:2]"></div>
        `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .hover\:file\:\[--value\:1\]::-webkit-file-upload-button:hover {
        --value: 1;
      }
      .hover\:file\:\[--value\:1\]::file-selector-button:hover {
        --value: 1;
      }
      .file\:hover\:\[--value\:2\]:hover::-webkit-file-upload-button {
        --value: 2;
      }
      .file\:hover\:\[--value\:2\]:hover::file-selector-button {
        --value: 2;
      }
    `)
  })
})

describe('custom advanced variants', () => {
  test('at-rules without params', () => {
    let config = {
      content: [
        {
          raw: html` <div class="ogre:text-center"></div> `,
        },
      ],
      plugins: [
        function ({ addVariant }) {
          addVariant('ogre', '@layer')
        },
      ],
    }

    return run('@tailwind components; @tailwind utilities', config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        @layer {
          .ogre\:text-center {
            text-align: center;
          }
        }
      `)
    })
  })

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
        :where(.hover\:prose-headings\:text-center) :is(h1, h2, h3, h4):hover,
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
        .group:hover :where(.group-hover\:prose-headings\:text-center) :is(h1, h2, h3, h4),
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
          .screen\:parent .child,
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

  it('should allow modifiers with dashes', () => {
    let config = {
      content: [
        {
          raw: html`<div class="group-has-[[data-test=test]]/test-modifier:block"></div>`,
        },
      ],
      plugins: [],
    }

    return run('@tailwind utilities', config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        .group\/test-modifier:has([data-test='test'])
          .group-has-\[\[data-test\=test\]\]\/test-modifier\:block {
          display: block;
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

  let result = await run(input, config)
  expect(result.css).toIncludeCss(css`
    .peer:disabled:focus:hover ~ .peer-disabled\:peer-focus\:peer-hover\:border-blue-500 {
      --tw-border-opacity: 1;
      border-color: rgb(59 130 246 / var(--tw-border-opacity));
    }
  `)
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
      animation: 1s linear infinite spin;
    }
    @keyframes bounce {
      0%,
      100% {
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        transform: translateY(-25%);
      }
      50% {
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        transform: none;
      }
    }
    .hover\:animate-bounce:hover {
      animation: 1s infinite bounce;
    }
    .hover\:animate-spin:hover {
      animation: 1s linear infinite spin;
    }
    .focus\:animate-bounce:focus {
      animation: 1s infinite bounce;
    }
    .focus\:animate-spin:focus {
      animation: 1s linear infinite spin;
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
        addVariant('magic', '@media screen and (max-width: 600px)')
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      @media screen and (max-width: 600px) {
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
      .before\:hover\:text-center:hover:before,
      .hover\:before\:text-center:hover:before {
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
      :where(.before\:prose-headings\:text-center) :is(h1, h2, h3, h4):before,
      :where(.prose-headings\:before\:text-center) :is(h1, h2, h3, h4):before {
        content: var(--tw-content);
        text-align: center;
      }
    `)
  })
})

test('returning non-strings and non-selectors in addVariant', () => {
  /** @type {import('../types/config').Config} */
  let config = {
    content: [
      {
        raw: html`
          <div class="peer-aria-expanded:text-center"></div>
          <div class="peer-aria-expanded-2:text-center"></div>
        `,
      },
    ],
    plugins: [
      function ({ addVariant, e }) {
        addVariant('peer-aria-expanded', ({ modifySelectors, separator }) =>
          // Returning anything other string | string[] | undefined here is not supported
          // But we're trying to be lenient here and just throw it out
          modifySelectors(
            ({ className }) =>
              `.peer[aria-expanded="true"] ~ .${e(`peer-aria-expanded${separator}${className}`)}`
          )
        )

        addVariant('peer-aria-expanded-2', ({ modifySelectors, separator }) => {
          let nodes = modifySelectors(
            ({ className }) => `.${e(`peer-aria-expanded-2${separator}${className}`)}`
          )

          return [
            // Returning anything other than strings here is not supported
            // But we're trying to be lenient here and just throw it out
            nodes,
            '.peer[aria-expanded="false"] ~ &',
          ]
        })
      },
    ],
  }

  return run('@tailwind components;@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .peer[aria-expanded='true'] ~ .peer-aria-expanded\:text-center,
      .peer[aria-expanded='false'] ~ .peer-aria-expanded-2\:text-center {
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
        border-color: #ef4444;
      }
      .visited\:bg-red-500:visited {
        background-color: #ef4444;
      }
      .visited\:text-red-500:visited {
        color: #ef4444;
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
      ${defaults}
      .underline {
        text-decoration-line: underline;
      }
      @media (min-width: 640px) {
        .sm\:underline {
          text-decoration-line: underline;
        }
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
        .sm\:base1 .bar,
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
      {
        raw: html`<div class="hover:underline group-hover:underline peer-hover:underline"></div>`,
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
      @media (hover: hover) and (pointer: fine) {
        .hover\:underline:hover,
        .group:hover .group-hover\:underline,
        .peer:hover ~ .peer-hover\:underline {
          text-decoration-line: underline;
        }
      }
    `)
  })
})

test('multi-class utilities handle selector-mutating variants correctly', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="after:foo after:bar after:baz hover:foo hover:bar hover:baz group-hover:foo group-hover:bar group-hover:baz peer-checked:foo peer-checked:bar peer-checked:baz"
        ></div>`,
      },
      {
        raw: html`<div
          class="after:foo1 after:bar1 after:baz1 hover:foo1 hover:bar1 hover:baz1 group-hover:foo1 group-hover:bar1 group-hover:baz1 peer-checked:foo1 peer-checked:bar1 peer-checked:baz1"
        ></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      .foo.bar.baz {
        color: red;
      }
      .foo1 .bar1 .baz1 {
        color: red;
      }
    }
  `

  // The second set of ::after cases (w/ descendant selectors)
  // are clearly "wrong" BUT you can't have a descendant of a
  // pseudo - element so the utilities `after:foo1` and
  // `after:bar1` are non-sensical so this is still
  // perfectly fine behavior

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .after\:foo.bar.baz:after,
      .after\:bar.foo.baz:after,
      .after\:baz.foo.bar:after,
      .after\:foo1 .bar1 .baz1:after,
      .foo1 .after\:bar1 .baz1:after,
      .foo1 .bar1 .after\:baz1:after {
        content: var(--tw-content);
        color: red;
      }
      .hover\:foo:hover.bar.baz,
      .hover\:bar:hover.foo.baz,
      .hover\:baz:hover.foo.bar,
      .hover\:foo1:hover .bar1 .baz1,
      .foo1 .hover\:bar1:hover .baz1,
      .foo1 .bar1 .hover\:baz1:hover,
      .group:hover .group-hover\:foo.bar.baz,
      .group:hover .group-hover\:bar.foo.baz,
      .group:hover .group-hover\:baz.foo.bar,
      .group:hover .group-hover\:foo1 .bar1 .baz1,
      .foo1 .group:hover .group-hover\:bar1 .baz1,
      .foo1 .bar1 .group:hover .group-hover\:baz1,
      .peer:checked ~ .peer-checked\:foo.bar.baz,
      .peer:checked ~ .peer-checked\:bar.foo.baz,
      .peer:checked ~ .peer-checked\:baz.foo.bar,
      .peer:checked ~ .peer-checked\:foo1 .bar1 .baz1,
      .foo1 .peer:checked ~ .peer-checked\:bar1 .baz1,
      .foo1 .bar1 .peer:checked ~ .peer-checked\:baz1 {
        color: red;
      }
    `)
  })
})

test('class inside pseudo-class function :has', () => {
  let config = {
    content: [
      { raw: html`<div class="foo hover:foo sm:foo"></div>` },
      { raw: html`<div class="bar hover:bar sm:bar"></div>` },
      { raw: html`<div class="baz hover:baz sm:baz"></div>` },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      :where(.foo) {
        color: red;
      }
      :is(.foo, .bar, .baz) {
        color: orange;
      }
      :is(.foo) {
        color: yellow;
      }
      html:has(.foo) {
        color: green;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      :where(.foo) {
        color: red;
      }
      :is(.foo, .bar, .baz) {
        color: orange;
      }
      .foo {
        color: #ff0;
      }
      html:has(.foo) {
        color: green;
      }
      :where(.hover\:foo:hover) {
        color: red;
      }
      :is(.hover\:foo:hover, .bar, .baz),
      :is(.foo, .hover\:bar:hover, .baz),
      :is(.foo, .bar, .hover\:baz:hover) {
        color: orange;
      }
      .hover\:foo:hover {
        color: #ff0;
      }
      html:has(.hover\:foo:hover) {
        color: green;
      }
      @media (min-width: 640px) {
        :where(.sm\:foo) {
          color: red;
        }
        :is(.sm\:foo, .bar, .baz),
        :is(.foo, .sm\:bar, .baz),
        :is(.foo, .bar, .sm\:baz) {
          color: orange;
        }
        .sm\:foo {
          color: #ff0;
        }
        html:has(.sm\:foo) {
          color: green;
        }
      }
    `)
  })
})

test('variant functions returning arrays should output correct results when nesting', async () => {
  let config = {
    content: [{ raw: html`<div class="test:foo" />` }],
    corePlugins: { preflight: false },
    plugins: [
      function ({ addUtilities, addVariant }) {
        addVariant('test', () => ['@media (test)'])
        addUtilities({
          '.foo': {
            display: 'grid',
            '> *': {
              'grid-column': 'span 2',
            },
          },
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    @media (test) {
      .test\:foo {
        display: grid;
      }
      .test\:foo > * {
        grid-column: span 2;
      }
    }
  `)
})

test('variants with slashes in them work', () => {
  let config = {
    content: [
      {
        raw: html` <div class="ar-1/10:text-red-500">ar-1/10</div> `,
      },
    ],
    theme: {
      extend: {
        screens: {
          'ar-1/10': { raw: '(min-aspect-ratio: 1/10)' },
        },
      },
    },
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-aspect-ratio: 1 / 10) {
        .ar-1\/10\:text-red-500 {
          --tw-text-opacity: 1;
          color: rgb(239 68 68 / var(--tw-text-opacity));
        }
      }
    `)
  })
})

test('variants with slashes support modifiers', () => {
  let config = {
    content: [
      {
        raw: html` <div class="ar-1/10/20:text-red-500">ar-1/10</div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      function ({ matchVariant }) {
        matchVariant(
          'ar',
          (value, { modifier }) => {
            return [`@media (min-aspect-ratio: ${value}) and (foo: ${modifier})`]
          },
          { values: { '1/10': '1/10' } }
        )
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-aspect-ratio: 1 / 10) and (foo: 20) {
        .ar-1\/10\/20\:text-red-500 {
          --tw-text-opacity: 1;
          color: rgb(239 68 68 / var(--tw-text-opacity));
        }
      }
    `)
  })
})

test('arbitrary variant selectors should not re-order scrollbar pseudo classes', async () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="[&::-webkit-scrollbar:hover]:underline" />
          <div class="[&::-webkit-scrollbar-button:hover]:underline" />
          <div class="[&::-webkit-scrollbar-thumb:hover]:underline" />
          <div class="[&::-webkit-scrollbar-track:hover]:underline" />
          <div class="[&::-webkit-scrollbar-track-piece:hover]:underline" />
          <div class="[&::-webkit-scrollbar-corner:hover]:underline" />
          <div class="[&::-webkit-resizer:hover]:underline" />
        `,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .\[\&\:\:-webkit-resizer\:hover\]\:underline::-webkit-resizer:hover {
      text-decoration-line: underline;
    }
    .\[\&\:\:-webkit-scrollbar-button\:hover\]\:underline::-webkit-scrollbar-button:hover {
      text-decoration-line: underline;
    }
    .\[\&\:\:-webkit-scrollbar-corner\:hover\]\:underline::-webkit-scrollbar-corner:hover {
      text-decoration-line: underline;
    }
    .\[\&\:\:-webkit-scrollbar-thumb\:hover\]\:underline::-webkit-scrollbar-thumb:hover {
      text-decoration-line: underline;
    }
    .\[\&\:\:-webkit-scrollbar-track-piece\:hover\]\:underline::-webkit-scrollbar-track-piece:hover {
      text-decoration-line: underline;
    }
    .\[\&\:\:-webkit-scrollbar-track\:hover\]\:underline::-webkit-scrollbar-track:hover {
      text-decoration-line: underline;
    }
    .\[\&\:\:-webkit-scrollbar\:hover\]\:underline::-webkit-scrollbar:hover {
      text-decoration-line: underline;
    }
  `)
})

test('stacking dark and rtl variants', async () => {
  let config = {
    darkMode: 'selector',
    content: [
      {
        raw: html`<div class="dark:rtl:italic" />`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .dark\:rtl\:italic:where([dir='rtl'], [dir='rtl'] *):where(.dark, .dark *) {
      font-style: italic;
    }
  `)
})

test('stacking dark and rtl variants with pseudo elements', async () => {
  let config = {
    darkMode: 'selector',
    content: [
      {
        raw: html`<div class="dark:rtl:placeholder:italic" />`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .dark\:rtl\:placeholder\:italic:where([dir='rtl'], [dir='rtl'] *):where(
        .dark,
        .dark *
      )::placeholder {
      font-style: italic;
    }
  `)
})

test('* is matched by the parser as the children variant', async () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="*:italic" />
          <div class="*:hover:italic" />
          <div class="hover:*:italic" />
          <div class="data-[slot=label]:*:hover:italic" />
          <div class="[&_p]:*:hover:italic" />
        `,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .\*\:italic > *,
    .\*\:hover\:italic:hover > *,
    .hover\:\*\:italic > :hover,
    .data-\[slot\=label\]\:\*\:hover\:italic:hover > [data-slot='label'],
    .\[\&_p\]\:\*\:hover\:italic:hover > * p {
      font-style: italic;
    }
  `)
})
