import dedent from 'dedent'
import { expect, test, vi } from 'vitest'
import type { Plugin } from './compat/plugin-api'
import { compile, type Config } from './index'
import plugin from './plugin'
import { optimizeCss } from './test-utils/run'

const css = dedent

async function run(
  css: string,
  {
    loadStylesheet = () => Promise.reject(new Error('Unexpected stylesheet')),
    loadModule = () => Promise.reject(new Error('Unexpected module')),
    candidates = [],
    optimize = true,
  }: {
    loadStylesheet?: (id: string, base: string) => Promise<{ content: string; base: string }>
    loadModule?: (
      id: string,
      base: string,
      resourceHint: 'plugin' | 'config',
    ) => Promise<{ module: Config | Plugin; base: string }>
    candidates?: string[]
    optimize?: boolean
  },
) {
  let compiler = await compile(css, { base: '/root', loadStylesheet, loadModule })
  let result = compiler.build(candidates)
  return optimize ? optimizeCss(result) : result
}

test('can resolve relative @imports', async () => {
  let loadStylesheet = async (id: string, base: string) => {
    expect(base).toBe('/root')
    expect(id).toBe('./foo/bar.css')
    return {
      content: css`
        .foo {
          color: red;
        }
      `,
      base: '/root/foo',
    }
  }

  await expect(
    run(
      css`
        @import './foo/bar.css';
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    ".foo {
      color: red;
    }
    "
  `)
})

test('can recursively resolve relative @imports', async () => {
  let loadStylesheet = async (id: string, base: string) => {
    if (base === '/root' && id === './foo/bar.css') {
      return {
        content: css`
          @import './bar/baz.css';
        `,
        base: '/root/foo',
      }
    } else if (base === '/root/foo' && id === './bar/baz.css') {
      return {
        content: css`
          .baz {
            color: blue;
          }
        `,
        base: '/root/foo/bar',
      }
    }

    throw new Error(`Unexpected import: ${id}`)
  }

  await expect(
    run(
      css`
        @import './foo/bar.css';
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    ".baz {
      color: #00f;
    }
    "
  `)
})

let exampleCSS = css`
  a {
    color: red;
  }
`
let loadStylesheet = async (id: string) => {
  if (!id.endsWith('example.css')) throw new Error('Unexpected import: ' + id)
  return {
    content: exampleCSS,
    base: '/root',
  }
}

test('extracts path from @import nodes', async () => {
  await expect(
    run(
      css`
        @import 'example.css';
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "a {
      color: red;
    }
    "
  `)

  await expect(
    run(
      css`
        @import './example.css';
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "a {
      color: red;
    }
    "
  `)

  await expect(
    run(
      css`
        @import '/example.css';
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "a {
      color: red;
    }
    "
  `)
})

test('url() imports are passed-through', async () => {
  await expect(
    run(
      css`
        @import url('example.css');
      `,
      { loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')), optimize: false },
    ),
  ).resolves.toMatchInlineSnapshot(`"@import url('example.css');"`)

  await expect(
    run(
      css`
        @import url('./example.css');
      `,
      { loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')), optimize: false },
    ),
  ).resolves.toMatchInlineSnapshot(`"@import url('./example.css');"`)

  await expect(
    run(
      css`
        @import url('/example.css');
      `,
      { loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')), optimize: false },
    ),
  ).resolves.toMatchInlineSnapshot(`"@import url('/example.css');"`)

  await expect(
    run(
      css`
        @import url(example.css);
      `,
      { loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')), optimize: false },
    ),
  ).resolves.toMatchInlineSnapshot(`"@import url(example.css);"`)

  await expect(
    run(
      css`
        @import url(./example.css);
      `,
      { loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')), optimize: false },
    ),
  ).resolves.toMatchInlineSnapshot(`"@import url(./example.css);"`)

  await expect(
    run(
      css`
        @import url(/example.css);
      `,
      { loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')), optimize: false },
    ),
  ).resolves.toMatchInlineSnapshot(`"@import url(/example.css);"`)
})

test('handles case-insensitive @import directive', async () => {
  await expect(
    run(
      css`
        @import 'example.css';
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "a {
      color: red;
    }
    "
  `)
})

test('@media', async () => {
  await expect(
    run(
      css`
        @import 'example.css' print;
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "@media print {
      a {
        color: red;
      }
    }
    "
  `)

  await expect(
    run(
      css`
        @import 'example.css' print, screen;
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "@media print, screen {
      a {
        color: red;
      }
    }
    "
  `)

  await expect(
    run(
      css`
        @import 'example.css' screen and (orientation: landscape);
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "@media screen and (orientation: landscape) {
      a {
        color: red;
      }
    }
    "
  `)

  await expect(
    run(
      css`
        @import 'example.css' foo(bar);
      `,
      { loadStylesheet, optimize: false },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "@media foo(bar) {
      a {
        color: red;
      }
    }
    "
  `)
})

test('@supports', async () => {
  await expect(
    run(
      css`
        @import 'example.css' supports(display: grid);
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "@supports (display: grid) {
      a {
        color: red;
      }
    }
    "
  `)

  await expect(
    run(
      css`
        @import 'example.css' supports(display: grid) screen and (max-width: 400px);
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "@supports (display: grid) {
      @media screen and (max-width: 400px) {
        a {
          color: red;
        }
      }
    }
    "
  `)

  await expect(
    run(
      css`
        @import 'example.css' supports((not (display: grid)) and (display: flex)) screen and
          (max-width: 400px);
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "@supports (not (display: grid)) and (display: flex) {
      @media screen and (max-width: 400px) {
        a {
          color: red;
        }
      }
    }
    "
  `)

  await expect(
    run(
      // prettier-ignore
      css`
        @import 'example.css'
        supports((selector(h2 > p)) and (font-tech(color-COLRv1)));
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "@supports selector(h2 > p) and font-tech(color-COLRv1) {
      a {
        color: red;
      }
    }
    "
  `)
})

test('@layer', async () => {
  await expect(
    run(
      css`
        @import 'example.css' layer(utilities);
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "@layer utilities {
      a {
        color: red;
      }
    }
    "
  `)

  await expect(
    run(
      css`
        @import 'example.css' layer();
      `,
      { loadStylesheet },
    ),
  ).resolves.toMatchInlineSnapshot(`
    "@layer {
      a {
        color: red;
      }
    }
    "
  `)
})

test('supports theme(reference) imports', async () => {
  expect(
    run(
      css`
        @tailwind utilities;
        @import 'example.css' theme(reference);
      `,
      {
        loadStylesheet: () =>
          Promise.resolve({
            content: css`
              @theme {
                --color-red-500: red;
              }
            `,
            base: '',
          }),
        candidates: ['text-red-500'],
      },
    ),
  ).resolves.toMatchInlineSnapshot(`
    ".text-red-500 {
      color: var(--color-red-500, red);
    }
    "
  `)
})

test('updates the base when loading modules inside nested files', async () => {
  let loadStylesheet = () =>
    Promise.resolve({
      content: css`
        @config './nested-config.js';
        @plugin './nested-plugin.js';
      `,
      base: '/root/foo',
    })
  let loadModule = vi.fn().mockResolvedValue({ base: '', module: () => {} })

  expect(
    (
      await run(
        css`
          @import './foo/bar.css';
          @config './root-config.js';
          @plugin './root-plugin.js';
        `,
        { loadStylesheet, loadModule },
      )
    ).trim(),
  ).toBe('')

  expect(loadModule).toHaveBeenNthCalledWith(1, './nested-config.js', '/root/foo', 'config')
  expect(loadModule).toHaveBeenNthCalledWith(2, './root-config.js', '/root', 'config')
  expect(loadModule).toHaveBeenNthCalledWith(3, './nested-plugin.js', '/root/foo', 'plugin')
  expect(loadModule).toHaveBeenNthCalledWith(4, './root-plugin.js', '/root', 'plugin')
})

test('emits the right base for @source directives inside nested files', async () => {
  let loadStylesheet = () =>
    Promise.resolve({
      content: css`
        @source './nested/**/*.css';
      `,
      base: '/root/foo',
    })

  let compiler = await compile(
    css`
      @import './foo/bar.css';
      @source './root/**/*.css';
    `,
    { base: '/root', loadStylesheet },
  )

  expect(compiler.sources).toEqual([
    { pattern: './nested/**/*.css', base: '/root/foo', negated: false },
    { pattern: './root/**/*.css', base: '/root', negated: false },
  ])
})

test('emits the right base for @source found inside JS configs and plugins from nested imports', async () => {
  let loadStylesheet = () =>
    Promise.resolve({
      content: css`
        @config './nested-config.js';
        @plugin './nested-plugin.js';
      `,
      base: '/root/foo',
    })
  let loadModule = vi.fn().mockImplementation((id: string) => {
    let base = id.includes('nested') ? '/root/foo' : '/root'
    if (id.includes('config')) {
      let glob = id.includes('nested') ? './nested-config/*.html' : './root-config/*.html'
      let pluginGlob = id.includes('nested')
        ? './nested-config-plugin/*.html'
        : './root-config-plugin/*.html'
      return {
        module: {
          content: [glob],
          plugins: [plugin(() => {}, { content: [pluginGlob] })],
        } satisfies Config,
        base: base + '-config',
      }
    } else {
      let glob = id.includes('nested') ? './nested-plugin/*.html' : './root-plugin/*.html'
      return {
        module: plugin(() => {}, { content: [glob] }),
        base: base + '-plugin',
      }
    }
  })

  let compiler = await compile(
    css`
      @import './foo/bar.css';
      @config './root-config.js';
      @plugin './root-plugin.js';
    `,
    { base: '/root', loadStylesheet, loadModule },
  )

  expect(compiler.sources).toEqual([
    { pattern: './nested-plugin/*.html', base: '/root/foo-plugin', negated: false },
    { pattern: './root-plugin/*.html', base: '/root-plugin', negated: false },

    { pattern: './nested-config-plugin/*.html', base: '/root/foo-config', negated: false },
    { pattern: './nested-config/*.html', base: '/root/foo-config', negated: false },

    { pattern: './root-config-plugin/*.html', base: '/root-config', negated: false },
    { pattern: './root-config/*.html', base: '/root-config', negated: false },
  ])
})

test('it crashes when inside a cycle', async () => {
  let loadStylesheet = () =>
    Promise.resolve({
      content: css`
        @import 'foo.css';
      `,
      base: '/root',
    })

  expect(
    run(
      css`
        @import 'foo.css';
      `,
      { loadStylesheet },
    ),
  ).rejects.toMatchInlineSnapshot(
    `[Error: Exceeded maximum recursion depth while resolving \`foo.css\` in \`/root\`)]`,
  )
})

test('resolves @reference as `@import "…" reference`', async () => {
  let loadStylesheet = async (id: string, base: string) => {
    expect(base).toBe('/root')
    expect(id).toBe('./foo/bar.css')
    return {
      content: css`
        @theme {
          --color-red-500: red;
        }
        .foo {
          color: red;
        }
      `,
      base: '/root/foo',
    }
  }

  await expect(
    run(
      css`
        @reference './foo/bar.css';
        @tailwind utilities;
      `,
      { loadStylesheet, candidates: ['text-red-500'] },
    ),
  ).resolves.toMatchInlineSnapshot(`
    ".text-red-500 {
      color: var(--color-red-500, red);
    }
    "
  `)
})

test('resolves `@variant` used as `@custom-variant` inside `@reference`', async () => {
  let loadStylesheet = async (id: string, base: string) => {
    expect(base).toBe('/root')
    expect(id).toBe('./foo/bar.css')
    return {
      content: css`
        @variant dark {
          &:where([data-theme='dark'] *) {
            @slot;
          }
        }
      `,
      base: '/root/foo',
    }
  }

  await expect(
    run(
      css`
        @reference './foo/bar.css';
        @tailwind utilities;
      `,
      { loadStylesheet, candidates: ['dark:flex'] },
    ),
  ).resolves.toMatchInlineSnapshot(`
    ".dark\\:flex:where([data-theme="dark"] *) {
      display: flex;
    }
    "
  `)
})
