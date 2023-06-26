import { quickPluginTest } from '../util/run'

quickPluginTest('space', {
  safelist: [
    // Arbitrary values
    'space-x-[0]',
    'space-x-[12px]',
    'space-x-[var(--my-value)]',
    'space-y-[0]',
    'space-y-[34px]',
    'space-y-[var(--my-value)]',
  ],
}).toMatchSnapshot()

// With `logicalSiblingUtilities` enabled
quickPluginTest('space', {
  safelist: [
    // Arbitrary values
    'space-x-[0]',
    'space-x-[12px]',
    'space-x-[var(--my-value)]',
    'space-y-[0]',
    'space-y-[34px]',
    'space-y-[var(--my-value)]',
  ],
  future: {
    logicalSiblingUtilities: true,
  },
}).toMatchSnapshot()
