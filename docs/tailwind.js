var config = require('../defaultConfig')

config.colors = {
  ...config.colors,

  'smoke-darker': '#919eab',
  'smoke-dark': '#c5ced6',
  'smoke': '#dfe3e8',
  'smoke-light': 'hsl(200, 33%, 96%)',
  'smoke-lighter': 'hsl(200, 25%, 98%)',

  'tailwind-teal': '#44A8B3',
  'tailwind-teal-dark': '#2F8696',
}

config.fonts = {
  'sans': 'Aktiv Grotesk, aktiv-grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
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

config.borderWidths = {
  '6': '6px',
  ...config.borderWidths,
}

config.borderColors = {
  default: config.colors['slate-lighter'],
  ...config.colors,
}

config.width = {
  '5': '1.25rem',
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
  '20': '5rem',
  '80': '20rem',
  ...config.padding,
}

config.margin = config.padding

config.negativeMargin = config.padding

module.exports = config
