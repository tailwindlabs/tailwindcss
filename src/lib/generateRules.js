import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import parseObjectStyles from '../util/parseObjectStyles'
import isPlainObject from '../util/isPlainObject'
import prefixSelector from '../util/prefixSelector'
import { updateAllClasses } from '../util/pluginUtils'
import log from '../util/log'
import * as sharedState from './sharedState'
import { formatVariantSelector, finalizeSelector } from '../util/formatVariantSelector'
import { asClass } from '../util/nameClass'
import { normalize } from '../util/dataTypes'
import { isValidVariantFormatString, parseVariant } from './setupContextUtils'
import isValidArbitraryValue from '../util/isValidArbitraryValue'
import { splitAtTopLevelOnly } from '../util/splitAtTopLevelOnly.js'
import { flagEnabled } from '../featureFlags'

let classNameParser = selectorParser((selectors) => {
  return selectors.first.filter(({ type }) => type === 'class').pop().value
})

function getClassNameFromSelector(selector) {
  return classNameParser.transformSync(selector)
}

// Generate match permutations for a class candidate, like:
// ['ring-offset-blue', '100']
// ['ring-offset', 'blue-100']
// ['ring', 'offset-blue-100']
// Example with dynamic classes:
// ['grid-cols', '[[linename],1fr,auto]']
// ['grid', 'cols-[[linename],1fr,auto]']
function* candidatePermutations(candidate) {
  let lastIndex = Infinity

  while (lastIndex >= 0) {
    let dashIdx

    if (lastIndex === Infinity && candidate.endsWith(']')) {
      let bracketIdx = candidate.indexOf('[')

      // If character before `[` isn't a dash or a slash, this isn't a dynamic class
      // eg. string[]
      dashIdx = ['-', '/'].includes(candidate[bracketIdx - 1]) ? bracketIdx - 1 : -1
    } else {
      dashIdx = candidate.lastIndexOf('-', lastIndex)
    }

    if (dashIdx < 0) {
      break
    }

    let prefix = candidate.slice(0, dashIdx)
    let modifier = candidate.slice(dashIdx + 1)

    yield [prefix, modifier]

    lastIndex = dashIdx - 1
  }
}

function applyPrefix(matches, context) {
  if (matches.length === 0 || context.tailwindConfig.prefix === '') {
    return matches
  }

  for (let match of matches) {
    let [meta] = match
    if (meta.options.respectPrefix) {
      let container = postcss.root({ nodes: [match[1].clone()] })
      let classCandidate = match[1].raws.tailwind.classCandidate

      container.walkRules((r) => {
        // If this is a negative utility with a dash *before* the prefix we
        // have to ensure that the generated selector matches the candidate

        // Not doing this will cause `-tw-top-1` to generate the class `.tw--top-1`
        // The disconnect between candidate <-> class can cause @apply to hard crash.
        let shouldPrependNegative = classCandidate.startsWith('-')

        r.selector = prefixSelector(
          context.tailwindConfig.prefix,
          r.selector,
          shouldPrependNegative
        )
      })

      match[1] = container.nodes[0]
    }
  }

  return matches
}

function applyImportant(matches, classCandidate) {
  if (matches.length === 0) {
    return matches
  }
  let result = []

  for (let [meta, rule] of matches) {
    let container = postcss.root({ nodes: [rule.clone()] })
    container.walkRules((r) => {
      r.selector = updateAllClasses(r.selector, (className) => {
        if (className === classCandidate) {
          return `!${className}`
        }
        return className
      })
      r.walkDecls((d) => (d.important = true))
    })
    result.push([{ ...meta, important: true }, container.nodes[0]])
  }

  return result
}

// Takes a list of rule tuples and applies a variant like `hover`, sm`,
// whatever to it. We used to do some extra caching here to avoid generating
// a variant of the same rule more than once, but this was never hit because
// we cache at the entire selector level further up the tree.
//
// Technically you can get a cache hit if you have `hover:focus:text-center`
// and `focus:hover:text-center` in the same project, but it doesn't feel
// worth the complexity for that case.

