import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

test('important modifier with prefix', () => {
  let config = {
    important: false,
    prefix: 'tw-',
    darkMode: 'class',
    content: [path.resolve(__dirname, './important-modifier-prefix.test.html')],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './important-modifier-prefix.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
