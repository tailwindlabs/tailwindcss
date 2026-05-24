import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it, vi } from 'vitest'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import * as versions from '../../utils/version'
import { migrateAtApply } from './migrate-at-apply'
vi.spyOn(versions, 'isMajor').mockReturnValue(true)

const css = dedent

async function migrate(input: string, config: Config = {}) {
  return postcss()
    .use(
      migrateAtApply({
        designSystem: await loadDesignSystem(),
        userConfig: config,
      }),
    )
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

async function migrateRoot(root: postcss.Root, config: Config = {}) {
  let plugin = migrateAtApply({
    designSystem: await loadDesignSystem(),
    userConfig: config,
  })

  await plugin.OnceExit?.(root, { result: root.toResult() } as any)

  return root.toString()
}

async function loadDesignSystem() {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';

      /* TODO(perf): Only here to speed up the tests */
      @theme {
        --*: initial;
      }
    `,
    { base: __dirname },
  )

  return designSystem
}

it('should not migrate `@apply`, when there are no issues', async () => {
  expect(
    await migrate(css`
      .foo {
        @apply flex flex-col items-center;
      }
    `),
  ).toMatchInlineSnapshot(`
    ".foo {
      @apply flex flex-col items-center;
    }"
  `)
})

it('should append `!` to each utility, when using `!important`', async () => {
  expect(
    await migrate(css`
      .foo {
        @apply flex flex-col !important;
      }
    `),
  ).toMatchInlineSnapshot(`
    ".foo {
      @apply flex! flex-col!;
    }"
  `)
})

it('should append `!` to each utility, when using `#{!important}`', async () => {
  // PostCSS's CSS parser rejects SCSS interpolation, so build this fixture
  // directly to exercise the codemod behavior.
  let root = postcss.parse(css`
    .foo {
      @apply flex flex-col !important;
    }
  `)
  root.walkAtRules('apply', (atRule) => {
    atRule.params = 'flex flex-col #{!important}'
  })

  expect(await migrateRoot(root)).toMatchInlineSnapshot(`
    ".foo {
      @apply flex! flex-col!;
    }"
  `)
})

it('should move the legacy `!` prefix, to the new `!` postfix notation', async () => {
  expect(
    await migrate(css`
      .foo {
        @apply !flex flex-col! hover:!items-start items-center;
      }
    `),
  ).toMatchInlineSnapshot(`
    ".foo {
      @apply flex! flex-col! hover:items-start! items-center;
    }"
  `)
})

it(
  'should apply all candidate migration when migrating with a config',
  { timeout: 10_000 },
  async () => {
    async function migrateWithPrefix(input: string) {
      return postcss()
        .use(
          migrateAtApply({
            designSystem: await __unstable__loadDesignSystem(
              css`
                @import 'tailwindcss' prefix(tw);

                /* TODO(perf): Only here to speed up the tests */
                @theme {
                  --*: initial;
                }
              `,
              { base: __dirname },
            ),
            userConfig: {
              prefix: 'tw_',
            },
          }),
        )
        .process(input, { from: expect.getState().testPath })
        .then((result) => result.css)
    }

    expect(
      await migrateWithPrefix(css`
        .foo {
          @apply !tw_flex [color:--my-color] tw_bg-gradient-to-t;
        }
      `),
    ).toMatchInlineSnapshot(`
    ".foo {
      @apply tw:flex! tw:text-(--my-color) tw:bg-linear-to-t;
    }"
  `)
  },
)
