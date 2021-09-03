import fs from 'fs'
import path from 'path'

import { run } from './util/run'

test('opacity', () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './opacity.test.html')],
    corePlugins: {
      backgroundOpacity: false,
      borderOpacity: false,
      divideOpacity: false,
      placeholderOpacity: false,
      textOpacity: false,
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    let expectedPath = path.resolve(__dirname, './opacity.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchCss(expected)
  })
})
