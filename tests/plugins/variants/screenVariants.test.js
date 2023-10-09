import { quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('screenVariants', {
  safelist: [
    '2xl:flex',
    'xl:flex',
    'lg:flex',
    'md:flex',
    'sm:flex',

    'min-[100px]:flex',
    'max-[100px]:flex',
  ],
}).toMatchSnapshot()
