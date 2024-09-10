import { expect, it } from 'vitest'
import { compile } from './index'

let css = String.raw

async function run(
  css: string,
  resolveImport: (id: string, basedir: string) => Promise<{ content: string; basedir: string }>,
) {
  let compiler = await compile(css, '/root', { resolveImport })
  return compiler.build([])
}

it('can resolve relative @imports', async () => {
  let resolver = async (id: string, basedir: string) => {
    expect(basedir).toBe('/root')
    expect(id).toBe('./foo/bar.css')
    return {
      content: css`
        .foo {
          color: red;
        }
      `,
      basedir: '/root/foo',
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

it('can recursively resolve relative @imports', async () => {
  let resolver = async (id: string, basedir: string) => {
    if (basedir === '/root' && id === './foo/bar.css') {
      return {
        content: css`
          @import './bar/baz.css';
        `,
        basedir: '/root/foo',
      }
    } else if (basedir === '/root/foo' && id === './bar/baz.css') {
      return {
        content: css`
          .baz {
            color: blue;
          }
        `,
        basedir: '/root/foo/bar',
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
      color: blue;
    }
    "
  `)
})
