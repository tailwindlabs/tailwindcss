import { bench } from 'vitest'
import { isAlpha } from './is-alpha'

const ALPHA_REGEX_A = /^[a-zA-Z]+$/
const ALPHA_REGEX_B = /^[a-z]+$/i
const ALPHA_REGEX_C = /^[A-Z]+$/i

const implementations = new Map<string, (input: string) => boolean>([
  ['RegExp A', (input) => ALPHA_REGEX_A.test(input)],
  ['RegExp B', (input) => ALPHA_REGEX_B.test(input)],
  ['RegExp C', (input) => ALPHA_REGEX_C.test(input)],
  ['Manual', isAlpha],
])

for (let [name, check] of implementations) {
  bench(name, () => {
    for (let i = 0; i < 1e6; i++) {
      check('abc')
      check('ABC')
      check('AbC')
      check('a-b-c')
      check('123')
    }
  })
}
