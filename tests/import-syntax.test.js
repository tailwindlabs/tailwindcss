import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

test('using @import instead of @tailwind', () => {
  let config = {
    content: [path.resolve(__dirname, './import-syntax.test.html')],
    corePlugins: { preflight: false },
    plugins: [
      function ({ addBase }) {
        addBase({
          h1: {
            fontSize: '32px',
          },
        })
      },
    ],
  }

  let input = css`
    @import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './import-syntax.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
