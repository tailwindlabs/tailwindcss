import { unlink, writeFile } from 'node:fs/promises'
import postcss from 'postcss'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import tailwindcss from './index'

// We give this file path to PostCSS for processing.
// This file doesn't exist, but the path is used to resolve imports.
// We place it in packages/ because Vitest runs in the monorepo root,
// and packages/tailwindcss must be a sub-folder for
// @import 'tailwindcss' to work.
const INPUT_CSS_PATH = `${__dirname}/fixtures/example-project/input.css`

const css = String.raw

beforeEach(async () => {
  const { clearCache } = await import('@tailwindcss/oxide')
  clearCache()
})

test("`@import 'tailwindcss'` is replaced with the generated CSS", async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  let result = await processor.process(`@import 'tailwindcss'`, { from: INPUT_CSS_PATH })

  expect(result.css.trim()).toMatchSnapshot()

  // Check for dependency messages
  expect(result.messages).toContainEqual({
    type: 'dependency',
    file: expect.stringMatching(/index.html$/g),
    parent: expect.any(String),
    plugin: expect.any(String),
  })
  expect(result.messages).toContainEqual({
    type: 'dependency',
    file: expect.stringMatching(/index.js$/g),
    parent: expect.any(String),
    plugin: expect.any(String),
  })
  expect(result.messages).toContainEqual({
    type: 'dir-dependency',
    dir: expect.stringMatching(/example-project\/src$/g),
    glob: expect.stringMatching(/^\*\*\/\*/g),
    parent: expect.any(String),
    plugin: expect.any(String),
  })
})

test('output is optimized by Lightning CSS', async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  // `@apply` is used because Lightning is skipped if neither `@tailwind` nor
  // `@apply` is used.
  let result = await processor.process(
    css`
      @layer utilities {
        .foo {
          @apply text-[black];
        }
      }

      @layer utilities {
        .bar {
          color: red;
        }
      }
    `,
    { from: INPUT_CSS_PATH },
  )

  expect(result.css.trim()).toMatchInlineSnapshot(`
    "@layer utilities {
      .foo {
        color: #000;
      }

      .bar {
        color: red;
      }
    }"
  `)
})

test('@apply can be used without emitting the theme in the CSS file', async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  // `@apply` is used because Lightning is skipped if neither `@tailwind` nor
  // `@apply` is used.
  let result = await processor.process(
    css`
      @import 'tailwindcss/theme.css' reference;
      .foo {
        @apply text-red-500;
      }
    `,
    { from: INPUT_CSS_PATH },
  )

  expect(result.css.trim()).toMatchInlineSnapshot(`
    ".foo {
      color: var(--color-red-500, #ef4444);
    }"
  `)
})

describe('processing without specifying a base path', () => {
  let filepath = `${process.cwd()}/my-test-file.html`

  beforeEach(() =>
    writeFile(filepath, `<div class="md:[&:hover]:content-['testing_default_base_path']">`),
  )
  afterEach(() => unlink(filepath))

  test('the current working directory is used by default', async () => {
    let processor = postcss([tailwindcss({ optimize: { minify: false } })])

    let result = await processor.process(`@import "tailwindcss"`, { from: INPUT_CSS_PATH })

    expect(result.css).toContain(
      ".md\\:\\[\\&\\:hover\\]\\:content-\\[\\'testing_default_base_path\\'\\]",
    )

    expect(result.messages).toContainEqual({
      type: 'dependency',
      file: expect.stringMatching(/my-test-file.html$/g),
      parent: expect.any(String),
      plugin: expect.any(String),
    })
  })
})
