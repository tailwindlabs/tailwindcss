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
