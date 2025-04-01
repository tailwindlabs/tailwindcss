import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { migrateMaxWidthScreen } from './migrate-max-width-screen'

test('converts max-w-screen-* to max-w-[theme(screens.*)] (so it will later be converted to the var injection)', async () => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  let migrated = migrateMaxWidthScreen(designSystem, {}, 'max-w-screen-md')
  expect(migrated).toMatchInlineSnapshot(`"max-w-[theme(screens.md)]"`)
})
