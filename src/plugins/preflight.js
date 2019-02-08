import fs from 'fs'
import postcss from 'postcss'

export default function() {
  return function({ addBase }) {
    const preflightStyles = postcss.parse(fs.readFileSync(`${__dirname}/css/preflight.css`, 'utf8'))
    addBase(preflightStyles.nodes)
  }
}
