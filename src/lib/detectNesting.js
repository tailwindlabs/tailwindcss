export default function (_context, warn) {
  return (root) => {
    let found = false

    root.walkRules((rule) => {
      if (found) return false

      rule.walkRules((nestedRule) => {
        found = true
        warn(
          nestedRule,
          // TODO: Improve this warning message
          'Nested CSS detected, checkout the docs on how to support nesting: https://tailwindcss.com/docs/using-with-preprocessors#nesting'
        )
        return false
      })
    })
  }
}
