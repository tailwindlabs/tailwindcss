import fs from 'fs'
import postcss from 'postcss'

export default function(config) {
  return function(css) {
    const options = config()

    css.walkAtRules('tailwind', atRule => {
      if (atRule.params === 'preflight') {
        atRule.before(
          postcss.parse(
            fs.readFileSync(`${__dirname}/../../css/preflight.css`, 'utf8')
          )
        )
        atRule.remove()
      }
    })
  }
}
