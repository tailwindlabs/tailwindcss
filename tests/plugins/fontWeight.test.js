import { quickPluginTest } from '../util/run'

quickPluginTest('fontWeight', {
  safelist: [
    // Arbitrary values
    'font-[bold]',
    'font-[650]',
    'font-[var(--my-value)]',
  ],
}).toMatchSnapshot()