function applyVariant(variant, matches, context) {
  if (matches.length === 0) {
    return matches
  }

  let args

  // Find partial arbitrary variants
  if (variant.endsWith(']') && !variant.startsWith('[')) {
    args = variant.slice(variant.lastIndexOf('[') + 1, -1)
    variant = variant.slice(0, variant.indexOf(args) - 1 /* - */ - 1 /* [ */)
  }

  // Register arbitrary variants
  if (isArbitraryValue(variant) && !context.variantMap.has(variant)) {
    let selector = normalize(variant.slice(1, -1))

    if (!isValidVariantFormatString(selector)) {
      return []
    }

    let fn = parseVariant(selector)

    let sort = Array.from(context.variantOrder.values()).pop() << 1n
    context.variantMap.set(variant, [[sort, fn]])
    context.variantOrder.set(variant, sort)
  }

  if (context.variantMap.has(variant)) {
    let variantFunctionTuples = context.variantMap.get(variant).slice()
    let result = []

    for (let [meta, rule] of matches) {
      // Don't generate variants for user css
      if (meta.layer === 'user') {
        continue
      }

      let container = postcss.root({ nodes: [rule.clone()] })

      for (let [variantSort, variantFunction] of variantFunctionTuples) {
        let clone = container.clone()
        let collectedFormats = []

        let originals = new Map()

        function prepareBackup() {
          if (originals.size > 0) return // Already prepared, chicken out
          clone.walkRules((rule) => originals.set(rule, rule.selector))
        }

        function modifySelectors(modifierFunction) {
          prepareBackup()
          clone.each((rule) => {
            if (rule.type !== 'rule') {
              return
            }

            rule.selectors = rule.selectors.map((selector) => {
              return modifierFunction({
                get className() {
                  return getClassNameFromSelector(selector)
                },
                selector,
              })
            })
          })

          return clone
        }

        let ruleWithVariant = variantFunction({
          // Public API
          get container() {
            prepareBackup()
            return clone
          },
          separator: context.tailwindConfig.separator,
          modifySelectors,

          // Private API for now
          wrap(wrapper) {
            let nodes = clone.nodes
            clone.removeAll()
            wrapper.append(nodes)
            clone.append(wrapper)
          },
          format(selectorFormat) {
            collectedFormats.push(selectorFormat)
          },
          args,
        })

        // It can happen that a list of format strings is returned from within the function. In that
        // case, we have to process them as well. We can use the existing `variantSort`.
        if (Array.isArray(ruleWithVariant)) {
          for (let [idx, variantFunction] of ruleWithVariant.entries()) {
            // This is a little bit scary since we are pushing to an array of items that we are
            // currently looping over. However, you can also think of it like a processing queue
            // where you keep handling jobs until everything is done and each job can queue more
            // jobs if needed.
            variantFunctionTuples.push([
              // TODO: This could have potential bugs if we shift the sort order from variant A far
              // enough into the sort space of variant B. The chances are low, but if this happens
              // then this might be the place too look at. One potential solution to this problem is
              // reserving additional X places for these 'unknown' variants in between.
              variantSort | BigInt(idx << ruleWithVariant.length),
              variantFunction,
            ])
          }
          continue
        }

        if (typeof ruleWithVariant === 'string') {
          collectedFormats.push(ruleWithVariant)
        }

        if (ruleWithVariant === null) {
          continue
        }

        // We filled the `originals`, therefore we assume that somebody touched
        // `container` or `modifySelectors`. Let's see if they did, so that we
        // can restore the selectors, and collect the format strings.
        if (originals.size > 0) {
          clone.walkRules((rule) => {
            if (!originals.has(rule)) return
            let before = originals.get(rule)
            if (before === rule.selector) return // No mutation happened

            let modified = rule.selector

            // Rebuild the base selector, this is what plugin authors would do
            // as well. E.g.: `${variant}${separator}${className}`.
            // However, plugin authors probably also prepend or append certain
            // classes, pseudos, ids, ...
            let rebuiltBase = selectorParser((selectors) => {
              selectors.walkClasses((classNode) => {
                classNode.value = `${variant}${context.tailwindConfig.separator}${classNode.value}`
              })
            }).processSync(before)

            // Now that we know the original selector, the new selector, and
            // the rebuild part in between, we can replace the part that plugin
            // authors need to rebuild with `&`, and eventually store it in the
            // collectedFormats. Similar to what `format('...')` would do.
            //
            // E.g.:
            //                   variant: foo
            //                  selector: .markdown > p
            //      modified (by plugin): .foo .foo\\:markdown > p
            //    rebuiltBase (internal): .foo\\:markdown > p
            //                    format: .foo &
            collectedFormats.push(modified.replace(rebuiltBase, '&'))
            rule.selector = before
          })
        }

        // This tracks the originating layer for the variant
        // For example:
        // .sm:underline {} is a variant of something in the utilities layer
        // .sm:container {} is a variant of the container component
        clone.nodes[0].raws.tailwind = { ...clone.nodes[0].raws.tailwind, parentLayer: meta.layer }

        let withOffset = [
          {
            ...meta,
            sort: variantSort | meta.sort,
            collectedFormats: (meta.collectedFormats ?? []).concat(collectedFormats),
          },
          clone.nodes[0],
        ]
        result.push(withOffset)
      }
    }

    return result
  }

  return []
}

