var config = require('../defaultConfig')()

config.colors = Object.assign(config.colors, {
  'new-white': 'hsl(0, 0%, 100%)',
  'new-grey-lightest': 'hsl(200, 25%, 98%)',
  'new-grey-lighter': 'hsl(200, 33%, 96%)',
  'new-grey-light': 'hsl(200, 25%, 88%)',
  'new-grey': 'hsl(200, 14%, 66%)',
  'new-grey-dark': 'hsl(200, 10%, 49%)',
  'new-grey-darker': 'hsl(200, 13%, 40%)',
  'new-grey-darkest': 'hsl(200, 15%, 25%)',
  'new-black': 'hsl(200, 16%, 16%)',

  'new-white': 'hsl(0, 0%, 100%)',
  'new-grey-lightest': 'hsl(200, 12%, 98%)',
  'new-grey-lighter': 'hsl(200, 12%, 96%)',
  'new-grey-light': 'hsl(200, 12%, 88%)',
  'new-grey': 'hsl(200, 12%, 66%)',
  'new-grey-dark': 'hsl(200, 12%, 49%)',
  'new-grey-darker': 'hsl(200, 13%, 40%)',
  'new-grey-darkest': 'hsl(200, 15%, 25%)',
  'new-black': 'hsl(200, 16%, 16%)',

  'new-white': 'hsl(208, 0%, 100%)',
  'new-grey-lightest': 'hsl(208, 35%, 98%)',
  'new-grey-lighter': 'hsl(208, 30%, 96%)',
  'new-grey-light': 'hsl(208, 20%, 88%)',
  'new-grey': 'hsl(208, 16%, 73%)',
  'new-grey-dark': 'hsl(208, 11%, 55%)',
  'new-grey-darker': 'hsl(208, 12%, 41%)',
  'new-grey-darkest': 'hsl(208, 15%, 26%)',
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
