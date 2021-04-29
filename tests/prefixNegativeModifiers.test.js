import prefixNegativeModifiers from '../src/util/prefixNegativeModifiers'

test('it does not prefix classes using standard syntax', () => {
  expect(prefixNegativeModifiers('base', 'modifier')).toEqual('base-modifier')
})

test('it prefixes classes using negative syntax', () => {
  expect(prefixNegativeModifiers('base', '-modifier')).toEqual('-base-modifier')
})

test('it prefixes classes and omits suffix using default negative syntax', () => {
  expect(prefixNegativeModifiers('base', '-')).toEqual('-base')
})
