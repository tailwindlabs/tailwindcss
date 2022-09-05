import fs from 'fs'
import path from 'path'
import * as sharedState from '../src/lib/sharedState'

import { run, css, html } from './util/run'

test('important boolean', () => {
  let config = {
    important: true,
    darkMode: 'class',
    content: [path.resolve(__dirname, './important-boolean.test.html')],
    corePlugins: { preflight: false },
    plugins: [
      function ({ addComponents, addUtilities }) {
        addComponents(
          {
            '.btn': {
              button: 'yes',
            },
          },
          { respectImportant: true }
        )
        addComponents(
          {
            '@font-face': {
              'font-family': 'Inter',
            },
            '@page': {
              margin: '1cm',
            },
          },
          { respectImportant: true }
        )
        addUtilities(
          {
            '.custom-util': {
              button: 'no',
            },
          },
          { respectImportant: false }
        )
      },
    ],
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @layer components {
      .custom-component {
        @apply font-bold;
      }
      .custom-important-component {
        @apply text-center !important;
      }
    }
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './important-boolean.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

// This is in a describe block so we can use `afterEach` :)
describe('duplicate elision', () => {
  let filePath = path.resolve(__dirname, './important-boolean-duplicates.test.html')

  afterEach(async () => await fs.promises.unlink(filePath))

  test('important rules are not duplicated when rebuilding', async () => {
    let config = {
      important: true,
      content: [filePath],
    }

    await fs.promises.writeFile(
      config.content[0],
      html`
        <div class="ml-2"></div>
        <div class="ml-4"></div>
      `
    )

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)
    let allContexts = Array.from(sharedState.contextMap.values())

    let context = allContexts[allContexts.length - 1]

    let ruleCacheSize1 = context.ruleCache.size

    expect(result.css).toMatchFormattedCss(css`
      .ml-2 {
        margin-left: 0.5rem !important;
      }
      .ml-4 {
        margin-left: 1rem !important;
      }
    `)

    await fs.promises.writeFile(
      config.content[0],
      html`
        <div class="ml-2"></div>
        <div class="ml-6"></div>
      `
    )

    result = await run(input, config)

    let ruleCacheSize2 = context.ruleCache.size

    expect(result.css).toMatchFormattedCss(css`
      .ml-2 {
        margin-left: 0.5rem !important;
      }
      .ml-4 {
        margin-left: 1rem !important;
      }
      .ml-6 {
        margin-left: 1.5rem !important;
      }
    `)

    // The rule cache was effectively doubling in size previously
    // because the rule cache was never de-duped
    // This ensures this behavior doesn't return
    expect(ruleCacheSize2 - ruleCacheSize1).toBeLessThan(10)
  })
})
