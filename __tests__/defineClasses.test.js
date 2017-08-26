import postcss from 'postcss'
import fs from 'fs'
import _ from 'lodash'
import defineClasses from '../src/util/defineClasses'

let config = {
  flex: {
    display: 'flex',
  },
  inlineFlex: {
    display: 'inline-flex',
  },
}

let flexHelper = `.flex {
    display: flex
}`

let inlineFlexHelper = `.inline-flex {
    display: inline-flex
}`

/**
 * Tests
 */
it('it generates a set of helper classes from a config', () => {
  let output = defineClasses(config)
  expect(output).toBeInstanceOf(Array)
  expect(output[0].toString()).toEqual(flexHelper)
  expect(output[1].toString()).toEqual(inlineFlexHelper)
})
