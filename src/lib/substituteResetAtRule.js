import postcss from 'postcss'
import postcssImport from 'postcss-import'

export default function(options) {
  return function (css) {
    return new Promise((resolve, reject) => {
      const promises = []

      css.walkAtRules('tailwind-reset', atRule => {
        promises.push(postcssImport.process(postcss.parse(`
          @import "normalize.css";
          @import "suitcss-base";

          textarea { resize: vertical; }
          img { max-width: 100%; }
          svg { fill: currentColor; }
          input { font-family: inherit; }
          input::placeholder {
              color: inherit;
              opacity: .7;
          }
          button, [role=button] {
              font-family: inherit;
              cursor: pointer;
          }
        `)).then(result => {
          atRule.before(result.root)
          atRule.remove()
        }))
      })

      Promise.all(promises).then(resolve)
    })
  }
}
