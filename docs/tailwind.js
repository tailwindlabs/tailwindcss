var config = require('../defaultConfig')()

config.colors = Object.assign(config.colors, {
  'new-white': 'hsl(208, 0%, 100%)',
  'new-grey-lightest': 'hsl(208, 35%, 98%)',
  'new-grey-lighter': 'hsl(208, 33%, 96%)',
  'new-grey-light': 'hsl(208, 20%, 88%)',
  'new-grey': 'hsl(208, 16%, 76%)',
  'new-grey-dark': 'hsl(208, 12%, 58%)',
  'new-grey-darker': 'hsl(208, 12%, 43%)',
  'new-grey-darkest': 'hsl(208, 15%, 28%)',
  'new-black': 'hsl(208, 16%, 16%)',

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

  'tailwind-teal-light': '#5ebcca',
  'tailwind-teal': '#44a8b3',
  'tailwind-teal-dark': '#2f8696',
})

config.colors = Object.assign(config.colors, {
  // 'slate-darker': config.colors['new-black'],
  // 'slate-dark': config.colors['new-grey-darkest'],
  // 'slate': config.colors['new-grey-darker'],
  // 'slate-light': config.colors['new-grey-dark'],
  // 'slate-lighter': config.colors['new-grey'],

  // 'smoke-darker': config.colors['new-grey-dark'],
  // 'smoke-dark': config.colors['new-grey'],
  // 'smoke': config.colors['new-grey-light'],
  // 'smoke-light': config.colors['new-grey-lighter'],
  // 'smoke-lighter': config.colors['new-grey-lightest'],

  'tailwind-teal-light': '#5ebcca',
  'tailwind-teal': '#44a8b3',
  'tailwind-teal-dark': '#2f8696',
})

config.fonts = {
  'sans': 'aktiv-grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
  'serif': 'Constantia, "Lucida Bright", Lucidabright, "Lucida Serif", Lucida, "DejaVu Serif", "Bitstream Vera Serif", "Liberation Serif", Georgia, serif',
  'mono': 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
}

config.textSizes = {
  'xs': '.75rem',     // 12px
  'sm': '.875rem',    // 14px
  'base': '1rem',     // 16px
  'lg': '1.125rem',   // 18px
  'xl': '1.25rem',    // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
}

config.fontWeights = {
  'light': 300,
  'normal': 400,
  'semibold': 500,
  'bold': 700,
}

config.tracking = {
  'tight': '-0.02em',
  'normal': '0',
  'wide': '0.05em',
}

config.textColors = config.colors

config.backgroundColors = config.colors

config.borderWidths = Object.assign(config.borderWidths, {
  '6': '6px',
})

config.borderColors = Object.assign(config.colors, {
  default: config.colors['slate-lighter'],
})

config.width = Object.assign(config.width, {
  '5': '1.25rem',
  '128': '32rem',
})

config.height = Object.assign(config.height, {
  '7': '1.75rem',
  '128': '32rem',
})

config.maxHeight = Object.assign(config.maxHeight, {
  'sm': '30rem',
})

config.padding = Object.assign(config.padding, {
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '80': '20rem',
})

config.margin = Object.assign(config.margin, {
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '80': '20rem',
})

config.negativeMargin = config.margin

config.shadows = Object.assign({
  'md-light': '0 0 12px 8px rgb(255,255,255)'
}, config.shadows)

module.exports = config
