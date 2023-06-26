import { quickPluginTest } from '../util/run'

quickPluginTest('scrollPadding', {
  safelist: [
    // Arbitrary values
    'scroll-p-[12px]',
    'scroll-p-[var(--my-value)]',

    'scroll-px-[23px]',
    'scroll-px-[var(--my-value)]',
    'scroll-py-[34px]',
    'scroll-py-[var(--my-value)]',

    'scroll-ps-[45px]',
    'scroll-ps-[var(--my-value)]',
    'scroll-pe-[56px]',
    'scroll-pe-[var(--my-value)]',
    'scroll-pt-[67px]',
    'scroll-pt-[var(--my-value)]',
    'scroll-pr-[78px]',
    'scroll-pr-[var(--my-value)]',
    'scroll-pb-[89px]',
    'scroll-pb-[var(--my-value)]',
    'scroll-pl-[90px]',
    'scroll-pl-[var(--my-value)]',
  ],
}).toMatchSnapshot()
