import { expect, test } from 'vitest'
import { compile } from '.'
import plugin from './plugin'

const css = String.raw

test('plugin', async () => {
  let input = css`
    @plugin "my-plugin";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({
      module: plugin(function ({ addBase }) {
        addBase({
          body: {
            margin: '0',
          },
        })
      }),
      base: '/root',
    }),
  })

  expect(compiler.build([])).toMatchInlineSnapshot(`
    "@layer base {
      body {
        margin: 0;
      }
    }
    "
  `)
})

test('plugin.withOptions', async () => {
  let input = css`
    @plugin "my-plugin";
  `

  let compiler = await compile(input, {
    loadModule: async () => ({
      module: plugin.withOptions(function (opts = { foo: '1px' }) {
        return function ({ addBase }) {
          addBase({
            body: {
              margin: opts.foo,
            },
          })
        }
      }),
      base: '/root',
    }),
  })

  expect(compiler.build([])).toMatchInlineSnapshot(`
    "@layer base {
      body {
        margin: 1px;
      }
    }
    "
  `)
})
