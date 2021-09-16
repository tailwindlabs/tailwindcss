import resolveConfig from '../resolveConfig'
import { createContext } from '../src/lib/setupContextUtils'

it('should generate completions for every possible class, without variants', () => {
  let config = {}

  let context = createContext(resolveConfig(config))
  expect(context.completions()).toBeInstanceOf(Array)

  // Verify we have a `container` for the 'components' section.
  expect(context.completions()).toContain('container')

  // Verify we handle the DEFAULT case correctly
  expect(context.completions()).toContain('border')

  // Verify we handle negative values correctly
  expect(context.completions()).toContain('-inset-1/4')

  // Verify we list extra information for colors (!tuples)
  let fromBlack = context
    .completions()
    .find((value) => Array.isArray(value) && value[0] === 'from-black')

  expect(fromBlack).toMatchObject(['from-black', { color: '#000' }])
})
