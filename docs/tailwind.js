var config = require('../defaultConfig')

config.colors = {
  'black': '#000000',
  'white': '#ffffff',
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

  'red-darker': '#960f0d',
  'red-dark': '#d43633',
  'red': '#f25451',
  'red-light': '#fa8785',
  'red-lighter': '#fff1f0',

  'orange-darker': '#875200',
  'orange-dark': '#f29500',
  'orange': '#ffb82b',
  'orange-light': '#ffd685',
  'orange-lighter': '#fff8eb',

  'yellow-darker': '#966100',
  'yellow-dark': '#ffc400',
  'yellow': '#ffe14a',
  'yellow-light': '#ffea83',
  'yellow-lighter': '#fffbe5',

  'green-darker': '#056619',
  'green-dark': '#34ae4c',
  'green': '#57d06f',
  'green-light': '#b1f3be',
  'green-lighter': '#eefff1',

  'teal-darker': '#025654',
  'teal-dark': '#249e9a',
  'teal': '#4dc0b5',
  'teal-light': '#9eebe4',
  'teal-lighter': '#e8fdfa',

  'blue-darker': '#154267',
  'blue-dark': '#317af6',
  'blue': '#4aa2ea',
  'blue-light': '#acdaff',
  'blue-lighter': '#f1f9ff',

  'indigo-darker': '#242b54',
  'indigo-dark': '#4957a5',
  'indigo': '#6574cd',
  'indigo-light': '#bcc5fb',
  'indigo-lighter': '#f4f5ff',

  'purple-darker': '#331f56',
  'purple-dark': '#714cb4',
  'purple': '#976ae6',
  'purple-light': '#ceb3ff',
  'purple-lighter': '#f7f3ff',

  'pink-darker': '#6b2052',
  'pink-dark': '#d84f7d',
  'pink': '#f66d9b',
  'pink-light': '#ffa5c3',
  'pink-lighter': '#fdf2f5',
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
