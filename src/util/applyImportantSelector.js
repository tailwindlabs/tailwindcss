import parser from 'postcss-selector-parser'
import { collectPseudoElements, sortSelector } from './formatVariantSelector.js'

export function applyImportantSelector(selector, important) {
  let sel = parser().astSync(selector)

  sel.each((sel) => {
    // Wrap with :is if it's not already wrapped
    let isWrapped =
      sel.nodes[0].type === 'pseudo' &&
      sel.nodes[0].value === ':is' &&
      sel.nodes.every((node) => node.type !== 'combinator')

    if (!isWrapped) {
      sel.nodes = [
        parser.pseudo({
          value: ':is',
          nodes: [sel.clone()],
        }),
      ]
    }

    let [pseudoElements] = collectPseudoElements(sel)
    if (pseudoElements.length > 0) {
      sel.nodes.push(...pseudoElements.sort(sortSelector))
    }
  })

  return `${important} ${sel.toString()}`
}
