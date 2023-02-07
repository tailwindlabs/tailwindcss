import escapeClassName from '../src/util/escapeClassName'
import { crosscheck } from './util/run'

crosscheck(() => {
  test('invalid characters are escaped', () => {
    expect(escapeClassName('w:_$-1/2')).toEqual('w\\:_\\$-1\\/2')
  })
})
