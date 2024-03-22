function isRoot(node) {
  return node.type === 'root'
}

function isAtLayer(node) {
  return node.type === 'atrule' && node.name === 'layer'
}

export default function (_context) {
  return (root, result) => {
    let found = false

    root.walkRules((rule) => {
      if (found) return false

      rule.walkRules((nestedRule) => {
        found = true
        nestedRule.warn(
          result,
          [
            'Nested CSS was detected, but CSS nesting has not been configured correctly.',
            'Please enable a CSS nesting plugin *before* Tailwind in your configuration.',
            'See how here: https://tailwindcss.com/docs/using-with-preprocessors#nesting',
          ].join('\n')
        )
        return false
      })
    })
  }
}
