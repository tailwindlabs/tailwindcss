import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

test('important modifier', () => {
  let config = {
    important: false,
    darkMode: 'class',
    content: [path.resolve(__dirname, './important-modifier.test.html')],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './important-modifier.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
