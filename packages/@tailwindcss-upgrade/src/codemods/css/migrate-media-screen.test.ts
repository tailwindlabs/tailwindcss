import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import type { UserConfig } from '../../../../tailwindcss/src/compat/config/types'
import { formatNodes } from './format-nodes'
import { migrateMediaScreen } from './migrate-media-screen'
import { sortBuckets } from './sort-buckets'

const css = dedent

async function migrate(input: string, userConfig: UserConfig = {}) {
  return postcss()
    .use(
      migrateMediaScreen({
        designSystem: await __unstable__loadDesignSystem(`@import 'tailwindcss';`, {
          base: __dirname,
        }),
        userConfig,
      }),
    )
    .use(sortBuckets())
    .use(formatNodes())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('should migrate a built-in breakpoint', async () => {
  expect(
    await migrate(css`
      @media screen(md) {
        .foo {
          color: red;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@media (width >= theme(--breakpoint-md)) {
      .foo {
        color: red;
      }
    }"
  `)
})

it('should migrate `@screen` with a built-in breakpoint', async () => {
  expect(
    await migrate(css`
      @screen md {
        .foo {
          color: red;
        }
      }
    `),
  ).toMatchInlineSnapshot(`
    "@media (width >= theme(--breakpoint-md)) {
      .foo {
        color: red;
      }
    }"
  `)
})

it('should migrate a custom min-width screen (string)', async () => {
  expect(
    await migrate(
      css`
        @media screen(foo) {
          .foo {
            color: red;
          }
        }
      `,
      {
        theme: {
          screens: {
            foo: '123px',
          },
        },
      },
    ),
  ).toMatchInlineSnapshot(`
    "@media (width >= theme(--breakpoint-foo)) {
      .foo {
        color: red;
      }
    }"
  `)
})

it('should migrate a custom min-width screen (object)', async () => {
  expect(
    await migrate(
      css`
        @media screen(foo) {
          .foo {
            color: red;
          }
        }
      `,
      {
        theme: {
          screens: {
            foo: { min: '123px' },
          },
        },
      },
    ),
  ).toMatchInlineSnapshot(`
    "@media (width >= theme(--breakpoint-foo)) {
      .foo {
        color: red;
      }
    }"
  `)
})

it('should migrate a custom max-width screen', async () => {
  expect(
    await migrate(
      css`
        @media screen(foo) {
          .foo {
            color: red;
          }
        }
      `,
      {
        theme: {
          screens: {
            foo: { max: '123px' },
          },
        },
      },
    ),
  ).toMatchInlineSnapshot(`
    "@media (123px >= width) {
      .foo {
        color: red;
      }
    }"
  `)
})

it('should migrate a custom min and max-width screen', async () => {
  expect(
    await migrate(
      css`
        @media screen(foo) {
          .foo {
            color: red;
          }
        }
      `,
      {
        theme: {
          screens: {
            foo: { min: '100px', max: '123px' },
          },
        },
      },
    ),
  ).toMatchInlineSnapshot(`
    "@media (123px >= width >= 100px) {
      .foo {
        color: red;
      }
    }"
  `)
})

it('should migrate a raw media query', async () => {
  expect(
    await migrate(
      css`
        @media screen(foo) {
          .foo {
            color: red;
          }
        }
      `,
      {
        theme: {
          screens: {
            foo: { raw: 'only screen and (min-width: 123px)' },
          },
        },
      },
    ),
  ).toMatchInlineSnapshot(`
    "@media only screen and (min-width: 123px) {
      .foo {
        color: red;
      }
    }"
  `)
})
