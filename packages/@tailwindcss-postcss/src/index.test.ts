import dedent from 'dedent'
import { mkdir, mkdtemp, readFile, realpath, rm, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'path'
import postcss from 'postcss'
import atImport from 'postcss-import'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { pretty } from '../../tailwindcss/src/test-utils/run'
import tailwindcss, { type PluginOptions } from './index'

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

async function run(plugin: any, from: string, input: string): Promise<string> {
  let ast = postcss.parse(input)
  for (let runner of plugin.plugins) {
    if (runner.Once) {
      await runner.Once(ast, { postcss, result: { opts: { from }, messages: [] } })
    }
  }
  return ast.toString()
}

test("`@import 'tailwindcss'` is replaced with the generated CSS", async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  let result = await processor.process(`@import 'tailwindcss'`, { from: inputCssFilePath() })

  expect(pretty(result.css)).toMatchSnapshot()

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
    dir: expect.stringMatching(/example-project[/|\\]src$/g),
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

  expect(pretty(result.css)).toMatchInlineSnapshot(`
    "
    @layer utilities {
      .foo {
        color: #000;
      }

      .bar {
        color: red;
      }
    }
    "
  `)
})

test('@apply can be used without emitting the theme in the CSS file', async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  let result = await processor.process(
    css`
      @reference 'tailwindcss/theme.css';
      .foo {
        @apply text-red-500;
      }
    `,
    { from: inputCssFilePath() },
  )

  expect(pretty(result.css)).toMatchInlineSnapshot(`
    "
    .foo {
      color: var(--color-red-500, oklch(63.7% .237 25.331));
    }
    "
  `)
})

