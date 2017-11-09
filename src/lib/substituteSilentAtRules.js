export default function() {
  return function(css) {
    css.walkAtRules('silent', atRule => {
      if (atRule.parent.type !== 'root') {
        throw atRule.error(`@silent at-rules cannot be nested.`)
      }

      atRule.remove()
    })
  }
}
