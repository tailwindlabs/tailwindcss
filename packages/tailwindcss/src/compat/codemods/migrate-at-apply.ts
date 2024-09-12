import { walk, type AstNode } from '../../ast'
import { segment } from '../../utils/segment'

export function migrateAtApply(ast: AstNode[]) {
  walk(ast, (node) => {
    if (node.kind !== 'rule' || node.selector[0] !== '@' || !node.selector.startsWith('@apply')) {
      return
    }

    let utilities = segment(node.selector.slice(7), ' ')
    let important =
      utilities[utilities.length - 1] === '!important' ||
      utilities[utilities.length - 1] === '#{!important}' // Sass/SCSS

    if (important) utilities.pop() // Ignore `!important`

    let params = utilities.map((part) => {
      let variants = segment(part, ':')
      let utility = variants.pop()!

      // Apply the important modifier to all the rules if necessary
      if (important && utility[0] !== '!' && utility[utility.length - 1] !== '!') {
        utility += '!'
      }

      // Migrate the important modifier to the end of the utility
      if (utility[0] === '!') {
        utility = `${utility.slice(1)}!`
      }

      // Reconstruct the utility with the variants
      return [...variants, utility].join(':')
    })

    node.selector = `@apply ${params.join(' ')}`
  })
}
