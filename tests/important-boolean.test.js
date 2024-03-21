import fs from 'fs'
import path from 'path'
import * as sharedState from '../src/lib/sharedState'

import { run, html, css, defaults } from './util/run'

test('important boolean', () => {
  let config = {
    important: true,
    darkMode: 'selector',
    content: [
      {
        raw: html`
          <div class="container"></div>
          <div class="btn"></div>
          <div class="animate-spin"></div>
          <div class="custom-util"></div>
          <div class="custom-component"></div>
          <div class="custom-important-component"></div>
          <div class="font-bold"></div>
          <div class="md:hover:text-right"></div>
          <div class="motion-safe:hover:text-center"></div>
          <div class="dark:focus:text-left"></div>
          <div class="group-hover:focus-within:text-left"></div>
          <div class="rtl:active:text-center"></div>
        `,
      },
    ],
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
    expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      .container {
        width: 100%;
      }
      @media (min-width: 640px) {
        .container {
          max-width: 640px;
        }
      }
      @media (min-width: 768px) {
        .container {
          max-width: 768px;
        }
      }
      @media (min-width: 1024px) {
        .container {
          max-width: 1024px;
        }
      }
      @media (min-width: 1280px) {
        .container {
          max-width: 1280px;
        }
      }
      @media (min-width: 1536px) {
        .container {
          max-width: 1536px;
        }
      }
      .btn {
        button: yes !important;
      }
      @font-face {
        font-family: Inter;
      }
      @page {
        margin: 1cm;
      }
      .custom-component {
        font-weight: 700;
      }
      .custom-important-component {
        text-align: center !important;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .animate-spin {
        animation: 1s linear infinite spin !important;
      }
      .font-bold {
        font-weight: 700 !important;
      }
      .custom-util {
        button: no;
      }
      .group:hover .group-hover\:focus-within\:text-left:focus-within {
        text-align: left !important;
      }
      @media (prefers-reduced-motion: no-preference) {
        .motion-safe\:hover\:text-center:hover {
          text-align: center !important;
        }
      }
      @media (min-width: 768px) {
        .md\:hover\:text-right:hover {
          text-align: right !important;
        }
      }
      .rtl\:active\:text-center:active:where([dir='rtl'], [dir='rtl'] *) {
        text-align: center !important;
      }
      .dark\:focus\:text-left:focus:where(.dark, .dark *) {
        text-align: left !important;
      }
    `)
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
