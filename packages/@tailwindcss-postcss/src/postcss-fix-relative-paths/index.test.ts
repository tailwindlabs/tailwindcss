import fs from 'node:fs'
import path from 'node:path'
import postcss from 'postcss'
import atImport from 'postcss-import'
import { describe, expect, test } from 'vitest'
import fixRelativePathsPlugin from '.'

describe('fixRelativePathsPlugin', () => {
  test('rewrites @source and @plugin to be relative to the initial css file', async () => {
    let cssPath = path.join(__dirname, 'fixtures', 'external-import', 'src', 'index.css')
    let css = fs.readFileSync(cssPath, 'utf-8')

    let processor = postcss([atImport(), fixRelativePathsPlugin()])

    let result = await processor.process(css, { from: cssPath })

    expect(result.css.trim()).toMatchInlineSnapshot(`
      "@source "../../example-project/src/**/*.ts";
      @source "!../../example-project/src/**/*.ts";
      @plugin "../../example-project/src/plugin.js";
      @plugin "../../example-project/src/what\\"s-this.js";"
    `)
  })

  test('should not rewrite non-relative paths', async () => {
    let cssPath = path.join(__dirname, 'fixtures', 'external-import', 'src', 'invalid.css')
    let css = fs.readFileSync(cssPath, 'utf-8')

    let processor = postcss([atImport(), fixRelativePathsPlugin()])

    let result = await processor.process(css, { from: cssPath })

    expect(result.css.trim()).toMatchInlineSnapshot(`
      "@plugin "/absolute/paths";
      @plugin "C:\\Program Files\\HAL 9000";
      @plugin "\\\\Media\\Pictures\\Worth\\1000 words";
      @plugin "some-node-dep";"
    `)
  })

  test('should return relative paths even if the file is resolved in the same basedir as the root stylesheet', async () => {
    let cssPath = path.join(__dirname, 'fixtures', 'external-import', 'src', 'plugins-in-root.css')
    let css = fs.readFileSync(cssPath, 'utf-8')

    let processor = postcss([atImport(), fixRelativePathsPlugin()])

    let result = await processor.process(css, { from: cssPath })

    expect(result.css.trim()).toMatchInlineSnapshot(`
      "@plugin './plugin-in-sibling.ts';
      @plugin '../plugin-in-sibling.ts';
      @plugin 'plugin-in-sibling';
      @plugin './plugin-in-root.ts';
      @plugin '../plugin-in-root.ts';
      @plugin 'plugin-in-root';"
    `)
  })
})
