import { quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('ariaVariants', {
  safelist: [
    'aria-[describedby]:flex',

    'group-aria-[describedby]:flex',
    'peer-aria-[describedby]:flex',

    'group-aria-[describedby]/foo:flex',
    'peer-aria-[describedby]/foo:flex',
  ],
}).toMatchSnapshot()
