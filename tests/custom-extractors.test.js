import fs from 'fs'
import path from 'path'

import { run } from './util/run'

function customExtractor(content) {
  let matches = content.match(/class="([^"]+)"/)
  return matches ? matches[1].split(/\s+/) : []
}

let expectedPath = path.resolve(__dirname, './custom-extractors.test.css')
let expected = fs.readFileSync(expectedPath, 'utf8')

describe('modern', () => {
  test('extract.DEFAULT', () => {
    let config = {
      content: {
        files: [path.resolve(__dirname, './custom-extractors.test.html')],
        extract: {
          DEFAULT: customExtractor,
        },
      },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(expected)
    })
  })

  test('extract.{extension}', () => {
    let config = {
      content: {
        files: [path.resolve(__dirname, './custom-extractors.test.html')],
        extract: {
          html: customExtractor,
        },
      },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(expected)
    })
  })

  test('extract function', () => {
    let config = {
      content: {
        files: [path.resolve(__dirname, './custom-extractors.test.html')],
        extract: customExtractor,
      },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(expected)
    })
  })
})

describe('legacy', () => {
  test('defaultExtractor', () => {
    let config = {
      content: {
        files: [path.resolve(__dirname, './custom-extractors.test.html')],
        options: {
          defaultExtractor: customExtractor,
        },
      },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(expected)
    })
  })

  test('extractors array', () => {
    let config = {
      content: {
        files: [path.resolve(__dirname, './custom-extractors.test.html')],
        options: {
          extractors: [
            {
              extractor: customExtractor,
              extensions: ['html'],
            },
          ],
        },
      },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(expected)
    })
  })
})
