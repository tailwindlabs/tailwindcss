var config = require('tailwindcss/defaultConfig')

config.theme.screens = {
  'sm': '576px',
  'md': '768px',
  'lg': '992px',
  'xl': '1280px',
}

config.theme.colors = Object.assign(config.theme.colors, {
  'tailwind-teal-light': '#5ebcca',
  'tailwind-teal': '#44a8b3',
  'tailwind-teal-dark': '#2f8696',
})

config.theme.fontFamily = Object.assign(config.theme.fontFamily, {
  'source-sans': 'Source Sans Pro, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
})

config.theme.fontSize = {
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

config.theme.textColor = config.theme.colors

config.theme.backgroundColor = config.theme.colors

config.theme.borderWidth = Object.assign(config.theme.borderWidth, {
  '6': '6px',
})

config.theme.borderColor = Object.assign(config.theme.colors, {
  default: config.theme.colors['grey-light'],
})

config.theme.width = Object.assign(config.theme.width, {
  '5': '1.25rem',
  '128': '32rem',
})

config.theme.maxWidth = Object.assign(config.theme.maxWidth, {
  'screen-xl': config.theme.screens.xl,
})

config.theme.height = Object.assign(config.theme.height, {
  '7': '1.75rem',
  '20': '5rem',
  '128': '32rem',
  '(screen-16)': 'calc(100vh - 4rem)',
})

config.theme.maxHeight = Object.assign(config.theme.maxHeight, {
  'xs': '20rem',
  'sm': '30rem',
  '(screen-16)': 'calc(100vh - 4rem)',
})

config.theme.padding = Object.assign(config.theme.padding, {
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '80': '20rem',
})

config.theme.margin = Object.assign(config.theme.margin, {
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '80': '20rem',
})

config.theme.negativeMargin = config.theme.margin

config.theme.boxShadow = Object.assign({
  'md-light': '0 0 12px 8px rgb(255,255,255)'
}, config.theme.boxShadow)

config.theme.zIndex = Object.assign(config.theme.zIndex, {
  '90': '90',
  '100': '100',
})

config.variants.backgroundColor = ['responsive', 'hover', 'focus']
config.variants.borderColor = ['responsive', 'hover', 'focus']
config.variants.borderWidth = ['responsive', 'hover', 'focus']

module.exports = config
