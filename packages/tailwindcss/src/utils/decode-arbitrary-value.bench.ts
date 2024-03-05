import { bench } from 'vitest'
import { decodeArbitraryValue } from './decode-arbitrary-value'

const values = [
  '#ffffff',
  'calc(1+2)',
  '[content-start]_calc(100%-1px)_[content-end]_minmax(1rem,1fr)',
  'var(--some-value,env(safe-area-inset-top,var(--some-other-value,env(safe-area-inset))))',
]

bench('decodeArbitraryValue', () => {
  for (let value of values) {
    decodeArbitraryValue(value)
  }
})
