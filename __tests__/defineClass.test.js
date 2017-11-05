import c from '../src/util/collapseWhitespace'
import defineClass from '../src/util/defineClass'

/**
 * Tests
 */
it('creates a proper single-word class with rules', () => {
  let output = defineClass('flex', { display: 'flex' })
  expect(c(output.toString())).toEqual(`.flex { display: flex }`)
})

it('does not modify the case of selector names', () => {
  let output = defineClass('inlineBlock', { display: 'inline-block' })
  expect(c(output.toString())).toEqual(`.inlineBlock { display: inline-block }`)
})

it('does not modify the case of property names', () => {
  let output = defineClass('smooth', {
    '-webkit-font-smoothing': 'antialiased',
  })
  expect(c(output.toString())).toEqual(`.smooth { -webkit-font-smoothing: antialiased }`)
})

it('escapes non-standard characters in selectors', () => {
  let output = defineClass('w-1/4', { width: '25%' })
  expect(c(output.toString())).toEqual(`.w-1\\/4 { width: 25% }`)
})
