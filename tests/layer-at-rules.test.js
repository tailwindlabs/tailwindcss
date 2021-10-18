import { run, html, css } from './util/run'

test('custom user-land utilities', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="uppercase focus:hover:align-chocolate align-banana hover:align-banana"
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
      .uppercase {
        text-transform: uppercase;
      }
      .align-banana {
        text-align: banana;
      }
      .hover\:align-banana:hover {
        text-align: banana;
      }
      .focus\:hover\:align-chocolate:hover:focus {
        text-align: chocolate;
      }
    `)
  })
})

test('layers are grouped and inserted at the matching @tailwind rule', () => {
  let config = {
    content: [
      { raw: html`<div class="input btn card float-squirrel align-banana align-sandwich"></div>` },
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

      .input {
        background: white;
      }

      .btn {
        background: blue;
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
