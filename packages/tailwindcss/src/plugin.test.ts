import { test } from 'vitest'
import { compile } from '.'
import plugin from './plugin'

const css = String.raw

test('plugin', async ({ expect }) => {
  let input = css`
    @plugin "my-plugin";
  `

  let compiler = await compile(input, {
    loadPlugin: async () => {
      return plugin(function ({ addBase }) {
        addBase({
          body: {
            margin: '0',
          },
        })
      })
    },
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

test('plugin.withOptions', async ({ expect }) => {
  let input = css`
    @plugin "my-plugin";
  `

  let compiler = await compile(input, {
    loadPlugin: async () => {
      return plugin.withOptions(function (opts = { foo: '1px' }) {
        return function ({ addBase }) {
          addBase({
            body: {
              margin: opts.foo,
            },
          })
        }
      })
    },
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
