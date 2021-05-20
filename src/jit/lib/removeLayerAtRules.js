export default function removeLayerAtRules(_context, tailwindDirectives) {
  return (root) => {
    root.walkAtRules((rule) => {
      if (rule.name === 'layer' && ['base', 'components', 'utilities'].includes(rule.params)) {
        if (!tailwindDirectives.has(rule.params)) {
          throw rule.error(
            `\`@layer ${rule.params}\` is used but no matching \`@tailwind ${rule.params}\` directive is present.`
          )
        }
        rule.remove()
      } else if (rule.name === 'responsive') {
        if (!tailwindDirectives.has('utilities')) {
          throw rule.error('`@responsive` is used but `@tailwind utilities` is missing.')
        }
        rule.remove()
      } else if (rule.name === 'variants') {
        if (!tailwindDirectives.has('utilities')) {
          throw rule.error('`@variants` is used but `@tailwind utilities` is missing.')
        }
        rule.remove()
      }
    })
  }
}
