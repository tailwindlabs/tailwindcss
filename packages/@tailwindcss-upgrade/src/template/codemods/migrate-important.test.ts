import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import dedent from 'dedent'
import { expect, test } from 'vitest'
import migrate from '../migrate'
import { migrateImportant } from './migrate-important'

let html = dedent

test('applies the migration', async () => {
  let content = html`
    <div class="bg-blue-500 !flex">
      <button class="md:!block">My button</button>
    </div>
  `

  let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  expect(migrate(designSystem, content, [migrateImportant])).resolves.toMatchInlineSnapshot(`
    "<div class="bg-blue-500 flex!">
      <button class="md:block!">My button</button>
    </div>"
  `)
})
