import { hasTailwindFunctions } from './lib/evaluateTailwindFunctions'

/**
 * Determine if Tailwind should run for a given file
 *
 * @param {import('postcss').Root} root
 */
export function shouldRun(root) {
  let shouldRun = false

  root.walk((node) => {
    if (node.type === 'atrule' && isRelevantAtRule(node)) {
      shouldRun = true
      return false
    }

    if (hasTailwindFunctions(node)) {
      shouldRun = true
      return false
    }
  })

  return shouldRun
}

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {boolean}
 */
function isRelevantAtRule(atRule) {
  let layers = ['base', 'components', 'utilities']
  let directives = ['base', 'components', 'utilities', 'variants']
  let imports = [
    `"tailwindcss/base"`,
    `'tailwindcss/base'`,
    `"tailwindcss/components"`,
    `'tailwindcss/components'`,
    `"tailwindcss/utilities"`,
    `'tailwindcss/utilities'`,
    `"tailwindcss/variants"`,
    `'tailwindcss/variants'`,
  ]

  if (atRule.name === 'apply') {
    return true
  } else if (atRule.name === 'variants') {
    return true
  } else if (atRule.name === 'responsive') {
    return true
  } else if (atRule.name === 'defaults') {
    return true // TODO: Should be here?
  } else if (atRule.name === 'tailwind') {
    return directives.includes(atRule.params)
  } else if (atRule.name === 'layer') {
    return layers.includes(atRule.params)
  } else if (atRule.name === 'import') {
    return imports.includes(atRule.params)
  }

  return false
}
