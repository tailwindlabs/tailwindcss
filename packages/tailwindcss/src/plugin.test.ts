import { expect, test } from 'vitest'
import plugin from './plugin'
import { compileCss } from './test-utils/run'

const css = String.raw

test('plugin', async () => {
  expect(
    await compileCss(
      css`
        @plugin "my-plugin";
      `,
      {
        loadModule: async () => ({
          module: plugin(function ({ addBase }) {
            addBase({
              body: {
                margin: '0',
              },
            })
          }),
          base: '/root',
          path: '',
        }),
      },
    ),
  ).toMatchInlineSnapshot(`
    "
    @layer base {
      body {
        margin: 0;
      }
    }
    "
  `)
})

test('plugin.withOptions', async () => {
  expect(
    await compileCss(
      css`
        @plugin "my-plugin";
      `,
      {
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
          path: '',
        }),
      },
    ),
  ).toMatchInlineSnapshot(`
    "
    @layer base {
      body {
        margin: 1px;
      }
    }
    "
  `)
})
