import fs from 'fs'
import postcss from 'postcss'
import packageJson from '../../package.json'

export default function () {
  return function ({ addBase }) {
    const preflightStyles = postcss.parse(fs.readFileSync(`${__dirname}/css/preflight.css`, 'utf8'))

    addBase([
      postcss.comment({
        text: `! tailwindcss v${packageJson.version} | MIT License | https://tailwindcss.com`,
      }),
      ...preflightStyles.nodes,
    ])
  }
}
