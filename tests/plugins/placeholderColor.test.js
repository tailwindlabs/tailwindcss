import { quickPluginTest } from '../util/run'

quickPluginTest('placeholderColor', {
  safelist: [
    // Arbitrary values
    'placeholder-[#0088cc]',
    'placeholder-[var(--my-value)]',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#000',
      red: {
        100: '#fee2e2',
        200: '#fecaca',
      },
    },
  },
}).toMatchSnapshot()

// With `placeholderOpacity` enabled
quickPluginTest('placeholderColor', {
  safelist: [
    // Arbitrary values
    'placeholder-[#0088cc]',
    'placeholder-[var(--my-value)]',
  ],
  corePlugins: ['placeholderOpacity'],
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#000',
      red: {
        100: '#fee2e2',
        200: '#fecaca',
      },
    },
    opacity: {
      0: '0',
      50: '.5',
    },
  },
}).toMatchSnapshot()
