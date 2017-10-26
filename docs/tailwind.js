var config = require('../defaultConfig')

config.colors = {
  ...config.colors,
  'transparent': 'transparent',

  'slate-darker': '#212b35',
  'slate-dark': '#404e5c',
  'slate': '#647382',
  'slate-light': '#919eab',
  'slate-lighter': '#c5ced6',

  'smoke-darker': '#919eab',
  'smoke-dark': '#c5ced6',
  'smoke': '#dfe3e8',
  'smoke-light': 'hsl(200, 33%, 96%)',
  'smoke-lighter': 'hsl(200, 25%, 98%)',
}

config.fonts = {
  'sans': 'Proxima Nova, proxima-nova, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
  'serif': 'Constantia, "Lucida Bright", Lucidabright, "Lucida Serif", Lucida, "DejaVu Serif", "Bitstream Vera Serif", "Liberation Serif", Georgia, serif',
  'mono': 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
}

config.textSizes = {
  'base': '1rem', // 16px
  'xs': '.75rem', // 12px
  'sm': '.875rem', // 14px
  'md': '1rem', // 16px
  'lg': '1.125rem', // 18px
  'xl': '1.25rem', // 20px
  '2xl': '1.75rem', // 28px
  '3xl': '2.375rem', // 38px
  '4xl': '2.875rem', // 46px
}

config.fontWeights = {
  'normal': 400,
  'semibold': 500,
  'bold': 700,
}

config.textColors = config.colors

config.backgroundColors = config.colors

config.borderColors = {
    default: config.colors['slate-lighter'],
    ...config.colors,
  },

config.width = {
  '128': '32rem',
  ...config.width,
}

config.height = {
  '7': '1.75rem',
  ...config.width,
}

config.padding = {
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '80': '20rem',
  ...config.padding,
}

config.margin = config.padding

config.negativeMargin = config.padding

module.exports = config
