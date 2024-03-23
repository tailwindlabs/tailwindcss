import negateValue from '../src/util/negateValue'

test('it negates numeric CSS values', () => {
  expect(negateValue('5')).toEqual('-5')
  expect(negateValue('10px')).toEqual('-10px')
  expect(negateValue('18rem')).toEqual('-18rem')
  expect(negateValue('-10')).toEqual('10')
  expect(negateValue('-7ch')).toEqual('7ch')
})

test('values that cannot be negated become undefined', () => {
  expect(negateValue('auto')).toBeUndefined()
  expect(negateValue('cover')).toBeUndefined()
})
