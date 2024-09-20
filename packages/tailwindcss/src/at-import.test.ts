import { expect, test, vi } from 'vitest'
import type { Plugin } from './compat/plugin-api'
import { compile, type Config } from './index'
import plugin from './plugin'
import { optimizeCss } from './test-utils/run'

let css = String.raw

async function run(
  css: string,
  loadStylesheet: (id: string, base: string) => Promise<{ content: string; base: string }>,
  loadModule: (
    id: string,
    base: string,
    resourceHint: 'plugin' | 'config',
  ) => Promise<{ module: Config | Plugin; base: string }> = () =>
    Promise.reject(new Error('Unexpected module')),
  candidates: string[] = [],
) {
  let compiler = await compile(css, { base: '/root', loadStylesheet, loadModule })
  return optimizeCss(compiler.build(candidates))
}

test('can resolve relative @imports', async () => {
  let resolver = async (id: string, base: string) => {
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
      resolver,
    ),
  ).resolves.toMatchInlineSnapshot(`
    ".foo {
      color: red;
    }
    "
  `)
})

test('can recursively resolve relative @imports', async () => {
  let resolver = async (id: string, base: string) => {
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
      resolver,
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
let resolver = async (id: string) => {
  if (!id.endsWith('example.css')) throw new Error('Unexpected import: ' + id)
  return {
    content: exampleCSS,
    base: '/root',
  }
}

// Examples from https://developer.mozilla.org/en-US/docs/Web/CSS/@import
test.each([
  // url extraction
  [
    css`
      @import url('example.css');
    `,
    optimizeCss(css`
      ${exampleCSS}
    `),
  ],
  [
    css`
      @import url('./example.css');
    `,
    optimizeCss(css`
      ${exampleCSS}
    `),
  ],
  [
    css`
      @import url('/example.css');
    `,
    optimizeCss(css`
      ${exampleCSS}
    `),
  ],
  [
    css`
      @import url(example.css);
    `,
    optimizeCss(css`
      ${exampleCSS}
    `),
  ],
  [
    css`
      @import url(./example.css);
    `,
    optimizeCss(css`
      ${exampleCSS}
    `),
  ],
  [
    css`
      @import url(/example.css);
    `,
    optimizeCss(css`
      ${exampleCSS}
    `),
  ],

  // handles case-insensitive `@import` directive
  [
    // prettier-ignore
    css`
      @ImPoRt url('example.css');
    `,
    optimizeCss(css`
      ${exampleCSS}
    `),
  ],

  // @media
  [
    css`
      @import url('example.css') print;
    `,
    optimizeCss(css`
      @media print {
        ${exampleCSS}
      }
    `),
  ],
  [
    css`
      @import url('example.css') print, screen;
    `,
    optimizeCss(css`
      @media print, screen {
        ${exampleCSS}
      }
    `),
  ],
  [
    css`
      @import 'example.css' screen;
    `,
    optimizeCss(css`
      @media screen {
        ${exampleCSS}
      }
    `),
  ],
  [
    css`
      @import url('example.css') screen and (orientation: landscape);
    `,
    optimizeCss(css`
      @media screen and (orientation: landscape) {
        ${exampleCSS}
      }
    `),
  ],

  // @supports
  [
    css`
      @import url('example.css') supports(display: grid) screen and (max-width: 400px);
    `,
    optimizeCss(css`
      @supports (display: grid) {
        @media screen and (max-width: 400px) {
          ${exampleCSS}
        }
      }
    `),
  ],
  [
    css`
      @import url('example.css') supports((not (display: grid)) and (display: flex)) screen and
        (max-width: 400px);
    `,
    optimizeCss(css`
      @supports (not (display: grid)) and (display: flex) {
        @media screen and (max-width: 400px) {
          ${exampleCSS}
        }
      }
    `),
  ],
  [
    // prettier-ignore
    css`
      @import url('example.css')
      supports((selector(h2 > p)) and (font-tech(color-COLRv1)));
    `,
    optimizeCss(css`
      @supports (selector(h2 > p)) and (font-tech(color-COLRv1)) {
        ${exampleCSS}
      }
    `),
  ],

  // @layer
  [
    css`
      @import 'example.css' layer(utilities);
    `,
    optimizeCss(css`
      @layer utilities {
        ${exampleCSS}
      }
    `),
  ],
  [
    css`
      @import 'example.css' layer();
    `,
    optimizeCss(css`
      @layer {
        ${exampleCSS}
      }
    `),
  ],

  // unknown syntax is ignored
  [
    css`
      @import url(example.css) does-not-exist(foo);
    `,
    optimizeCss(css`
      @import url(example.css) does-not-exist(foo);
    `),
  ],
  // prettier-ignore
  [
    css`
      @import url('example.css' url-mod);
    `,
    optimizeCss(css`
      @import url('example.css' url-mod);
    `),
  ],
])('resolves %s', async (input, output) => {
  await expect(run(input, resolver)).resolves.toBe(output)
})

test('supports theme(reference) imports', async () => {
  expect(
    run(
      css`
        @tailwind utilities;
        @import 'example.css' theme(reference);
      `,
      () =>
        Promise.resolve({
          content: css`
            @theme {
              --color-red-500: red;
            }
          `,
          base: '',
        }),
      () => Promise.reject(new Error('Unexpected module')),
      ['text-red-500'],
    ),
  ).resolves.toBe(
    optimizeCss(css`
      .text-red-500 {
        color: var(--color-red-500, red);
      }
    `),
  )
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
        loadStylesheet,
        loadModule,
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

  expect(compiler.globs).toEqual([
    //
    { pattern: './nested/**/*.css', base: '/root/foo' },
    { pattern: './root/**/*.css', base: '/root' },
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

  expect(compiler.globs).toEqual([
    //
    { pattern: './nested-plugin/*.html', base: '/root/foo-plugin' },
    { pattern: './root-plugin/*.html', base: '/root-plugin' },

    { pattern: './nested-config-plugin/*.html', base: '/root/foo-config' },
    { pattern: './nested-config/*.html', base: '/root/foo-config' },

    { pattern: './root-config-plugin/*.html', base: '/root-config' },
    { pattern: './root-config/*.html', base: '/root-config' },
  ])
})

test('it crashes when inside a cycle', async () => {
  let loadStylesheet = () =>
    Promise.resolve({
      content: css`
        @import url('foo.css');
      `,
      base: '/root',
    })

  expect(
    run(
      css`
        @import url('foo.css');
      `,
      loadStylesheet,
    ),
  ).rejects.toMatchInlineSnapshot(
    `[Error: Exceeded maximum recursion depth while resolving \`foo.css\` in \`/root\`)]`,
  )
})
