import fs from 'fs'
import path from 'path'

import { run } from './util/run'

test('prefix fn', () => {
  let config = {
    prefix(selector) {
      if (['.align-bottom', '.ml'].some((prefix) => selector.startsWith(prefix))) {
        return 'tw-'
      }

      return ''
    },
    content: [path.resolve(__dirname, './prefix.fn.test.html')],
    corePlugins: { preflight: false },
  }

  return run('@tailwind utilities', config).then((result) => {
    let expectedPath = path.resolve(__dirname, './prefix.fn.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
