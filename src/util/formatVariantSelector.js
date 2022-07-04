import selectorParser from 'postcss-selector-parser'
import unescape from 'postcss-selector-parser/dist/util/unesc'
import escapeClassName from '../util/escapeClassName'
import prefixSelector from '../util/prefixSelector'

let MERGE = ':merge'
let PARENT = '&'

export let selectorFunctions = new Set([MERGE])

export function formatVariantSelector(current, ...others) {
  for (let other of others) {
    let incomingValue = resolveFunctionArgument(other, MERGE)
    if (incomingValue !== null) {
      let existingValue = resolveFunctionArgument(current, MERGE, incomingValue)
      if (existingValue !== null) {
        let existingTarget = `${MERGE}(${incomingValue})`
        let splitIdx = other.indexOf(existingTarget)
        let addition = other.slice(splitIdx + existingTarget.length).split(' ')[0]

        current = current.replace(existingTarget, existingTarget + addition)
        continue
      }
    }

    current = other.replace(PARENT, current)
  }

  return current
}

export function finalizeSelector(
  format,
  {
    selector,
    candidate,
    context,
    isArbitraryVariant,

    // Split by the separator, but ignore the separator inside square brackets:
    //
    // E.g.: dark:lg:hover:[paint-order:markers]
    //           ┬  ┬     ┬            ┬
    //           │  │     │            ╰── We will not split here
    //           ╰──┴─────┴─────────────── We will split here
    //
    base = candidate
      .split(new RegExp(`\\${context?.tailwindConfig?.separator ?? ':'}(?![^[]*\\])`))
      .pop(),
  }
) {
  let ast = selectorParser().astSync(selector)

  // We explicitly DO NOT prefix classes in arbitrary variants
  if (context?.tailwindConfig?.prefix && !isArbitraryVariant) {
    format = prefixSelector(context.tailwindConfig.prefix, format)
  }

  format = format.replace(PARENT, `.${escapeClassName(candidate)}`)

  let formatAst = selectorParser().astSync(format)

  // Remove extraneous selectors that do not include the base class/candidate being matched against
  // For example if we have a utility defined `.a, .b { color: red}`
  // And the formatted variant is sm:b then we want the final selector to be `.sm\:b` and not `.a, .sm\:b`
  ast.each((node) => {
    let hasClassesMatchingCandidate = node.some((n) => n.type === 'class' && n.value === base)

    if (!hasClassesMatchingCandidate) {
      node.remove()
    }
  })

  // Normalize escaped classes, e.g.:
  //
  // The idea would be to replace the escaped `base` in the selector with the
  // `format`. However, in css you can escape the same selector in a few
  // different ways. This would result in different strings and therefore we
  // can't replace it properly.
  //
  //               base: bg-[rgb(255,0,0)]
  //   base in selector: bg-\\[rgb\\(255\\,0\\,0\\)\\]
  //       escaped base: bg-\\[rgb\\(255\\2c 0\\2c 0\\)\\]
  //
  ast.walkClasses((node) => {
    if (node.raws && node.value.includes(base)) {
      node.raws.value = escapeClassName(unescape(node.raws.value))
    }
  })

  // We can safely replace the escaped base now, since the `base` section is
  // now in a normalized escaped value.
  ast.walkClasses((node) => {
    if (node.value === base) {
      node.replaceWith(...formatAst.nodes)
    }
  })

  // This will make sure to move pseudo's to the correct spot (the end for
  // pseudo elements) because otherwise the selector will never work
  // anyway.
  //
  // E.g.:
  //  - `before:hover:text-center` would result in `.before\:hover\:text-center:hover::before`
  //  - `hover:before:text-center` would result in `.hover\:before\:text-center:hover::before`
  //
  // `::before:hover` doesn't work, which means that we can make it work for you by flipping the order.
  function collectPseudoElements(selector) {
    let nodes = []

    for (let node of selector.nodes) {
      if (isPseudoElement(node)) {
        nodes.push(node)
        selector.removeChild(node)
      }

      if (node?.nodes) {
        nodes.push(...collectPseudoElements(node))
      }
    }

    return nodes
  }

  // Remove unnecessary pseudo selectors that we used as placeholders
  ast.each((selector) => {
    selector.walkPseudos((p) => {
      if (selectorFunctions.has(p.value)) {
        p.replaceWith(p.nodes)
      }
    })

    let pseudoElements = collectPseudoElements(selector)
    if (pseudoElements.length > 0) {
      selector.nodes.push(pseudoElements.sort(sortSelector))
    }
  })

  return ast.toString()
}

// Note: As a rule, double colons (::) should be used instead of a single colon
// (:). This distinguishes pseudo-classes from pseudo-elements. However, since
// this distinction was not present in older versions of the W3C spec, most
// browsers support both syntaxes for the original pseudo-elements.
let pseudoElementsBC = [':before', ':after', ':first-line', ':first-letter']

// These pseudo-elements _can_ be combined with other pseudo selectors AND the order does matter.
let pseudoElementExceptions = ['::file-selector-button']

// This will make sure to move pseudo's to the correct spot (the end for
// pseudo elements) because otherwise the selector will never work
// anyway.
//
// E.g.:
//  - `before:hover:text-center` would result in `.before\:hover\:text-center:hover::before`
//  - `hover:before:text-center` would result in `.hover\:before\:text-center:hover::before`
//
// `::before:hover` doesn't work, which means that we can make it work
// for you by flipping the order.
function sortSelector(a, z) {
  // Both nodes are non-pseudo's so we can safely ignore them and keep
  // them in the same order.
  if (a.type !== 'pseudo' && z.type !== 'pseudo') {
    return 0
  }

  // If one of them is a combinator, we need to keep it in the same order
  // because that means it will start a new "section" in the selector.
  if ((a.type === 'combinator') ^ (z.type === 'combinator')) {
    return 0
  }

  // One of the items is a pseudo and the other one isn't. Let's move
  // the pseudo to the right.
  if ((a.type === 'pseudo') ^ (z.type === 'pseudo')) {
    return (a.type === 'pseudo') - (z.type === 'pseudo')
  }

  // Both are pseudo's, move the pseudo elements (except for
  // ::file-selector-button) to the right.
  return isPseudoElement(a) - isPseudoElement(z)
}

function isPseudoElement(node) {
  if (node.type !== 'pseudo') return false
  if (pseudoElementExceptions.includes(node.value)) return false

  return node.value.startsWith('::') || pseudoElementsBC.includes(node.value)
}

function resolveFunctionArgument(haystack, needle, arg) {
  let startIdx = haystack.indexOf(arg ? `${needle}(${arg})` : needle)
  if (startIdx === -1) return null

  // Start inside the `(`
  startIdx += needle.length + 1

  let target = ''
  let count = 0

  for (let char of haystack.slice(startIdx)) {
    if (char !== '(' && char !== ')') {
      target += char
    } else if (char === '(') {
      target += char
      count++
    } else if (char === ')') {
      if (--count < 0) break // unbalanced
      target += char
    }
  }

  return target
}
