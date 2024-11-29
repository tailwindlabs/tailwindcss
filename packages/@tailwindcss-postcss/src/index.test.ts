import dedent from 'dedent'
import { unlink, writeFile } from 'node:fs/promises'
import postcss from 'postcss'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
// @ts-ignore
import tailwindcss from './index'

// We give this file path to PostCSS for processing.
// This file doesn't exist, but the path is used to resolve imports.
// We place it in packages/ because Vitest runs in the monorepo root,
// and packages/tailwindcss must be a sub-folder for
// @import 'tailwindcss' to work.
function inputCssFilePath() {
  // Including the current test name to ensure that the cache is invalidated per
  // test otherwise the cache will be used across tests.
  return `${__dirname}/fixtures/example-project/input.css?test=${expect.getState().currentTestName}`
}

const css = dedent

test("`@import 'tailwindcss'` is replaced with the generated CSS", async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  let result = await processor.process(`@import 'tailwindcss'`, { from: inputCssFilePath() })

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
    dir: expect.stringMatching(/example-project[\/|\\]src$/g),
    glob: expect.stringMatching(/^\*\*\/\*/g),
    parent: expect.any(String),
    plugin: expect.any(String),
  })
})

test('output is optimized by Lightning CSS', async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

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
    { from: inputCssFilePath() },
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

  let result = await processor.process(
    css`
      @import 'tailwindcss/theme.css' theme(reference);
      .foo {
        @apply text-red-500;
      }
    `,
    { from: inputCssFilePath() },
  )

  expect(result.css.trim()).toMatchInlineSnapshot(`
    ".foo {
      color: var(--color-red-500);
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

    let result = await processor.process(`@import "tailwindcss"`, { from: inputCssFilePath() })

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

describe('plugins', () => {
  test('local CJS plugin', async () => {
    let processor = postcss([
      tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
    ])

    let result = await processor.process(
      css`
        @import 'tailwindcss/utilities';
        @plugin './plugin.js';
      `,
      { from: inputCssFilePath() },
    )

    expect(result.css.trim()).toMatchInlineSnapshot(`
      ".underline {
        text-decoration-line: underline;
      }

      @media (inverted-colors: inverted) {
        .inverted\\:flex {
          display: flex;
        }
      }

      .hocus\\:underline:focus, .hocus\\:underline:hover {
        text-decoration-line: underline;
      }"
    `)
  })

  test('local CJS plugin from `@import`-ed file', async () => {
    let processor = postcss([
      tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
    ])

    let result = await processor.process(
      css`
        @import 'tailwindcss/utilities';
        @import '../example-project/src/relative-import.css';
      `,
      { from: `${__dirname}/fixtures/another-project/input.css` },
    )

    expect(result.css.trim()).toMatchInlineSnapshot(`
      ".underline {
        text-decoration-line: underline;
      }

      @media (inverted-colors: inverted) {
        .inverted\\:flex {
          display: flex;
        }
      }

      .hocus\\:underline:focus, .hocus\\:underline:hover {
        text-decoration-line: underline;
      }"
    `)
  })

  test('published CJS plugin', async () => {
    let processor = postcss([
      tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
    ])

    let result = await processor.process(
      css`
        @import 'tailwindcss/utilities';
        @plugin 'internal-example-plugin';
      `,
      { from: inputCssFilePath() },
    )

    expect(result.css.trim()).toMatchInlineSnapshot(`
      ".underline {
        text-decoration-line: underline;
      }

      @media (inverted-colors: inverted) {
        .inverted\\:flex {
          display: flex;
        }
      }

      .hocus\\:underline:focus, .hocus\\:underline:hover {
        text-decoration-line: underline;
      }"
    `)
  })
})

test('bail early when Tailwind is not used', async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  let result = await processor.process(
    css`
      .custom-css {
        color: red;
      }
    `,
    { from: inputCssFilePath() },
  )

  // `fixtures/example-project` includes an `underline` candidate. But since we
  // didn't use `@tailwind utilities` we didn't scan for utilities.
  expect(result.css).not.toContain('.underline {')

  expect(result.css.trim()).toMatchInlineSnapshot(`
    ".custom-css {
      color: red;
    }"
  `)
})
