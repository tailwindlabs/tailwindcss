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

export function finalizeSelector(format, { selector, candidate, context }) {
  let base = candidate.split(context?.tailwindConfig?.separator ?? ':').pop()

  if (context?.tailwindConfig?.prefix) {
    format = prefixSelector(context.tailwindConfig.prefix, format)
  }

  format = format.replace(PARENT, `.${escapeClassName(candidate)}`)

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
  selector = selectorParser((selectors) => {
    return selectors.walkClasses((node) => {
      if (node.raws && node.value.includes(base)) {
        node.raws.value = escapeClassName(unescape(node.raws.value))
      }

      return node
    })
  }).processSync(selector)

  // We can safely replace the escaped base now, since the `base` section is
  // now in a normalized escaped value.
  selector = selector.replace(`.${escapeClassName(base)}`, format)

  // Remove unnecessary pseudo selectors that we used as placeholders
  return selectorParser((selectors) => {
    return selectors.map((selector) => {
      selector.walkPseudos((p) => {
        if (selectorFunctions.has(p.value)) {
          p.replaceWith(p.nodes)
        }

        return p
      })

      return selector
    })
  }).processSync(selector)
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
