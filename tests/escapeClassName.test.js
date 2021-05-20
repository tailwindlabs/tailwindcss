import escapeClassName from '../src/util/escapeClassName'

test('invalid characters are escaped', () => {
  expect(escapeClassName('w:_$-1/2')).toEqual('w\\:_\\$-1\\/2')
})
