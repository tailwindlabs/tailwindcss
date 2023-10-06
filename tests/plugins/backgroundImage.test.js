import { quickPluginTest } from '../util/run'

quickPluginTest('backgroundImage', {
  safelist: [
    // Arbitrary values
    'bg-[url(/my-image.png)]',
  ],
}).toMatchSnapshot()
