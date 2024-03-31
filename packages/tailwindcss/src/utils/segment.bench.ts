import { bench } from 'vitest'
import { segment } from './segment'

const values = [
  ['hover:focus:underline', ':'],
  ['var(--a, 0 0 1px rgb(0, 0, 0)), 0 0 1px rgb(0, 0, 0)', ','],
  ['var(--some-value,env(safe-area-inset-top,var(--some-other-value,env(safe-area-inset))))', ','],
]

bench('segment', () => {
  for (let [value, sep] of values) {
    segment(value, sep)
  }
})
