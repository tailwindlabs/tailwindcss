import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

test('basic usage', () => {
  let config = {
    content: [path.resolve(__dirname, './svelte-syntax.test.svelte')],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './svelte-syntax.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