function parseRules(rule, cache, options = {}) {
  // PostCSS node
  if (!isPlainObject(rule) && !Array.isArray(rule)) {
    return [[rule], options]
  }

  // Tuple
  if (Array.isArray(rule)) {
    return parseRules(rule[0], cache, rule[1])
  }

  // Simple object
  if (!cache.has(rule)) {
    cache.set(rule, parseObjectStyles(rule))
  }

  return [cache.get(rule), options]
}

const IS_VALID_PROPERTY_NAME = /^[a-z_-]/

function isValidPropName(name) {
  return IS_VALID_PROPERTY_NAME.test(name)
}

/**
 * @param {string} declaration
 * @returns {boolean}
 */
function looksLikeUri(declaration) {
  // Quick bailout for obvious non-urls
  // This doesn't support schemes that don't use a leading // but that's unlikely to be a problem
  if (!declaration.includes('://')) {
    return false
  }

  try {
    const url = new URL(declaration)
    return url.scheme !== '' && url.host !== ''
  } catch (err) {
    // Definitely not a valid url
    return false
  }
}

function isParsableNode(node) {
  let isParsable = true

  node.walkDecls((decl) => {
    if (!isParsableCssValue(decl.name, decl.value)) {
      isParsable = false
      return false
    }
  })

  return isParsable
}

function isParsableCssValue(property, value) {
  // We don't want to to treat [https://example.com] as a custom property
  // Even though, according to the CSS grammar, it's a totally valid CSS declaration
  // So we short-circuit here by checking if the custom property looks like a url
  if (looksLikeUri(`${property}:${value}`)) {
    return false
  }

  try {
    postcss.parse(`a{${property}:${value}}`).toResult()
    return true
  } catch (err) {
    return false
  }
}

function extractArbitraryProperty(classCandidate, context) {
  let [, property, value] = classCandidate.match(/^\[([a-zA-Z0-9-_]+):(\S+)\]$/) ?? []

  if (value === undefined) {
    return null
  }

  if (!isValidPropName(property)) {
    return null
  }

  if (!isValidArbitraryValue(value)) {
    return null
  }

  let normalized = normalize(value)

  if (!isParsableCssValue(property, normalized)) {
    return null
  }

  return [
    [
      { sort: context.arbitraryPropertiesSort, layer: 'utilities' },
      () => ({
        [asClass(classCandidate)]: {
          [property]: normalized,
        },
      }),
    ],
  ]
}

