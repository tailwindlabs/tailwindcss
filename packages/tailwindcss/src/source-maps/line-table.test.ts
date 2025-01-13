import dedent from 'dedent'
import { expect, test } from 'vitest'
import { createLineTable } from './line-table'

const css = dedent

test('line tables', () => {
  let text = css`
    .foo {
      color: red;
    }
  `

  let table = createLineTable(`${text}\n`)

  // Line 1: `.foo {\n`
  expect(table.find(0)).toEqual({ line: 1, column: 0 })
  expect(table.find(1)).toEqual({ line: 1, column: 1 })
  expect(table.find(2)).toEqual({ line: 1, column: 2 })
  expect(table.find(3)).toEqual({ line: 1, column: 3 })
  expect(table.find(4)).toEqual({ line: 1, column: 4 })
  expect(table.find(5)).toEqual({ line: 1, column: 5 })
  expect(table.find(6)).toEqual({ line: 1, column: 6 })

  // Line 2: `  color: red;\n`
  expect(table.find(6 + 1)).toEqual({ line: 2, column: 0 })
  expect(table.find(6 + 2)).toEqual({ line: 2, column: 1 })
  expect(table.find(6 + 3)).toEqual({ line: 2, column: 2 })
  expect(table.find(6 + 4)).toEqual({ line: 2, column: 3 })
  expect(table.find(6 + 5)).toEqual({ line: 2, column: 4 })
  expect(table.find(6 + 6)).toEqual({ line: 2, column: 5 })
  expect(table.find(6 + 7)).toEqual({ line: 2, column: 6 })
  expect(table.find(6 + 8)).toEqual({ line: 2, column: 7 })
  expect(table.find(6 + 9)).toEqual({ line: 2, column: 8 })
  expect(table.find(6 + 10)).toEqual({ line: 2, column: 9 })
  expect(table.find(6 + 11)).toEqual({ line: 2, column: 10 })
  expect(table.find(6 + 12)).toEqual({ line: 2, column: 11 })
  expect(table.find(6 + 13)).toEqual({ line: 2, column: 12 })

  // Line 3: `}\n`
  expect(table.find(20 + 1)).toEqual({ line: 3, column: 0 })
  expect(table.find(20 + 2)).toEqual({ line: 3, column: 1 })

  // After the new line
  expect(table.find(22 + 1)).toEqual({ line: 4, column: 0 })
})
