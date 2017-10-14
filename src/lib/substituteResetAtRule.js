import fs from 'fs'
import postcss from 'postcss'
import postcssImport from 'postcss-import'

export default function(options) {
  return function (css) {
    return new Promise((resolve, reject) => {
      const promises = []

      css.walkAtRules('tailwind', atRule => {
        if (atRule.params === 'reset') {
          promises.push(postcssImport.process(postcss.parse(fs.readFileSync(`${__dirname}/../../css/preflight.css`, {
            encoding: 'utf8'
          }))).then(result => {
            atRule.before(result.root)
            atRule.remove()
          }))
        }
      })

      Promise.all(promises).then(resolve)
    })
  }
}
