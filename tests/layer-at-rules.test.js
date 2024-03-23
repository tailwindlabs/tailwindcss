import { run, html, css, defaults } from './util/run'

test('custom user-land utilities', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="focus:hover:align-chocolate align-banana hover:align-banana uppercase"
        ></div>`,
      },
    ],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @layer utilities {
      .align-banana {
        text-align: banana;
      }
    }

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer utilities {
      .align-chocolate {
        text-align: chocolate;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      .uppercase {
        text-transform: uppercase;
      }
      .align-banana,
      .hover\:align-banana:hover {
        text-align: banana;
      }
      .focus\:hover\:align-chocolate:hover:focus {
        text-align: chocolate;
      }
    `)
  })
})

test('comments can be used inside layers without crashing', () => {
  let config = {
    content: [
      {
        raw: html`<div class="important-utility important-component"></div>`,
      },
    ],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer base {
      /* Important base */
      div {
        background-color: #bada55;
      }
    }

    @layer utilities {
      /* Important utility */
      .important-utility {
        text-align: banana;
      }
    }

    @layer components {
      /* Important component */
      .important-component {
        text-align: banana;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      div {
        background-color: #bada55;
      }
      ${defaults}
      .important-component,
        .important-utility {
        text-align: banana;
      }
    `)
  })
})

test('comments can be used inside layers (with important) without crashing', () => {
  let config = {
    important: true,
    content: [
      {
        raw: html`<div class="important-utility important-component"></div>`,
      },
    ],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer base {
      /* Important base */
      div {
        background-color: #bada55;
      }
    }

    @layer utilities {
      /* Important utility */
      .important-utility {
        text-align: banana;
      }
    }

    @layer components {
      /* Important component */
      .important-component {
        text-align: banana;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      div {
        background-color: #bada55;
      }
      ${defaults}
      .important-component {
        text-align: banana;
      }
      .important-utility {
        text-align: banana !important;
      }
    `)
  })
})

test('layers are grouped and inserted at the matching @tailwind rule', () => {
  let config = {
    content: [
      {
        raw: html`<div class="input btn card float-squirrel align-banana align-sandwich"></div>`,
      },
    ],
    plugins: [
      function ({ addBase, addComponents, addUtilities }) {
        addBase({ body: { margin: 0 } })

        addComponents({
          '.input': { background: 'white' },
        })

        addUtilities({
          '.float-squirrel': { float: 'squirrel' },
        })
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @layer vanilla {
      strong {
        font-weight: medium;
      }
    }

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .btn {
        background: blue;
      }
    }

    @layer utilities {
      .align-banana {
        text-align: banana;
      }
    }

    @layer base {
      h1 {
        font-weight: bold;
      }
    }

    @layer components {
      .card {
        border-radius: 12px;
      }
    }

    @layer base {
      p {
        font-weight: normal;
      }
    }

    @layer utilities {
      .align-sandwich {
        text-align: sandwich;
      }
    }

    @layer chocolate {
      a {
        text-decoration: underline;
      }
    }
  `

  expect.assertions(2)

  return run(input, config).then((result) => {
    expect(result.warnings().length).toBe(0)
    expect(result.css).toMatchFormattedCss(css`
      @layer vanilla {
        strong {
          font-weight: medium;
        }
      }
      body {
        margin: 0;
      }
      h1 {
        font-weight: bold;
      }
      p {
        font-weight: normal;
      }
      ${defaults}
      .input {
        background: #fff;
      }
      .btn {
        background: #00f;
      }
      .card {
        border-radius: 12px;
      }
      .float-squirrel {
        float: squirrel;
      }
      .align-banana {
        text-align: banana;
      }
      .align-sandwich {
        text-align: sandwich;
      }
      @layer chocolate {
        a {
          text-decoration: underline;
        }
      }
    `)
  })
})

it('should keep `@supports` rules inside `@layer`s', () => {
  let config = {
    content: [{ raw: html`<div class="test"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      .test {
        --tw-test: 1;
      }

      @supports (backdrop-filter: blur(1px)) {
        .test {
          --tw-test: 0.9;
        }
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .test {
        --tw-test: 1;
      }
      @supports (backdrop-filter: blur(1px)) {
        .test {
          --tw-test: 0.9;
        }
      }
    `)
  })
})
