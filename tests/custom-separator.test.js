import fs from 'fs'
import path from 'path'

import { run } from './util/run'

test('custom separator', () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './custom-separator.test.html')],
    separator: '_',
  }

  return run('@tailwind utilities', config).then((result) => {
    let expectedPath = path.resolve(__dirname, './custom-separator.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('dash is not supported', () => {
  let config = {
    darkMode: 'class',
    content: [{ raw: 'lg-hover-font-bold' }],
    separator: '-',
  }

  return expect(run('@tailwind utilities', config)).rejects.toThrowError(
    "The '-' character cannot be used as a custom separator in JIT mode due to parsing ambiguity. Please use another character like '_' instead."
  )
})
