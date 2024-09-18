import { expect, test } from 'vitest'
import { compile } from './index'
import { optimizeCss } from './test-utils/run'

let css = String.raw

async function run(
  css: string,
  resolveImport: (id: string, base: string) => Promise<{ content: string; base: string }>,
  candidates: string[] = [],
) {
  let compiler = await compile(css, '/root', { resolveImport })
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
let resolver = async () => {
  return {
    content: exampleCSS,
    base: '/root',
  }
}

// Examples from https://developer.mozilla.org/en-US/docs/Web/CSS/@import
test.each([
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
