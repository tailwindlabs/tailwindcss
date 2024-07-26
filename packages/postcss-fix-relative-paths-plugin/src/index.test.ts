import fs from 'node:fs'
import postcss from 'postcss'
import atImport from 'postcss-import'
import { describe, expect, test } from 'vitest'
import fixRelativePathsPlugin from '.'

describe('fixRelativePathsPlugin', () => {
  test('rewrites @content and @plugin to be relative to the initial css file', async () => {
    const CSS_PATH = `${__dirname}/fixtures/external-import/src/index.css`
    const CSS = fs.readFileSync(CSS_PATH, 'utf-8')

    let processor = postcss([atImport(), fixRelativePathsPlugin()])

    let result = await processor.process(CSS, { from: CSS_PATH })

    expect(result.css.trim()).toMatchInlineSnapshot(`
      "@content "../../example-project/src/**/*.ts";
      @plugin "../../example-project/src/plugin.js";
      @plugin "../../example-project/src/what\\"s-this.js";"
    `)
  })

  test('does not rewrite non-relative paths', async () => {
    const CSS_PATH = `${__dirname}/fixtures/external-import/src/invalid.css`
    const CSS = fs.readFileSync(CSS_PATH, 'utf-8')

    let processor = postcss([atImport(), fixRelativePathsPlugin()])

    let result = await processor.process(CSS, { from: CSS_PATH })

    expect(result.css.trim()).toMatchInlineSnapshot(`
      "@plugin "/absolute/paths";
      @plugin "C:\\Program Files\\HAL 9000";
      @plugin "\\\\Media\\Pictures\\Worth\\1000 words";
      @plugin "some-node-dep";"
    `)
  })
})
