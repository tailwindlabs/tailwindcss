import resolveConfig from '../src/public/resolve-config'
import { createContext } from '../src/lib/setupContextUtils'

it('should generate every possible class, without variants', () => {
  let config = {}

  let context = createContext(resolveConfig(config))
  expect(context.getClassList()).toBeInstanceOf(Array)

  // Verify we have a `container` for the 'components' section.
  expect(context.getClassList()).toContain('container')

  // Verify we handle the DEFAULT case correctly
  expect(context.getClassList()).toContain('border')

  // Verify we handle negative values correctly
  expect(context.getClassList()).toContain('-inset-1/4')
  expect(context.getClassList()).toContain('-m-0')
  expect(context.getClassList()).not.toContain('-uppercase')
  expect(context.getClassList()).not.toContain('-opacity-50')
  expect(
    createContext(
      resolveConfig({ theme: { extend: { margin: { DEFAULT: '5px' } } } })
    ).getClassList()
  ).not.toContain('-m-DEFAULT')
})
