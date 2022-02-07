import resolveConfig from '../src/public/resolve-config'
import { createContext } from '../src/lib/setupContextUtils'

it('should generate every possible class, without variants', () => {
  let config = {}

  let context = createContext(resolveConfig(config))
  let classes = context.getClassList()
  expect(classes).toBeInstanceOf(Array)

  // Verify we have a `container` for the 'components' section.
  expect(classes).toContain('container')

  // Verify we handle the DEFAULT case correctly
  expect(classes).toContain('border')

  // Verify we handle negative values correctly
  expect(classes).toContain('-inset-1/4')
  expect(classes).toContain('-m-0')
  expect(classes).not.toContain('-uppercase')
  expect(classes).not.toContain('-opacity-50')

  config = { theme: { extend: { margin: { DEFAULT: '5px' } } } }
  context = createContext(resolveConfig(config))
  classes = context.getClassList()

  expect(classes).not.toContain('-m-DEFAULT')
})