function* resolveMatchedPlugins(classCandidate, context) {
  if (context.candidateRuleMap.has(classCandidate)) {
    yield [context.candidateRuleMap.get(classCandidate), 'DEFAULT']
  }

  yield* (function* (arbitraryPropertyRule) {
    if (arbitraryPropertyRule !== null) {
      yield [arbitraryPropertyRule, 'DEFAULT']
    }
  })(extractArbitraryProperty(classCandidate, context))

  let candidatePrefix = classCandidate
  let negative = false

  const twConfigPrefix = context.tailwindConfig.prefix

  const twConfigPrefixLen = twConfigPrefix.length

  const hasMatchingPrefix =
    candidatePrefix.startsWith(twConfigPrefix) || candidatePrefix.startsWith(`-${twConfigPrefix}`)

  if (candidatePrefix[twConfigPrefixLen] === '-' && hasMatchingPrefix) {
    negative = true
    candidatePrefix = twConfigPrefix + candidatePrefix.slice(twConfigPrefixLen + 1)
  }

  if (negative && context.candidateRuleMap.has(candidatePrefix)) {
    yield [context.candidateRuleMap.get(candidatePrefix), '-DEFAULT']
  }

  for (let [prefix, modifier] of candidatePermutations(candidatePrefix)) {
    if (context.candidateRuleMap.has(prefix)) {
      yield [context.candidateRuleMap.get(prefix), negative ? `-${modifier}` : modifier]
    }
  }
}

function splitWithSeparator(input, separator) {
  if (input === sharedState.NOT_ON_DEMAND) {
    return [sharedState.NOT_ON_DEMAND]
  }

  return Array.from(splitAtTopLevelOnly(input, separator))
}

function* recordCandidates(matches, classCandidate) {
  for (const match of matches) {
    match[1].raws.tailwind = { ...match[1].raws.tailwind, classCandidate }

    yield match
  }
}

