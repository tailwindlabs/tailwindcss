import { quickPluginTest } from '../util/run'

quickPluginTest('listStyleImage', {
  safelist: [
    // Arbitrary values
    'list-image-[url(https://example.com/image.png)]',
    'list-image-[var(--my-value)]',
  ],
}).toMatchSnapshot()
