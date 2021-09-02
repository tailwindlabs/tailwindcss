import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

test('important boolean', () => {
  let config = {
    important: true,
    darkMode: 'class',
    content: [path.resolve(__dirname, './important-boolean.test.html')],
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
    let expectedPath = path.resolve(__dirname, './important-boolean.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
