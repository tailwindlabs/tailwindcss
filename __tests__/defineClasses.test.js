import c from '../src/util/collapseWhitespace'
import defineClasses from '../src/util/defineClasses'

/**
 * Tests
 */
it('it generates a set of helper classes from a config', () => {
  let output = defineClasses({
    flex: {
      display: 'flex',
    },
    'inline-flex': {
      display: 'inline-flex',
    },
  })
  expect(output).toBeInstanceOf(Array)
  expect(c(output[0].toString())).toEqual(`.flex { display: flex }`)
  expect(c(output[1].toString())).toEqual(`.inline-flex { display: inline-flex }`)
})
