import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

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
