const postcss = require('postcss')
const parseObjectStyles = require('../../lib/util/parseObjectStyles').default
const { isPlainObject } = require('./utils')
const selectorParser = require('postcss-selector-parser')
const prefixSelector = require('../../lib/util/prefixSelector').default
const { updateAllClasses } = require('../pluginUtils')

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
function* candidatePermutations(candidate, lastIndex = Infinity) {
  if (lastIndex < 0) {
    return
  }

  let dashIdx

  if (lastIndex === Infinity && candidate.endsWith(']')) {
    let bracketIdx = candidate.lastIndexOf('[')

    // If character before `[` isn't a dash, this isn't a dynamic class
    // eg. string[]
    dashIdx = candidate[bracketIdx - 1] === '-' ? bracketIdx - 1 : -1
  } else {
    dashIdx = candidate.lastIndexOf('-', lastIndex)
  }

  if (dashIdx < 0) {
    return
  }

  let prefix = candidate.slice(0, dashIdx)
  let modifier = candidate.slice(dashIdx + 1)

  yield [prefix, modifier]

  yield* candidatePermutations(candidate, dashIdx - 1)
}

function applyPrefix(matches, context) {
  if (matches.length === 0 || context.tailwindConfig.prefix === '') {
    return matches
  }

  for (let match of matches) {
    let [meta] = match
    if (meta.options.respectPrefix) {
      let container = postcss.root({ nodes: [match[1]] })
      container.walkRules((r) => {
        r.selector = prefixSelector(context.tailwindConfig.prefix, r.selector)
      })
      match[1] = container.nodes[0]
    }
  }

  return matches
}

function applyImportant(matches) {
  if (matches.length === 0) {
    return matches
  }
  let result = []

  for (let [meta, rule] of matches) {
    let container = postcss.root({ nodes: [rule] })
    container.walkRules((r) => {
      r.selector = updateAllClasses(r.selector, (className) => {
        return `!${className}`
      })
      r.walkDecls((d) => (d.important = true))
    })
    result.push([meta, container.nodes[0]])
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

  if (context.variantMap.has(variant)) {
    let [variantSort, applyThisVariant] = context.variantMap.get(variant)
    let result = []

    for (let [{ sort, layer, options }, rule] of matches) {
      if (options.respectVariants === false) {
        result.push([{ sort, layer, options }, rule])
        continue
      }

      let container = postcss.root()
      container.append(rule.clone())

      function modifySelectors(modifierFunction) {
        container.each((rule) => {
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
        return container
      }

      let ruleWithVariant = applyThisVariant({
        container,
        separator: context.tailwindConfig.separator,
        modifySelectors,
      })

      if (ruleWithVariant === null) {
        continue
      }

      let withOffset = [{ sort: variantSort | sort, layer, options }, container.nodes[0]]
      result.push(withOffset)
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

function* resolveMatchedPlugins(classCandidate, context) {
  if (context.candidateRuleMap.has(classCandidate)) {
    yield [context.candidateRuleMap.get(classCandidate), 'DEFAULT']
  }

  let candidatePrefix = classCandidate
  let negative = false

  const twConfigPrefix = context.tailwindConfig.prefix || ''
  const twConfigPrefixLen = twConfigPrefix.length
  if (candidatePrefix[twConfigPrefixLen] === '-') {
    negative = true
    candidatePrefix = twConfigPrefix + candidatePrefix.slice(twConfigPrefixLen + 1)
  }

  for (let [prefix, modifier] of candidatePermutations(candidatePrefix)) {
    if (context.candidateRuleMap.has(prefix)) {
      yield [context.candidateRuleMap.get(prefix), negative ? `-${modifier}` : modifier]
      return
    }
  }
}

function* resolveMatches(candidate, context) {
  let separator = context.tailwindConfig.separator
  let [classCandidate, ...variants] = candidate.split(separator).reverse()
  let important = false

  if (classCandidate.startsWith('!')) {
    important = true
    classCandidate = classCandidate.slice(1)
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
    let pluginHelpers = {
      candidate: classCandidate,
      theme: context.tailwindConfig.theme,
    }

    let matches = []
    let [plugins, modifier] = matchedPlugins

    for (let [sort, plugin] of plugins) {
      if (typeof plugin === 'function') {
        for (let ruleSet of [].concat(plugin(modifier, pluginHelpers))) {
          let [rules, options] = parseRules(ruleSet, context.postCssNodeCache)
          for (let rule of rules) {
            matches.push([{ ...sort, options: { ...sort.options, ...options } }, rule])
          }
        }
      }
      // Only process static plugins on exact matches
      else if (modifier === 'DEFAULT') {
        let ruleSet = plugin
        let [rules, options] = parseRules(ruleSet, context.postCssNodeCache)
        for (let rule of rules) {
          matches.push([{ ...sort, options: { ...sort.options, ...options } }, rule])
        }
      }
    }

    matches = applyPrefix(matches, context)

    if (important) {
      matches = applyImportant(matches, context)
    }

    for (let variant of variants) {
      matches = applyVariant(variant, matches, context)
    }

    for (let match of matches) {
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

  return allRules.flat(1).map(([{ sort, layer, options }, rule]) => {
    if (options.respectImportant) {
      if (context.tailwindConfig.important === true) {
        rule.walkDecls((d) => {
          if (d.parent.type === 'rule' && !inKeyframes(d.parent)) {
            d.important = true
          }
        })
      } else if (typeof context.tailwindConfig.important === 'string') {
        let container = postcss.root({ nodes: [rule] })
        container.walkRules((r) => {
          if (inKeyframes(r)) {
            return
          }

          r.selectors = r.selectors.map((selector) => {
            return `${context.tailwindConfig.important} ${selector}`
          })
        })
        rule = container.nodes[0]
      }
    }
    return [sort | context.layerOrder[layer], rule]
  })
}

module.exports = {
  resolveMatches,
  generateRules,
}
