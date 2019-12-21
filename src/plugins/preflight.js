import fs from 'fs'
import postcss from 'postcss'

export default function() {
  return function({ addBase, theme }) {
    const normalizeStyles = postcss.parse(fs.readFileSync(require.resolve('normalize.css'), 'utf8'))
    const preflightStyles = postcss.parse(fs.readFileSync(`${__dirname}/css/preflight.css`, 'utf8'))

    if (!theme('fontFamily.base')) {
      const interFontStyles = postcss.parse(fs.readFileSync(`${__dirname}/css/inter.css`, 'utf8'))
      addBase([...normalizeStyles.nodes, ...interFontStyles.nodes, ...preflightStyles.nodes])
    } else {
      addBase([...normalizeStyles.nodes, ...preflightStyles.nodes])
    }
  }
}
