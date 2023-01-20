import escapeClassName from '../src/util/escapeClassName'
import { crosscheck, run, html, css, defaults } from './util/run'

crosscheck(({ stable, oxide }) => {
  test('invalid characters are escaped', () => {
    expect(escapeClassName('w:_$-1/2')).toEqual('w\\:_\\$-1\\/2')
  })
})
