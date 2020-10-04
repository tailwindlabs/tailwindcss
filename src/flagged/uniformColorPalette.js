import chalk from 'chalk'
import log from '../util/log'

log.error([
  `The ${chalk.red(
    'uniformColorPalette'
  )} experiment has been removed in favor of a different color palette.`,
  'If you would like to continue using this palette, you can copy it manually from here:',
  'https://github.com/tailwindlabs/tailwindcss/blob/753925f72c61980fa6d7ba398b7e2a1ba0e4b438/src/flagged/uniformColorPalette.js',
])
console.warn('')

throw new Error('Enabled experimental feature has been removed.')

export default {}
