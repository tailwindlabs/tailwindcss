import { quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('supportsVariants', {
  safelist: [
    'supports-[display]:flex',
    'supports-[display:grid]:flex',
    'supports-[foo_or_bar]:flex',
    'supports-[foo_or_bar_and_not_baz]:flex',
  ],
}).toMatchSnapshot()
