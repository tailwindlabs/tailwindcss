export default function (_context) {
  return (root, result) => {
    let found = false

    root.walkRules((rule) => {
      if (found) return false

      rule.walkRules((nestedRule) => {
        found = true
        nestedRule.warn(
          result,
          // TODO: Improve this warning message
          'Nested CSS detected, checkout the docs on how to support nesting: https://tailwindcss.com/docs/using-with-preprocessors#nesting'
        )

        return false
      })
    })
  }
}
