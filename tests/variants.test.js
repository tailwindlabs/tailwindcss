import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

test('variants', () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './variants.test.html')],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './variants.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('stacked peer variants', async () => {
  let config = {
    content: [{ raw: 'peer-disabled:peer-focus:peer-hover:border-blue-500' }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  let expected = css`
    .peer:disabled:focus:hover ~ .peer-disabled\\:peer-focus\\:peer-hover\\:border-blue-500 {
      --tw-border-opacity: 1;
      border-color: rgba(59, 130, 246, var(--tw-border-opacity));
    }
  `

  let result = await run(input, config)
  expect(result.css).toIncludeCss(expected)
})
