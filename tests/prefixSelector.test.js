import prefix from '../src/util/prefixSelector'

test('it prefixes classes with the provided prefix', () => {
  expect(prefix('tw-', '.foo')).toEqual('.tw-foo')
})

test('it properly prefixes selectors with non-standard characters', () => {
  expect(prefix('tw-', '.hello\\:world')).toEqual('.tw-hello\\:world')
  expect(prefix('tw-', '.foo\\/bar')).toEqual('.tw-foo\\/bar')
  expect(prefix('tw-', '.wew\\.lad')).toEqual('.tw-wew\\.lad')
})

test('it prefixes all classes in a selector', () => {
  expect(prefix('tw-', '.btn-blue .w-1\\/4 > h1.text-xl + a .bar')).toEqual(
    '.tw-btn-blue .tw-w-1\\/4 > h1.tw-text-xl + a .tw-bar'
  )
})
