import { quickPluginTest } from '../util/run'

quickPluginTest('scrollMargin', {
  safelist: [
    // Arbitrary values
    'scroll-m-[12px]',
    'scroll-m-[var(--my-value)]',

    'scroll-mx-[23px]',
    'scroll-mx-[var(--my-value)]',
    'scroll-my-[34px]',
    'scroll-my-[var(--my-value)]',

    'scroll-ms-[45px]',
    'scroll-ms-[var(--my-value)]',
    'scroll-me-[56px]',
    'scroll-me-[var(--my-value)]',
    'scroll-mt-[67px]',
    'scroll-mt-[var(--my-value)]',
    'scroll-mr-[78px]',
    'scroll-mr-[var(--my-value)]',
    'scroll-mb-[89px]',
    'scroll-mb-[var(--my-value)]',
    'scroll-ml-[90px]',
    'scroll-ml-[var(--my-value)]',
  ],
}).toMatchSnapshot()
