import fs from 'node:fs'
import postcss from 'postcss'
import atImport from 'postcss-import'
import { describe, expect, test } from 'vitest'
import { fixRelativePathsPlugin } from './fix-relative-paths-plugin'

// We give this file path to PostCSS for processing.
// This file doesn't exist, but the path is used to resolve imports.
// We place it in packages/ because Vitest runs in the monorepo root,
// and packages/tailwindcss must be a sub-folder for
// @import 'tailwindcss' to work.
const CSS_PATH = `${__dirname}/fixtures/external-import/src/index.css`
const CSS = fs.readFileSync(CSS_PATH, 'utf-8')

describe('fixRelativePathsPlugin', () => {
  test('rewrites @content and @plugin to be relative to the initial css file', async () => {
    let processor = postcss([atImport(), fixRelativePathsPlugin()])

    let result = await processor.process(CSS, { from: CSS_PATH })

    expect(result.css.trim()).toMatchInlineSnapshot(`
      "@content "../../other-project/src/**/*.ts";
      @plugin "../../other-project/src/plugin.js""
    `)
  })
})
