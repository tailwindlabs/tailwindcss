import postcss from 'postcss'
import prefixTree from '../src/util/prefixTree'

test('it prefixes classes with the provided prefix', () => {
  const input = postcss.parse(`
    .foo { color: red; }
    .apple, .pear { color: green; }
  `)

  const expected = `
    .tw-foo { color: red; }
    .tw-apple, .tw-pear { color: green; }
  `

  const result = prefixTree(input, 'tw-').toResult()
  expect(result.css).toEqual(expected)
  expect(result.warnings().length).toBe(0)
})

test('it handles a function as the prefix', () => {
  const input = postcss.parse(`
    .foo { color: red; }
    .apple, .pear { color: green; }
  `)

  const expected = `
    .tw-foo { color: red; }
    .apple, .pear { color: green; }
  `

  const prefixFunc = selector => {
    return selector === '.foo' ? 'tw-' : ''
  }

  const result = prefixTree(input, prefixFunc).toResult()
  expect(result.css).toEqual(expected)
  expect(result.warnings().length).toBe(0)
})

test('it prefixes all classes in a selector', () => {
  const input = postcss.parse(`
    .btn-blue .w-1\\/4 > h1.text-xl + a .bar { color: red; }
  `)

  const expected = `
    .tw-btn-blue .tw-w-1\\/4 > h1.tw-text-xl + a .tw-bar { color: red; }
  `

  const result = prefixTree(input, 'tw-').toResult()
  expect(result.css).toEqual(expected)
  expect(result.warnings().length).toBe(0)
})
