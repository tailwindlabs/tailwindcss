import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import parseObjectStyles from '../util/parseObjectStyles'
import isPlainObject from '../util/isPlainObject'
import prefixSelector from '../util/prefixSelector'
import { updateAllClasses } from '../util/pluginUtils'
import log from '../util/log'
import { formatVariantSelector, finalizeSelector } from '../util/formatVariantSelector'
import { asClass } from '../util/nameClass'
import { isValidVariantFormatString, parseVariant } from './setupContextUtils'
import { isParsableNode } from '../util/css-validation'
import { parseCandidate } from './candidate'

let classNameParser = selectorParser((selectors) => {
  return selectors.first.filter(({ type }) => type === 'class').pop().value
})

function getClassNameFromSelector(selector) {
  return classNameParser.transformSync(selector)
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

function applyImportant(matches, parsed) {
  if (matches.length === 0) {
    return matches
  }

  let classCandidate = parsed.withoutVariants

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

  if (variant.type === 'constrained') {
    variant = variant.name
  } else if (variant.type === 'partial' && variant.value !== '') {
    // Find partial arbitrary variants
    args = variant.value
    variant = variant.name
  } else if (variant.type === 'custom' && !context.variantMap.has(variant.raw)) {
    // Register arbitrary variants
    let fn = parseVariant(variant.value)

    if (!isValidVariantFormatString(variant.value)) {
      return []
    }

    let sort = Array.from(context.variantOrder.values()).pop() << 1n
    context.variantMap.set(variant.raw, [[sort, fn]])
    context.variantOrder.set(variant.raw, sort)

    variant = variant.raw
  }

  if (!context.variantMap.has(variant)) {
    return []
  }

  let variantFunctionTuples = context.variantMap.get(variant)
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

function extractArbitraryProperty(parsed, context) {
  return [
    [
      { sort: context.arbitraryPropertiesSort, layer: 'utilities' },
      () => ({
        [asClass(parsed.withoutVariants)]: {
          [parsed.name]: parsed.value,
        },
      }),
    ],
  ]
}

/**
 *
 * @param {import('./candidate').Candidate} parsed
 * @param {any} context
 */
function* resolveMatchedPlugins(parsed, context) {
  if (parsed.type === 'custom') {
    yield [extractArbitraryProperty(parsed, context), 'DEFAULT']
  }

  if (parsed.type !== 'constrained') {
    return
  }

  // TODO: Can this be dropped?
  let candidatePrefix = parsed.negative
    ? parsed.prefix + parsed.withoutVariants.slice(parsed.prefix.length + 1)
    : parsed.withoutVariants

  if (parsed.negative && context.candidateRuleMap.has(candidatePrefix)) {
    yield [context.candidateRuleMap.get(candidatePrefix), '-DEFAULT']
  }

  for (let plugin of parsed.plugins()) {
    let ruleGenerator =
      context.candidateRuleMap.get(parsed.prefix + plugin.plugin) ||
      context.candidateRuleMap.get(plugin.plugin)

    if (ruleGenerator) {
      yield [ruleGenerator, plugin.value, plugin]
    }
  }
}

function* recordCandidates(matches, candidate) {
  for (const match of matches) {
    match[1].raws.tailwind = {
      ...match[1].raws.tailwind,
      classCandidate: candidate.withoutVariants,

      // todo: rename?
      parsedCandidate: candidate,
    }

    yield match
  }
}

function* resolveMatches(candidateRaw, context) {
  for (const candidate of parseCandidate(candidateRaw, context)) {
    yield* resolveMatchesForCandidate(candidate, context)
  }
}

function* resolveMatchesForCandidate(candidate, context) {
  let important = candidate.important
  let variants = candidate.variants

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

  for (let matchedPlugins of resolveMatchedPlugins(candidate, context)) {
    let matches = []
    let typesByMatches = new Map()

    let [plugins, modifier, candidatePlugin] = matchedPlugins
    let isOnlyPlugin = plugins.length === 1

    for (let [sort, plugin] of plugins) {
      let matchesPerPlugin = []

      if (typeof plugin === 'function') {
        for (let ruleSet of [].concat(
          plugin(modifier, { isOnlyPlugin, candidate, candidatePlugin })
        )) {
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

    if (typeof modifier === 'object') {
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
              `  Use \`${candidate.raw.replace('[', `[${type}:`)}\` for \`${rules.trim()}\``
            )
            break
          }
        }

        log.warn([
          `The class \`${candidate.raw}\` is ambiguous and matches multiple utilities.`,
          ...messages,
          `If this is content and not a class, replace it with \`${candidate.raw
            .replace('[', '&lsqb;')
            .replace(']', '&rsqb;')}\` to silence this warning.`,
        ])
        continue
      }

      matches = matches.map((list) => list.filter((match) => isParsableNode(match[1])))
    }

    matches = matches.flat()
    matches = Array.from(recordCandidates(matches, candidate))
    matches = applyPrefix(matches, context)

    if (important) {
      matches = applyImportant(matches, candidate)
    }

    for (let variant of variants) {
      matches = applyVariant(variant, matches, context)
    }

    let foundMatches = false
    for (let match of matches) {
      foundMatches = true

      match[1].raws.tailwind = { ...match[1].raws.tailwind, candidate: candidate.raw }

      // Apply final format selector
      if (match[0].collectedFormats) {
        let finalFormat = formatVariantSelector('&', ...match[0].collectedFormats)
        let container = postcss.root({ nodes: [match[1].clone()] })
        container.walkRules((rule) => {
          if (inKeyframes(rule)) return

          rule.selector = finalizeSelector(finalFormat, {
            selector: rule.selector,
            candidate,
            context,
          })
        })
        match[1] = container.nodes[0]
      }

      yield match
    }

    // We always want to emit matches for `DEFAULT`-ish values
    // so we'll continue matching in that case
    if (
      candidatePlugin &&
      (candidatePlugin.value === 'DEFAULT' || candidatePlugin.value === '-DEFAULT')
    ) {
      continue
    }

    // If we've emitted matches we're done searching
    // This is because the order of matched values is as follows:
    // - Real values from the config
    // - Real values from the config accounting for modifiers
    // - Arbitrary values
    // - Arbitrary values accounting for modifiers
    if (foundMatches) {
      break
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

export { resolveMatches, generateRules }
