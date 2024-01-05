import { quickVariantPluginTest } from '../../util/run'

// Default media dark mode
quickVariantPluginTest('darkVariants').toMatchSnapshot()

// Class dark mode
quickVariantPluginTest('darkVariants', {
  darkMode: 'class',
}).toMatchSnapshot()

// Class dark mode with custom class name
quickVariantPluginTest('darkVariants', {
  darkMode: ['class', '.my-dark-mode'],
}).toMatchSnapshot()

// Selector dark mode
quickVariantPluginTest('darkVariants', {
  darkMode: 'selector',
}).toMatchSnapshot()

// Selector dark mode with custom selector
quickVariantPluginTest('darkVariants', {
  darkMode: ['selector', '.my-dark-mode'],
}).toMatchSnapshot()

