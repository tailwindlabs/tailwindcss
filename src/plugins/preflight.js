import path from 'path'
import fs from 'fs'
import postcss from 'postcss'

export default function () {
  return function ({ addBase }) {
    try {
      const normalizeStyles = postcss.parse(
        fs.readFileSync(require.resolve('modern-normalize'), 'utf8')
      )
      const preflightStyles = postcss.parse(
        fs.readFileSync(
          path.resolve(process.env.INIT_CWD, 'src', 'plugins', 'css', 'preflight.css')
        )
      )
      addBase([...normalizeStyles.nodes, ...preflightStyles.nodes])
    } catch (e) {
      throw e
    }
  }
}
