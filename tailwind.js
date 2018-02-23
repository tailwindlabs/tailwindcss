var config = require('tailwindcss/defaultConfig')()

config.screens = {
  'sm': '576px',
  'md': '768px',
  'lg': '992px',
  'xl': '1280px',
}

config.colors = Object.assign(config.colors, {
  'tailwind-teal-light': '#5ebcca',
  'tailwind-teal': '#44a8b3',
  'tailwind-teal-dark': '#2f8696',
})

config.fonts = Object.assign(config.fonts, {
  'lato': 'lato, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
  'proxima': 'Proxima Nova, proxima-nova, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
  'source-sans': 'Source Sans Pro, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
})

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

config.textColors = config.colors

config.backgroundColors = config.colors

config.borderWidths = Object.assign(config.borderWidths, {
  '6': '6px',
})

config.borderColors = Object.assign(config.colors, {
  default: config.colors['grey-light'],
})

config.width = Object.assign(config.width, {
  '5': '1.25rem',
  '128': '32rem',
})

config.maxWidth = Object.assign(config.maxWidth, {
  'screen-xl': config.screens.xl,
})

config.height = Object.assign(config.height, {
  '7': '1.75rem',
  '20': '5rem',
  '128': '32rem',
  '(screen-16)': 'calc(100vh - 4rem)',
})

config.maxHeight = Object.assign(config.maxHeight, {
  'sm': '30rem',
  '(screen-16)': 'calc(100vh - 4rem)',
})

config.padding = Object.assign(config.padding, {
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '80': '20rem',
})

config.margin = Object.assign(config.margin, {
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '80': '20rem',
})

config.negativeMargin = config.margin

config.shadows = Object.assign({
  'md-light': '0 0 12px 8px rgb(255,255,255)'
}, config.shadows)

config.zIndex = Object.assign(config.zIndex, {
  '90': '90',
  '100': '100',
})

config.modules.backgroundColors = ['responsive', 'hover', 'focus']
config.modules.borderColors = ['responsive', 'hover', 'focus']
config.modules.borderWidths = ['responsive', 'hover', 'focus']

module.exports = config