describe('processing without specifying a base path', () => {
  let filepath: string
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'tw-postcss'))
    await mkdir(dir, { recursive: true })
    filepath = path.join(dir, 'my-test-file.html')
    await writeFile(filepath, `<div class="md:[&:hover]:content-['testing_default_base_path']">`)
  })
  afterEach(() => unlink(filepath))

  test('the current working directory is used by default', async () => {
    using spy = vi.spyOn(process, 'cwd')
    spy.mockReturnValue(dir)

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

test('fallback to `base` directory when `result.opts.from` is not provided', async () => {
  using _ = vi.spyOn(console, 'warn').mockImplementation(() => {})

  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  let result = await processor.process(`@import 'tailwindcss'`)

  expect(result.css.length).toBeGreaterThan(0)
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

    expect(pretty(result.css)).toMatchInlineSnapshot(`
      "
      .underline {
        text-decoration-line: underline;
      }

      @media (inverted-colors: inverted) {
        .inverted\\:flex {
          display: flex;
        }
      }

      .hocus\\:underline:focus, .hocus\\:underline:hover {
        text-decoration-line: underline;
      }
      "
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

    expect(pretty(result.css)).toMatchInlineSnapshot(`
      "
      .underline {
        text-decoration-line: underline;
      }

      @media (inverted-colors: inverted) {
        .inverted\\:flex {
          display: flex;
        }
      }

      .hocus\\:underline:focus, .hocus\\:underline:hover {
        text-decoration-line: underline;
      }
      "
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

    expect(pretty(result.css)).toMatchInlineSnapshot(`
      "
      .underline {
        text-decoration-line: underline;
      }

      @media (inverted-colors: inverted) {
        .inverted\\:flex {
          display: flex;
        }
      }

      .hocus\\:underline:focus, .hocus\\:underline:hover {
        text-decoration-line: underline;
      }
      "
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

  expect(pretty(result.css)).toMatchInlineSnapshot(`
    "
    .custom-css {
      color: red;
    }
    "
  `)
})

test('handle CSS when only using a `@reference` (we should not bail early)', async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  let result = await processor.process(
    css`
      @reference "tailwindcss/theme.css";

      .foo {
        @variant md {
          bar: baz;
        }
      }
    `,
    { from: inputCssFilePath() },
  )

  expect(pretty(result.css)).toMatchInlineSnapshot(`
    "
    @media (min-width: 48rem) {
      .foo {
        bar: baz;
      }
    }
    "
  `)
})

test('handle CSS when using a `@variant` using variants that do not rely on the `@theme`', async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  let result = await processor.process(
    css`
      .foo {
        @variant data-is-hoverable {
          bar: baz;
        }
      }
    `,
    { from: inputCssFilePath() },
  )

  expect(pretty(result.css)).toMatchInlineSnapshot(`
    "
    .foo[data-is-hoverable] {
      bar: baz;
    }
    "
  `)
})

test('runs `Once` plugins in the right order', async () => {
  let before = ''
  let after = ''
  let processor = postcss([
    {
      postcssPlugin: 'before',
      Once(root) {
        before = root.toString()
      },
    },
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
    {
      postcssPlugin: 'after',
      Once(root) {
        after = root.toString()
      },
    },
  ])

  let result = await processor.process(
    css`
      @theme {
        --color-red-500: red;
      }
      .custom-css {
        color: theme(--color-red-500);
      }
    `,
    { from: inputCssFilePath() },
  )

  expect(pretty(result.css)).toMatchInlineSnapshot(`
    "
    .custom-css {
      color: red;
    }
    "
  `)
  expect(pretty(before)).toMatchInlineSnapshot(`
    "
    @theme {
      --color-red-500: red;
    }
    .custom-css {
      color: theme(--color-red-500);
    }
    "
  `)
  expect(pretty(after)).toMatchInlineSnapshot(`
    "
    .custom-css {
      color: red;
    }
    "
  `)
})

describe('concurrent builds', () => {
  let dir: string
  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'tw-postcss'))
    await writeFile(path.join(dir, 'index.html'), `<div class="underline"></div>`)
    await writeFile(
      path.join(dir, 'index.css'),
      css`
        @import './dependency.css';
      `,
    )
    await writeFile(
      path.join(dir, 'dependency.css'),
      css`
        @tailwind utilities;
      `,
    )
  })
  afterEach(() => rm(dir, { recursive: true, force: true }))

  test('does experience a race-condition when calling the plugin two times for the same change', async () => {
    using spy = vi.spyOn(process, 'cwd')
    spy.mockReturnValue(dir)

    let from = path.join(dir, 'index.css')
    let input = (await readFile(path.join(dir, 'index.css'))).toString()

    let plugin = tailwindcss({ optimize: { minify: false } })

    let result = await run(plugin, from, input)

    expect(result).toContain('.underline')

    // Ensure that the mtime is updated
    await new Promise((resolve) => setTimeout(resolve, 100))
    await writeFile(
      path.join(dir, 'dependency.css'),
      css`
        @tailwind utilities;
        .red {
          color: red;
        }
      `,
    )

    let promise1 = run(plugin, from, input)
    let promise2 = run(plugin, from, input)

    expect(await promise1).toContain('.red')
    expect(await promise2).toContain('.red')
  })
})

test('rebuilds when the input CSS changes even if the `from` file on disk did not', async () => {
  let dir = await mkdtemp(path.join(tmpdir(), 'tw-postcss'))
  // The `from` file exists on disk with a stable mtime. The input CSS is handed
  // to the plugin directly (as a preprocessor like Sass would produce it), so it
  // can change without `from`'s mtime ever changing.
  await writeFile(path.join(dir, 'index.css'), '')

  let from = path.join(dir, 'index.css')
  let plugin = tailwindcss({ base: dir, optimize: { minify: false } })

  let first = await run(
    plugin,
    from,
    css`
      @tailwind utilities;
      .first {
        @apply underline;
      }
    `,
  )
  let second = await run(
    plugin,
    from,
    css`
      @tailwind utilities;
      .second {
        @apply line-through;
      }
    `,
  )

  expect(first).toContain('.first')
  expect(second).toContain('.second')

  await rm(dir, { recursive: true, force: true })
})

test('does not register the input file as a dependency, even if it is passed in as relative path', async () => {
  let processor = postcss([
    tailwindcss({ base: `${__dirname}/fixtures/example-project`, optimize: { minify: false } }),
  ])

  let result = await processor.process(`@tailwind utilities`, { from: './input.css' })

  expect(pretty(result.css)).toMatchInlineSnapshot(`
    "
    .underline {
      text-decoration-line: underline;
    }
    "
  `)

  // Check for dependency messages
  expect(result.messages).not.toContainEqual({
    type: 'dependency',
    file: expect.stringMatching(/input.css$/g),
    parent: expect.any(String),
    plugin: expect.any(String),
  })
})

// Tools like Vite run `postcss-import` before our plugin, so `@import`-ed files
// are already inlined when we see them. Their `url(…)`s are still relative to
// their own file, which those tools read from the `source` of each node.
describe('stylesheets inlined before our plugin runs', () => {
  let dir: string
  beforeEach(async () => {
    // Resolved files are real paths, so the temporary folder must be one too
    dir = await realpath(await mkdtemp(path.join(tmpdir(), 'tw-postcss')))
    await mkdir(path.join(dir, 'src/fonts'), { recursive: true })
    await mkdir(path.join(dir, 'node_modules/example-font'), { recursive: true })
    await writeFile(
      path.join(dir, 'src/index.css'),
      css`
        @import './fonts/local.css';
        @import 'example-font/fonts.css';
        @tailwind utilities;
        .hero {
          background-image: url('./hero.png');
        }
      `,
    )
    await writeFile(
      path.join(dir, 'src/fonts/local.css'),
      css`
        @font-face {
          font-family: 'Local Sans';
          src: url('./local.woff2') format('woff2');
        }
      `,
    )
    await writeFile(
      path.join(dir, 'node_modules/example-font/fonts.css'),
      css`
        @font-face {
          font-family: 'Example Sans';
          src: url('./fonts/ExampleSans.woff2') format('woff2');
        }
      `,
    )
  })
  afterEach(() => rm(dir, { recursive: true, force: true }))

  // `postcss-import` inlines `example-font/fonts.css`, and our plugin inlines
  // `./fonts/local.css` itself.
  async function build(options: PluginOptions) {
    let from = path.join(dir, 'src/index.css')
    let processor = postcss([
      atImport({ filter: (id: string) => id !== './fonts/local.css' }),
      tailwindcss({ base: dir, ...options }),
    ])
    return processor.process(await readFile(from, 'utf8'), { from })
  }

  test('rewrites their `url(…)`s to be relative to the input file when optimizing', async () => {
    let result = await build({ optimize: { minify: false } })

    expect(pretty(result.css)).toMatchInlineSnapshot(`
      "
      @font-face {
        font-family: Local Sans;
        src: url("./fonts/local.woff2") format("woff2");
      }

      @font-face {
        font-family: Example Sans;
        src: url("../node_modules/example-font/fonts/ExampleSans.woff2") format("woff2");
      }

      .hero {
        background-image: url("./hero.png");
      }
      "
    `)
  })

  test('keeps their `url(…)`s and sources when not optimizing', async () => {
    let result = await build({ optimize: false })

    let decls: string[] = []
    result.root.walkDecls('src', (decl) => {
      decls.push(`${path.relative(dir, decl.source!.input.file!)}: ${decl.value}`)
    })

    expect(decls).toContain(
      `${path.join('node_modules', 'example-font', 'fonts.css')}: url('./fonts/ExampleSans.woff2') format('woff2')`,
    )
  })

  test('keeps their `url(…)`s when `transformAssetUrls` is disabled', async () => {
    let result = await build({ optimize: { minify: false }, transformAssetUrls: false })

    expect(pretty(result.css)).toMatchInlineSnapshot(`
      "
      @font-face {
        font-family: Local Sans;
        src: url("./local.woff2") format("woff2");
      }

      @font-face {
        font-family: Example Sans;
        src: url("./fonts/ExampleSans.woff2") format("woff2");
      }

      .hero {
        background-image: url("./hero.png");
      }
      "
    `)
  })
})
