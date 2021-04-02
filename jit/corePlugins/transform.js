const { createSimpleStaticUtilityPlugin } = require('../pluginUtils')

module.exports = createSimpleStaticUtilityPlugin({
  '.transform': {
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
    transform: [
      'translateX(var(--tw-translate-x))',
      'translateY(var(--tw-translate-y))',
      'rotate(var(--tw-rotate))',
      'skewX(var(--tw-skew-x))',
      'skewY(var(--tw-skew-y))',
      'scaleX(var(--tw-scale-x))',
      'scaleY(var(--tw-scale-y))',
    ].join(' '),
  },
  '.transform-gpu': {
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
    transform: [
      'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)',
      'rotate(var(--tw-rotate))',
      'skewX(var(--tw-skew-x))',
      'skewY(var(--tw-skew-y))',
      'scaleX(var(--tw-scale-x))',
      'scaleY(var(--tw-scale-y))',
    ].join(' '),
  },
  '.transform-none': { transform: 'none' },
})
