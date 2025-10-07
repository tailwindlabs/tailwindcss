import { bench, describe } from 'vitest'
import * as AttributeSelectorParser from './attribute-selector-parser'

let examples = [
  '[open]',
  '[data-foo]',
  '[data-state=expanded]',
  '[data-state = expanded ]',
  '[data-state*="expanded"]',
  '[data-state*="expanded"i]',
  '[data-state*=expanded i]',
]

const ATTRIBUTE_REGEX =
  /\[\s*(?<attribute>[a-zA-Z_-][a-zA-Z0-9_-]*)\s*((?<operator>[*|~^$]?=)\s*(?<quote>['"])?\s*(?<value>.*?)\4\s*(?<sensitivity>[is])?\s*)?\]/

describe('parsing', () => {
  bench('AttributeSelectorParser.parse', () => {
    for (let example of examples) {
      AttributeSelectorParser.parse(example)
    }
  })

  bench('REGEX.test(…)', () => {
    for (let example of examples) {
      ATTRIBUTE_REGEX.exec(example)
    }
  })

  bench('….match(REGEX)', () => {
    for (let example of examples) {
      example.match(ATTRIBUTE_REGEX)
    }
  })
})