function* resolveMatches(candidate, context, original = candidate) {
  let separator = context.tailwindConfig.separator
  let [classCandidate, ...variants] = splitWithSeparator(candidate, separator).reverse()
  let important = false

  if (classCandidate.startsWith('!')) {
    important = true
    classCandidate = classCandidate.slice(1)
  }

  if (flagEnabled(context.tailwindConfig, 'variantGrouping')) {
    if (classCandidate.startsWith('(') && classCandidate.endsWith(')')) {
      let base = variants.slice().reverse().join(separator)
      for (let part of splitAtTopLevelOnly(classCandidate.slice(1, -1), ',')) {
        yield* resolveMatches(base + separator + part, context, original)
      }
    }
  }

  // TODO: Reintroduce this in ways that doesn't break on false positives
  // function sortAgainst(toSort, against) {
  //   return toSort.slice().sort((a, z) => {
  //     return bigSign(against.get(a)[0] - against.get(z)[0])
  //   })
  // }
  // let sorted = sortAgainst(variants, context.variantMap)
  // if (sorted.toString() !== variants.toString()) {
  //   let corrected = sorted.reverse().concat(classCandidate).join(':')
  //   throw new Error(`Class ${candidate} should be written as ${corrected}`)
  // }

  for (let matchedPlugins of resolveMatchedPlugins(classCandidate, context)) {
    let matches = []
    let typesByMatches = new Map()

    let [plugins, modifier] = matchedPlugins
    let isOnlyPlugin = plugins.length === 1

    for (let [sort, plugin] of plugins) {
      let matchesPerPlugin = []

      if (typeof plugin === 'function') {
        for (let ruleSet of [].concat(plugin(modifier, { isOnlyPlugin }))) {
          let [rules, options] = parseRules(ruleSet, context.postCssNodeCache)
          for (let rule of rules) {
            matchesPerPlugin.push([{ ...sort, options: { ...sort.options, ...options } }, rule])
          }
        }
      }
      // Only process static plugins on exact matches
      else if (modifier === 'DEFAULT' || modifier === '-DEFAULT') {
        let ruleSet = plugin
        let [rules, options] = parseRules(ruleSet, context.postCssNodeCache)
        for (let rule of rules) {
          matchesPerPlugin.push([{ ...sort, options: { ...sort.options, ...options } }, rule])
        }
      }

      if (matchesPerPlugin.length > 0) {
        typesByMatches.set(matchesPerPlugin, sort.options?.type)
        matches.push(matchesPerPlugin)
      }
    }

    if (isArbitraryValue(modifier)) {
      // When generated arbitrary values are ambiguous, we can't know
      // which to pick so don't generate any utilities for them
      if (matches.length > 1) {
        let typesPerPlugin = matches.map((match) => new Set([...(typesByMatches.get(match) ?? [])]))

        // Remove duplicates, so that we can detect proper unique types for each plugin.
        for (let pluginTypes of typesPerPlugin) {
          for (let type of pluginTypes) {
            let removeFromOwnGroup = false

            for (let otherGroup of typesPerPlugin) {
              if (pluginTypes === otherGroup) continue

              if (otherGroup.has(type)) {
                otherGroup.delete(type)
                removeFromOwnGroup = true
              }
            }

            if (removeFromOwnGroup) pluginTypes.delete(type)
          }
        }

        let messages = []

        for (let [idx, group] of typesPerPlugin.entries()) {
          for (let type of group) {
            let rules = matches[idx]
              .map(([, rule]) => rule)
              .flat()
              .map((rule) =>
                rule
                  .toString()
                  .split('\n')
                  .slice(1, -1) // Remove selector and closing '}'
                  .map((line) => line.trim())
                  .map((x) => `      ${x}`) // Re-indent
                  .join('\n')
              )
              .join('\n\n')

            messages.push(
              `  Use \`${candidate.replace('[', `[${type}:`)}\` for \`${rules.trim()}\``
            )
            break
          }
        }

        log.warn([
          `The class \`${candidate}\` is ambiguous and matches multiple utilities.`,
          ...messages,
          `If this is content and not a class, replace it with \`${candidate
            .replace('[', '&lsqb;')
            .replace(']', '&rsqb;')}\` to silence this warning.`,
        ])
        continue
      }

      matches = matches.map((list) => list.filter((match) => isParsableNode(match[1])))
    }

    matches = matches.flat()
    matches = Array.from(recordCandidates(matches, classCandidate))
    matches = applyPrefix(matches, context)

    if (important) {
      matches = applyImportant(matches, classCandidate)
    }

    for (let variant of variants) {
      matches = applyVariant(variant, matches, context)
    }

    for (let match of matches) {
      match[1].raws.tailwind = { ...match[1].raws.tailwind, candidate }

      // Apply final format selector
      if (match[0].collectedFormats) {
        let finalFormat = formatVariantSelector('&', ...match[0].collectedFormats)
        let container = postcss.root({ nodes: [match[1].clone()] })
        container.walkRules((rule) => {
          if (inKeyframes(rule)) return

          rule.selector = finalizeSelector(finalFormat, {
            selector: rule.selector,
            candidate: original,
            base: candidate
              .split(new RegExp(`\\${context?.tailwindConfig?.separator ?? ':'}(?![^[]*\\])`))
              .pop(),

            context,
          })
        })
        match[1] = container.nodes[0]
      }

      yield match
    }
  }
}

function inKeyframes(rule) {
  return rule.parent && rule.parent.type === 'atrule' && rule.parent.name === 'keyframes'
}

function generateRules(candidates, context) {
  let allRules = []

  for (let candidate of candidates) {
    if (context.notClassCache.has(candidate)) {
      continue
    }

    if (context.classCache.has(candidate)) {
      allRules.push(context.classCache.get(candidate))
      continue
    }

    let matches = Array.from(resolveMatches(candidate, context))

    if (matches.length === 0) {
      context.notClassCache.add(candidate)
      continue
    }

    context.classCache.set(candidate, matches)
    allRules.push(matches)
  }

  // Strategy based on `tailwindConfig.important`
  let strategy = ((important) => {
    if (important === true) {
      return (rule) => {
        rule.walkDecls((d) => {
          if (d.parent.type === 'rule' && !inKeyframes(d.parent)) {
            d.important = true
          }
        })
      }
    }

    if (typeof important === 'string') {
      return (rule) => {
        rule.selectors = rule.selectors.map((selector) => {
          return `${important} ${selector}`
        })
      }
    }
  })(context.tailwindConfig.important)

  return allRules.flat(1).map(([{ sort, layer, options }, rule]) => {
    if (options.respectImportant) {
      if (strategy) {
        let container = postcss.root({ nodes: [rule.clone()] })
        container.walkRules((r) => {
          if (inKeyframes(r)) {
            return
          }

          strategy(r)
        })
        rule = container.nodes[0]
      }
    }

    return [sort | context.layerOrder[layer], rule]
  })
}

function isArbitraryValue(input) {
  return input.startsWith('[') && input.endsWith(']')
}

export { resolveMatches, generateRules }
