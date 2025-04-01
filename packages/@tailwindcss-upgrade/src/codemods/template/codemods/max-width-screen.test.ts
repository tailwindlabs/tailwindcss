import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test } from 'vitest'
import { maxWidthScreen } from './max-width-screen'

test('converts max-w-screen-* to max-w-[theme(screens.*)] (so it will later be converted to the var injection)', async () => {
  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  let migrated = maxWidthScreen(designSystem, {}, 'max-w-screen-md')
  expect(migrated).toMatchInlineSnapshot(`"max-w-[theme(screens.md)]"`)
})
