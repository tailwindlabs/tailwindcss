import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import tailwind from '../src/index'

/**
 * Tests
 */
it('generates the right CSS', () => {
  const input = fs.readFileSync(path.resolve(`${__dirname}/fixtures/tailwind-input.css`), 'utf8')

  return postcss([tailwind()])
    .process(input)
    .then(result => {
      const expected = fs.readFileSync(path.resolve(`${__dirname}/fixtures/tailwind-output.css`), 'utf8')

      expect(result.css).toBe(expected)
    })
})

it('Do not change css if tailwind is not used at all', () => {
  return postcss([tailwind()])
    .process('')
    .then(result => {
      expect(result.css).toBe('')
    })
})
