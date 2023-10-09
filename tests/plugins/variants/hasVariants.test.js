import { quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('hasVariants', {
  safelist: [
    'has-[.foo]:flex',

    'group-has-[.foo]:flex',
    'peer-has-[.foo]:flex',

    'group-has-[.bar]/foo:flex',
    'peer-has-[.bar]/foo:flex',
  ],
}).toMatchSnapshot()
