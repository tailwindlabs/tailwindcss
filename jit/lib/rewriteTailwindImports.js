function rewriteTailwindImports(root) {
  root.walkAtRules('import', (atRule) => {
    if (atRule.params === '"tailwindcss/base"' || atRule.params === "'tailwindcss/base'") {
      atRule.name = 'tailwind'
      atRule.params = 'base'
    } else if (
      atRule.params === '"tailwindcss/components"' ||
      atRule.params === "'tailwindcss/components'"
    ) {
      atRule.name = 'tailwind'
      atRule.params = 'components'
    } else if (
      atRule.params === '"tailwindcss/utilities"' ||
      atRule.params === "'tailwindcss/utilities'"
    ) {
      atRule.name = 'tailwind'
      atRule.params = 'utilities'
    } else if (
      atRule.params === '"tailwindcss/screens"' ||
      atRule.params === "'tailwindcss/screens'"
    ) {
      atRule.name = 'tailwind'
      atRule.params = 'screens'
    }
  })
}

module.exports = rewriteTailwindImports
