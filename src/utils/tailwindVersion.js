import preval from 'preval.macro'

export const tailwindVersion = preval`
  module.exports = require('tailwindcss/package.json').version
`
