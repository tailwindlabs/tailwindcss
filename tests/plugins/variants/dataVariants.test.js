import { quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('dataVariants', {
  safelist: [
    'data-[describedby]:flex',

    'group-data-[describedby]:flex',
    'peer-data-[describedby]:flex',

    'group-data-[describedby]/foo:flex',
    'peer-data-[describedby]/foo:flex',
  ],
}).toMatchSnapshot()
