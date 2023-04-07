import type { Selector, Pseudo, Node } from 'postcss-selector-parser'

// There are some pseudo-elements that may or may not be:

// **Actionable**
// Zero or more user-action pseudo-classes may be attached to the pseudo-element itself
// structural-pseudo-classes are NOT allowed but we don't make
// The spec is not clear on whether this is allowed or not — but in practice it is.

// **Terminal**
// It MUST be placed at the end of a selector
//
// This is the required in the spec. However, some pseudo elements are not "terminal" because
// they represent a "boundary piercing" that is compiled out by a build step.

// **Jumpable**
// Any terminal element may "jump" over combinators when moving to the end of the selector
//
// This is a backwards-compat quirk of :before and :after variants.

type PseudoProperty = 'terminal' | 'actionable' | 'jumpable'

let elementProperties: Record<string, PseudoProperty[]> = {
  '::after': ['terminal', 'jumpable'],
  '::backdrop': ['terminal'],
  '::before': ['terminal', 'jumpable'],
  '::cue': ['terminal'],
  '::cue-region': ['terminal'],
  '::first-letter': ['terminal', 'jumpable'],
  '::first-line': ['terminal', 'jumpable'],
  '::grammar-error': ['terminal'],
  '::marker': ['terminal'],
  '::part': ['terminal', 'actionable'],
  '::placeholder': ['terminal'],
  '::selection': ['terminal'],
  '::slotted': ['terminal'],
  '::spelling-error': ['terminal'],
  '::target-text': ['terminal'],

  // other
  '::file-selector-button': ['terminal', 'actionable'],
  '::-webkit-progress-bar': ['terminal', 'actionable'],

  // Webkit scroll bar pseudo elements can be combined with user-action pseudo classes
  '::-webkit-scrollbar': ['terminal', 'actionable'],
  '::-webkit-scrollbar-button': ['terminal', 'actionable'],
  '::-webkit-scrollbar-thumb': ['terminal', 'actionable'],
  '::-webkit-scrollbar-track': ['terminal', 'actionable'],
  '::-webkit-scrollbar-track-piece': ['terminal', 'actionable'],
  '::-webkit-scrollbar-corner': ['terminal', 'actionable'],
  '::-webkit-resizer': ['terminal', 'actionable'],

  // Note: As a rule, double colons (::) should be used instead of a single colon
  // (:). This distinguishes pseudo-classes from pseudo-elements. However, since
  // this distinction was not present in older versions of the W3C spec, most
  // browsers support both syntaxes for the original pseudo-elements.
  ':after': ['terminal', 'jumpable'],
  ':before': ['terminal', 'jumpable'],
  ':first-letter': ['terminal', 'jumpable'],
  ':first-line': ['terminal', 'jumpable'],

  // The default value is used when the pseudo-element is not recognized
  // Because it's not recognized, we don't know if it's terminal or not
  // So we assume it can't be moved AND can have user-action pseudo classes attached to it
  __default__: ['actionable'],
}

export function movePseudos(sel: Selector) {
  let [pseudos] = movablePseudos(sel)

  // Remove all pseudo elements from their respective selectors
  pseudos.forEach(([sel, pseudo]) => sel.removeChild(pseudo))

  // Re-add them to the end of the selector in the correct order.
  // This moves terminal pseudo elements to the end of the
  // selector otherwise the selector will not be valid.
  //
  // Examples:
  //  - `before:hover:text-center` would result in `.before\:hover\:text-center:hover::before`
  //  - `hover:before:text-center` would result in `.hover\:before\:text-center:hover::before`
  //
  // The selector `::before:hover` does not work but we
  // can make it work for you by flipping the order.
  sel.nodes.push(...pseudos.map(([, pseudo]) => pseudo))

  return sel
}

type MovablePseudo = [sel: Selector, pseudo: Pseudo, attachedTo: Pseudo | null]
type MovablePseudosResult = [pseudos: MovablePseudo[], lastSeenElement: Pseudo | null]

function movablePseudos(sel: Selector): MovablePseudosResult {
  let buffer: MovablePseudo[] = []
  let lastSeenElement: Pseudo | null = null

  for (let node of sel.nodes) {
    if (node.type === 'combinator') {
      buffer = buffer.filter(([, node]) => propertiesForPseudo(node).includes('jumpable'))
      lastSeenElement = null
    } else if (node.type === 'pseudo') {
      if (isMovablePseudoElement(node)) {
        lastSeenElement = node
        buffer.push([sel, node, null])
      } else if (lastSeenElement && isAttachablePseudoClass(node, lastSeenElement)) {
        buffer.push([sel, node, lastSeenElement])
      } else {
        lastSeenElement = null
      }

      for (let sub of node.nodes ?? []) {
        let [movable, lastSeenElementInSub] = movablePseudos(sub)
        lastSeenElement = lastSeenElementInSub || lastSeenElement
        buffer.push(...movable)
      }
    }
  }

  return [buffer, lastSeenElement]
}

function isPseudoElement(node: Pseudo): boolean {
  return node.value.startsWith('::') || elementProperties[node.value] !== undefined
}

function isMovablePseudoElement(node: Pseudo) {
  return isPseudoElement(node) && propertiesForPseudo(node).includes('terminal')
}

function isAttachablePseudoClass(node: Node, pseudo: Pseudo) {
  if (node.type !== 'pseudo') return false
  if (isPseudoElement(node)) return false

  return propertiesForPseudo(pseudo).includes('actionable')
}

function propertiesForPseudo(pseudo: Pseudo) {
  return elementProperties[pseudo.value] ?? elementProperties.__default__
}
