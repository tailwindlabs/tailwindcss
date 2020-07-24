import preval from 'preval.macro'

export const defaultConfig = preval`
  const defaultTheme = require('tailwindcss/defaultTheme')
  const resolveConfig = require('tailwindcss/resolveConfig')
  module.exports = resolveConfig({ theme: defaultTheme })
`
