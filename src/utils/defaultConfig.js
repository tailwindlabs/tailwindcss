// @preval
const defaultTheme = require('tailwindcss/defaultTheme')
const resolveConfig = require('tailwindcss/resolveConfig')
module.exports.defaultConfig = resolveConfig({ theme: defaultTheme })
