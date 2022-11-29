import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

it('raw content', () => {
  let config = {
    content: [{ raw: fs.readFileSync(path.resolve(__dirname, './raw-content.test.html'), 'utf8') }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './raw-content.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
