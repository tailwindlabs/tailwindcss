import dedent from 'dedent'
import { expect, test } from 'vitest'
import migrate from '../migrate'
import { migrateImportant } from './migrate-important'

let html = dedent

test('applies the migration', () => {
  let content = html`
    <div class="bg-blue-500 !flex">
      <button class="md:!block">My button</button>
    </div>
  `

  expect(migrate(content, [migrateImportant])).resolves.toMatchInlineSnapshot(`
    "<div class="bg-blue-500 flex!">
      <button class="md:block!">My button</button>
    </div>"
  `)
})
