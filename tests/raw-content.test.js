import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

beforeEach(() => jest.resetModules())

test('raw content', () => {
  let tailwind = require('../src')
  let config = {
    content: [{ raw: fs.readFileSync(path.resolve(__dirname, './raw-content.test.html'), 'utf8') }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config, tailwind).then((result) => {
    let expectedPath = path.resolve(__dirname, './raw-content.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('raw content with extension', () => {
  let tailwind = require('../src')
  let config = {
    content: {
      files: [
        {
          raw: fs.readFileSync(path.resolve(__dirname, './raw-content.test.html'), 'utf8'),
          extension: 'html',
        },
      ],
      extract: {
        html: () => ['invisible'],
      },
    },
    corePlugins: { preflight: false },
  }

  return run('@tailwind utilities', config, tailwind).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .invisible {
        visibility: hidden;
      }
    `)
  })
})
