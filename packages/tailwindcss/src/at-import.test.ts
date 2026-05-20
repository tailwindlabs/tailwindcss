import dedent from 'dedent'
import { expect, test, vi } from 'vitest'
import { compile, type Config } from './index'
import plugin from './plugin'
import { compileCss, run } from './test-utils/run'

const css = dedent

test('can resolve relative @imports', async () => {
  async function loadStylesheet(id: string, base: string) {
    expect(base).toBe('/root')
    expect(id).toBe('./foo/bar.css')
    return {
      content: css`
        .foo {
          color: red;
        }
      `,
      base: '/root/foo',
      path: '',
    }
  }

  expect(
    await compileCss(
      css`
        @import './foo/bar.css';
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    .foo {
      color: red;
    }
    "
  `)
})

test('can recursively resolve relative @imports', async () => {
  async function loadStylesheet(id: string, base: string) {
    if (base === '/root' && id === './foo/bar.css') {
      return {
        content: css`
          @import './bar/baz.css';
        `,
        base: '/root/foo',
        path: '',
      }
    } else if (base === '/root/foo' && id === './bar/baz.css') {
      return {
        content: css`
          .baz {
            color: blue;
          }
        `,
        base: '/root/foo/bar',
        path: '',
      }
    }

    throw new Error(`Unexpected import: ${id}`)
  }

  expect(
    await compileCss(
      css`
        @import './foo/bar.css';
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    .baz {
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
async function loadStylesheet(id: string) {
  if (!id.endsWith('example.css')) throw new Error('Unexpected import: ' + id)
  return {
    content: exampleCSS,
    base: '/root',
    path: '',
  }
}

test('extracts path from @import nodes', async () => {
  expect(
    await compileCss(
      css`
        @import 'example.css';
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    a {
      color: red;
    }
    "
  `)

  expect(
    await compileCss(
      css`
        @import './example.css';
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    a {
      color: red;
    }
    "
  `)

  expect(
    await compileCss(
      css`
        @import '/example.css';
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    a {
      color: red;
    }
    "
  `)
})

test('url() imports are passed-through', async () => {
  expect(
    await compileCss(
      css`
        @import url('example.css');
      `,
      { base: '/root', loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')) },
    ),
  ).toMatchInlineSnapshot(`
    "
    @import "example.css";
    "
  `)

  expect(
    await compileCss(
      css`
        @import url('./example.css');
      `,
      { base: '/root', loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')) },
    ),
  ).toMatchInlineSnapshot(`
    "
    @import "./example.css";
    "
  `)

  expect(
    await compileCss(
      css`
        @import url('/example.css');
      `,
      { base: '/root', loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')) },
    ),
  ).toMatchInlineSnapshot(`
    "
    @import "/example.css";
    "
  `)

  expect(
    await compileCss(
      css`
        @import url(example.css);
      `,
      { base: '/root', loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')) },
    ),
  ).toMatchInlineSnapshot(`
    "
    @import "example.css";
    "
  `)

  expect(
    await compileCss(
      css`
        @import url(./example.css);
      `,
      { base: '/root', loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')) },
    ),
  ).toMatchInlineSnapshot(`
    "
    @import "./example.css";
    "
  `)

  expect(
    await compileCss(
      css`
        @import url(/example.css);
      `,
      { base: '/root', loadStylesheet: () => Promise.reject(new Error('Unexpected stylesheet')) },
    ),
  ).toMatchInlineSnapshot(`
    "
    @import "/example.css";
    "
  `)
})

test('handles case-insensitive @import directive', async () => {
  expect(
    await compileCss(
      css`
        @import 'example.css';
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    a {
      color: red;
    }
    "
  `)
})

test('@media', async () => {
  expect(
    await compileCss(
      css`
        @import 'example.css' print;
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    @media print {
      a {
        color: red;
      }
    }
    "
  `)

  expect(
    await compileCss(
      css`
        @import 'example.css' print, screen;
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    @media print, screen {
      a {
        color: red;
      }
    }
    "
  `)

  expect(
    await compileCss(
      css`
        @import 'example.css' screen and (orientation: landscape);
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    @media screen and (orientation: landscape) {
      a {
        color: red;
      }
    }
    "
  `)

  expect(
    await compileCss(
      css`
        @import 'example.css' foo(bar);
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    @media foo(bar) {
      a {
        color: red;
      }
    }
    "
  `)
})

test('@supports', async () => {
  expect(
    await compileCss(
      css`
        @import 'example.css' supports(display: grid);
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    @supports (display: grid) {
      a {
        color: red;
      }
    }
    "
  `)

  expect(
    await compileCss(
      css`
        @import 'example.css' supports(display: grid) screen and (max-width: 400px);
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    @supports (display: grid) {
      @media screen and (max-width: 400px) {
        a {
          color: red;
        }
      }
    }
    "
  `)

  expect(
    await compileCss(
      css`
        @import 'example.css' supports((not (display: grid)) and (display: flex)) screen and
          (max-width: 400px);
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    @supports (not (display: grid)) and (display: flex) {
      @media screen and (max-width: 400px) {
        a {
          color: red;
        }
      }
    }
    "
  `)

  expect(
    await compileCss(
      // prettier-ignore
      css`
        @import 'example.css'
        supports((selector(h2 > p)) and (font-tech(color-COLRv1)));
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    @supports selector(h2 > p) and font-tech(color-COLRv1) {
      a {
        color: red;
      }
    }
    "
  `)
})

test('@layer', async () => {
  expect(
    await compileCss(
      css`
        @import 'example.css' layer(utilities);
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    @layer utilities {
      a {
        color: red;
      }
    }
    "
  `)

  expect(
    await compileCss(
      css`
        @import 'example.css' layer();
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    @layer {
      a {
        color: red;
      }
    }
    "
  `)
})

test('supports theme(reference) imports', async () => {
  expect(
    await run(
      ['text-red-500'],
      css`
        @tailwind utilities;
        @import 'example.css' theme(reference);
      `,
      {
        base: '/root',
        loadStylesheet: () =>
          Promise.resolve({
            content: css`
              @theme {
                --color-red-500: red;
              }
            `,
            base: '',
            path: '',
          }),
      },
    ),
  ).toMatchInlineSnapshot(`
    "
    .text-red-500 {
      color: var(--color-red-500, red);
    }
    "
  `)
})

test('updates the base when loading modules inside nested files', async () => {
  async function loadStylesheet() {
    return {
      content: css`
        @config './nested-config.js';
        @plugin './nested-plugin.js';
      `,
      base: '/root/foo',
      path: '',
    }
  }
  using loadModule = vi.fn().mockResolvedValue({ base: '', path: '', module: () => {} })

  expect(
    await compileCss(
      css`
        @import './foo/bar.css';
        @config './root-config.js';
        @plugin './root-plugin.js';
      `,
      { base: '/root', loadStylesheet, loadModule },
    ),
  ).toBe('')

  expect(loadModule).toHaveBeenNthCalledWith(1, './nested-config.js', '/root/foo', 'config')
  expect(loadModule).toHaveBeenNthCalledWith(2, './root-config.js', '/root', 'config')
  expect(loadModule).toHaveBeenNthCalledWith(3, './nested-plugin.js', '/root/foo', 'plugin')
  expect(loadModule).toHaveBeenNthCalledWith(4, './root-plugin.js', '/root', 'plugin')
})

test('emits the right base for @source directives inside nested files', async () => {
  async function loadStylesheet() {
    return {
      content: css`
        @source './nested/**/*.css';
      `,
      base: '/root/foo',
      path: '',
    }
  }

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
  async function loadStylesheet() {
    return {
      content: css`
        @config './nested-config.js';
        @plugin './nested-plugin.js';
      `,
      base: '/root/foo',
      path: '',
    }
  }

  using loadModule = vi.fn().mockImplementation((id: string) => {
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
        path: '',
      }
    } else {
      let glob = id.includes('nested') ? './nested-plugin/*.html' : './root-plugin/*.html'
      return {
        module: plugin(() => {}, { content: [glob] }),
        base: base + '-plugin',
        path: '',
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
  let input = css`
    @import 'foo.css';
  `

  async function loadStylesheet() {
    return {
      content: input,
      base: '/root',
      path: '',
    }
  }

  await expect(compileCss(input, { base: '/root', loadStylesheet })).rejects.toMatchInlineSnapshot(
    `[Error: Exceeded maximum recursion depth while resolving \`foo.css\` in \`/root\`)]`,
  )
})

test('resolves @reference as `@import "…" reference`', async () => {
  async function loadStylesheet(id: string, base: string) {
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
      path: '',
    }
  }

  expect(
    await run(
      ['text-red-500'],
      css`
        @reference './foo/bar.css';
        @tailwind utilities;
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    .text-red-500 {
      color: var(--color-red-500, red);
    }
    "
  `)
})

test('resolves `@variant` used as `@custom-variant` inside `@reference`', async () => {
  async function loadStylesheet(id: string, base: string) {
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
      path: '',
    }
  }

  expect(
    await run(
      ['dark:flex'],
      css`
        @reference './foo/bar.css';
        @tailwind utilities;
      `,
      { base: '/root', loadStylesheet },
    ),
  ).toMatchInlineSnapshot(`
    "
    .dark\\:flex:where([data-theme="dark"] *) {
      display: flex;
    }
    "
  `)
})
