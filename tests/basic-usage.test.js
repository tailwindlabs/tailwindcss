import fs from 'fs'
import path from 'path'

import { html, run, css } from './util/run'

test('basic usage', () => {
  let config = {
    content: [path.resolve(__dirname, './basic-usage.test.html')],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './basic-usage.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('all plugins are executed that match a candidate', () => {
  let config = {
    content: [{ raw: html`<div class="bg-green-light bg-green"></div>` }],
    theme: {
      colors: {
        green: {
          light: 'green',
        },
      },
    },
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;

    .bg-green {
      /* Empty on purpose */
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-green-light {
        --tw-bg-opacity: 1;
        background-color: rgb(0 128 0 / var(--tw-bg-opacity));
      }

      .bg-green {
        /* Empty on purpose */
      }
    `)
  })
})

test('per-plugin colors with the same key can differ when using a custom colors object', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="bg-theme text-theme">This should be green text on red background.</div>
        `,
      },
    ],
    theme: {
      // colors & theme MUST be plain objects
      // If they're functions here the test passes regardless
      colors: {
        theme: {
          bg: 'red',
          text: 'green',
        },
      },
      extend: {
        textColor: {
          theme: {
            DEFAULT: 'green',
          },
        },
        backgroundColor: {
          theme: {
            DEFAULT: 'red',
          },
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
      .bg-theme {
        --tw-bg-opacity: 1;
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
      }
      .text-theme {
        --tw-text-opacity: 1;
        color: rgb(0 128 0 / var(--tw-text-opacity));
      }
    `)
  })
})
