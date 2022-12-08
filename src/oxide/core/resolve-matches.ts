import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import type { Node, Container, AtRule } from 'postcss'
import parseObjectStyles from '../../lib/../util/parseObjectStyles'
import isPlainObject from '../../lib/../util/isPlainObject'
import prefixSelector from '../../lib/../util/prefixSelector'
import {
  updateAllClasses,
  filterSelectorsForClass,
  getMatchingTypes,
} from '../../lib/../util/pluginUtils'
import log from '../../lib/../util/log'
import * as sharedState from '../../lib/./sharedState'
import { asClass } from '../../lib/../util/nameClass'
import { normalize } from '../../lib/../util/dataTypes'
import { isValidVariantFormatString, parseVariant } from '../../lib/./setupContextUtils'
import isValidArbitraryValue from '../../lib/../util/isSyntacticallyValidPropertyValue'
import { splitAtTopLevelOnly } from '../../lib/../util/splitAtTopLevelOnly.js'
import { flagEnabled } from '../../lib/../featureFlags'
import { formatVariantSelector } from '../../util/formatVariantSelector'

type Layer = 'base' | 'defaults' | 'components' | 'utilities' | 'variants' | 'user'

interface RuleOffset {
  layer: Layer
  parentLayer: Layer
  arbitrary: bigint
  variants: bigint
  parallelIndex: bigint
  index: bigint
  options: {
    id: number
    sort?: Function
    value: string | null
    modifier: string | null
  }[]
}

type Match = [
  {
    sort: RuleOffset
    layer: Layer
    options: {
      preserveSource: boolean
      respectPrefix: boolean
      respectImportant: boolean
      types: { type: string; preferOnConflict?: boolean }[]
      // collectedFormats?: string[]
    }
    important: boolean
  },
  Node
]

type Context = any

// Generate match permutations for a class candidate, like:
// ['ring-offset-blue', '100']
// ['ring-offset', 'blue-100']
// ['ring', 'offset-blue-100']
// Example with dynamic classes:
// ['grid-cols', '[[linename],1fr,auto]']
// ['grid', 'cols-[[linename],1fr,auto]']
function* candidatePermutations(candidate: string) {
  let lastIndex = Infinity

  while (lastIndex >= 0) {
    let dashIdx: number
    let wasSlash = false

    if (lastIndex === Infinity && candidate.endsWith(']')) {
      let bracketIdx = candidate.indexOf('[')

      // If character before `[` isn't a dash or a slash, this isn't a dynamic class
      // eg. string[]
      if (candidate[bracketIdx - 1] === '-') {
        dashIdx = bracketIdx - 1
      } else if (candidate[bracketIdx - 1] === '/') {
        dashIdx = bracketIdx - 1
        wasSlash = true
      } else {
        dashIdx = -1
      }
    } else if (lastIndex === Infinity && candidate.includes('/')) {
      dashIdx = candidate.lastIndexOf('/')
      wasSlash = true
    } else {
      dashIdx = candidate.lastIndexOf('-', lastIndex)
    }

    if (dashIdx < 0) {
      break
    }

    let prefix = candidate.slice(0, dashIdx)
    let modifier = candidate.slice(wasSlash ? dashIdx : dashIdx + 1)

    lastIndex = dashIdx - 1

    // TODO: This feels a bit hacky
    if (prefix === '' || modifier === '/') {
      continue
    }

    yield [prefix, modifier]
  }
}

function applyPrefix(matches: Match[], context: Context) {
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

function applyImportant(matches: Match[]) {
  if (matches.length === 0) {
    return matches
  }

  let result: Match[] = []

  for (let [meta, rule] of matches) {
    let container = postcss.root({ nodes: [rule.clone()] })

    container.walkDecls((d) => {
      d.important = true
    })

    // BUG WORKAROUND: Wrapping the contents of the atRule in an additional rule using
    // the simple & selector. This allows lightning to properly parse the contents of
    // a @media rule where a declaration has the !important modifier.
    //
    // Expected, but doesn't work:
    // .foo {
    //   @media (min-width: 400px) {
    //     color: red !important;
    //   }
    // }
    //
    // Workaround produces this, which works:
    // .foo {
    //   @media (min-width: 400px) {
    //     & {
    //       color: red !important;
    //     }
    //   }
    // }
    container.walkAtRules((rule) => {
      rule.nodes = [postcss.rule({ selector: '&', nodes: rule.nodes })]
    })

    // TODO: What is this `important` doing?
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

function applyVariant(variant: string, children: Match[], context: any) {
  if (children.length === 0) {
    return children
  }

  let args: {
    modifier?: string | null
    value?: string | null | typeof sharedState.NONE
  } = { modifier: null, value: sharedState.NONE }

  // Retrieve "modifier"
  {
    let match = /(.*)\/(.*)$/g.exec(variant)
    if (match) {
      variant = match[1]
      args.modifier = match[2]

      if (!flagEnabled(context.tailwindConfig, 'generalizedModifiers')) {
        return []
      }
    }
  }

  // Retrieve "arbitrary value"
  if (variant.endsWith(']') && !variant.startsWith('[')) {
    // We either have:
    //   @[200px]
    //   group-[:hover]
    //
    // But we don't want:
    //   @-[200px]        (`-` is incorrect)
    //   group[:hover]    (`-` is missing)
    let match = /(.)(-?)\[(.*)\]/g.exec(variant)
    if (match) {
      let [, char, seperator, value] = match
      // @-[200px] case
      if (char === '@' && seperator === '-') return []
      // group[:hover] case
      if (char !== '@' && seperator === '') return []

      variant = variant.replace(`${seperator}[${value}]`, '')
      args.value = value
    }
  }

  // Register arbitrary variants
  if (isArbitraryValue(variant) && !context.variantMap.has(variant)) {
    let selector = normalize(variant.slice(1, -1))

    if (!isValidVariantFormatString(selector)) {
      return []
    }

    let fn = parseVariant(selector)

    let sort = context.offsets.recordVariant(variant)

    context.variantMap.set(variant, [[sort, fn]])
  }

  if (!context.variantMap.has(variant)) {
    return []
  }

  let variantFunctionTuples = context.variantMap.get(variant).slice()
  let result: [any, Node][] = []

  for (let [meta, rule] of children) {
    // Don't generate variants for user css
    if (meta.layer === 'user') {
      continue
    }

    let container = postcss.root({ nodes: [rule.clone()] })
    let allFormats: string[] = []

    for (let [variantSort, variantFunction, containerFromArray] of variantFunctionTuples) {
      let clone: Container = (containerFromArray ?? container).clone()

      let collectedFormats: string[] = []

      let ruleWithVariant = variantFunction({
        // Public API
        container: clone,

        // Private API for now
        wrap(wrapper: AtRule) {
          collectedFormats.push(`@${wrapper.name} ${wrapper.params}`)
        },
        format(selectorFormat: string) {
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
            context.offsets.applyParallelOffset(variantSort, idx),
            variantFunction,

            // If the clone has been modified we have to pass that back
            // though so each rule can use the modified container
            clone.clone(),
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

      // This tracks the originating layer for the variant
      // For example:
      // .sm:underline {} is a variant of something in the utilities layer
      // .sm:container {} is a variant of the container component
      clone.nodes[0].raws.tailwind = { ...clone.nodes[0].raws.tailwind, parentLayer: meta.layer }

      let localClone = clone.clone()
      allFormats.push(...collectedFormats)
      if (collectedFormats.length <= 0) {
        collectedFormats.push('&')
      }

      for (let format of collectedFormats) {
        localClone.walkRules((rule) => {
          let children = rule.clone().nodes

          let wrapper = (function () {
            /*
             * Wrap in an atRule
             */
            if (format.startsWith('@')) {
              let matches = /@(.*?)( .+|[({].*)/g.exec(format)
              if (matches) {
                let [, name, params] = matches
                return postcss.atRule({
                  name: name.trim(),
                  params: params.trim(),
                  // BUG WORKAROUND: Wrapping the contents of the atRule in an additional rule using
                  // the simple & selector. This allows lightning to properly parse the contents of
                  // a @media rule where a declaration has the !important modifier.
                  //
                  // Expected, but doesn't work:
                  // .foo {
                  //   @media (min-width: 400px) {
                  //     color: red !important;
                  //   }
                  // }
                  //
                  // Workaround produces this, which works:
                  // .foo {
                  //   @media (min-width: 400px) {
                  //     & {
                  //       color: red !important;
                  //     }
                  //   }
                  // }
                  nodes: [postcss.rule({ selector: '&', nodes: children })],
                })
              }
            }

            /*
             * Wrap in a rule with the new selector
             */
            // TODO: Handle the `:merge`
            if (format.includes(':merge')) {
              let [, target, rest] = /\:merge\((.*)\)([^ ]*)/g.exec(format)!
              let found = false
              let childrenContainer = postcss.root({ nodes: children })
              childrenContainer.walkRules((rule) => {
                if (rule.selector.includes(`:merge(${target})`)) {
                  let [, target, rest] = /\:merge\((.*)\)([^ ]*)/g.exec(rule.selector)!
                  rule.selector = format.replace(`:merge(${target})`, `:merge(${target})${rest}`)
                  // rule.selector = rule.selector.replace(
                  //   `:merge(${target})`,
                  //   `:merge(${target})${rest}`
                  // )
                  found = true
                }
              })
              // return postcss.root({ nodes: children })
              return postcss.rule({
                selector: found ? '&' : format,
                nodes: childrenContainer.nodes,
              })
            }

            return postcss.rule({ selector: format, nodes: children })
          })()

          rule.replaceWith(rule.clone({ nodes: [wrapper] }))
          return false
        })
      }

      // console.log(localClone.toString())

      result.push([
        {
          ...meta,
          sort: context.offsets.applyVariantOffset(
            meta.sort,
            variantSort,
            Object.assign(args, context.variantOptions.get(variant))
          ),
          // collectedFormats: (meta.collectedFormats ?? []).concat(collectedFormats),
          isArbitraryVariant: isArbitraryValue(variant),
        },
        localClone.nodes[0],
      ])
    }
  }

  return result
}

function parseRules(rule: Node, cache, options = {}) {
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

function isParsableNode(node: Node) {
  let isParsable = true
  let container = postcss.root({ nodes: [node.clone()] })

  container.walkDecls((decl) => {
    if (!isParsableCssValue(decl.prop, decl.value)) {
      isParsable = false
      return false
    }
  })

  return isParsable
}

function isParsableCssValue(property: string, value: string) {
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

function extractArbitraryProperty(classCandidate: string, context: Context) {
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

  let sort = context.offsets.arbitraryProperty()

  return [
    [
      { sort, layer: 'utilities' },
      () => ({
        [asClass(classCandidate)]: {
          [property]: normalized,
        },
      }),
    ],
  ]
}

function* resolveMatchedPlugins(classCandidate: string, context: Context) {
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

function splitWithSeparator(input: string, separator: string): string[] {
  if (input === sharedState.NOT_ON_DEMAND) {
    return [sharedState.NOT_ON_DEMAND as string]
  }

  return splitAtTopLevelOnly(input, separator)
}

function* recordCandidates(matches: Match[], classCandidate: string) {
  for (let match of matches) {
    match[1].raws.tailwind = {
      ...match[1].raws.tailwind,
      classCandidate,
      preserveSource: match[0].options?.preserveSource ?? false,
    }

    yield match
  }
}

export function* resolveMatches(candidate: string, context: Context, original = candidate) {
  let separator = context.tailwindConfig.separator
  let variants = splitWithSeparator(candidate, separator)
  let classCandidate = variants.pop()!
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
    let matches: Match[][] = []
    let typesByMatches = new Map()

    let [plugins, modifier] = matchedPlugins
    let isOnlyPlugin = plugins.length === 1

    for (let [sort, plugin] of plugins) {
      let matchesPerPlugin: Match[] = []

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
        let matchingTypes = Array.from(
          getMatchingTypes(
            sort.options?.types ?? [],
            modifier,
            sort.options ?? {},
            context.tailwindConfig
          )
        ).map(([_, type]) => type)

        if (matchingTypes.length > 0) {
          typesByMatches.set(matchesPerPlugin, matchingTypes)
        }

        matches.push(matchesPerPlugin)
      }
    }

    if (isArbitraryValue(modifier)) {
      if (matches.length > 1) {
        // Partition plugins in 2 categories so that we can start searching in the plugins that
        // don't have `any` as a type first.
        let [withAny, withoutAny] = matches.reduce(
          (group, plugin) => {
            let hasAnyType = plugin.some(([{ options }]) =>
              options.types.some(({ type }) => type === 'any')
            )

            if (hasAnyType) {
              group[0].push(plugin)
            } else {
              group[1].push(plugin)
            }
            return group
          },
          [[] as Match[][], [] as Match[][]]
        )

        function findFallback(matches: Match[]) {
          // If only a single plugin matches, let's take that one
          if (matches.length === 1) {
            return matches[0]
          }

          // Otherwise, find the plugin that creates a valid rule given the arbitrary value, and
          // also has the correct type which preferOnConflicts the plugin in case of clashes.
          return matches.find((rules) => {
            let matchingTypes = typesByMatches.get(rules)
            return rules.some(([{ options }, rule]) => {
              if (!isParsableNode(rule)) {
                return false
              }

              return options.types.some(
                ({ type, preferOnConflict }) => matchingTypes.includes(type) && preferOnConflict
              )
            })
          })
        }

        // Try to find a fallback plugin, because we already know that multiple plugins matched for
        // the given arbitrary value.
        let fallback = findFallback(withoutAny) ?? findFallback(withAny)
        if (fallback) {
          matches = [fallback]
        }

        // We couldn't find a fallback plugin which means that there are now multiple plugins that
        // generated css for the current candidate. This means that the result is ambiguous and this
        // should not happen. We won't generate anything right now, so let's report this to the user
        // by logging some options about what they can do.
        else {
          let typesPerPlugin = matches.map(
            (match) => new Set([...(typesByMatches.get(match) ?? [])])
          )

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

          let messages: string[] = []

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
      }

      matches = matches.map((list) => list.filter((match) => isParsableNode(match[1])))
    }

    let flattenedMatches = matches.flat()
    flattenedMatches = Array.from(recordCandidates(flattenedMatches, classCandidate))
    flattenedMatches = applyPrefix(flattenedMatches, context)
    flattenedMatches = applyNewSelector(flattenedMatches, { from: classCandidate, to: candidate })

    if (important) {
      flattenedMatches = applyImportant(flattenedMatches)
    }

    for (let variant of variants) {
      flattenedMatches = applyVariant(variant, flattenedMatches, context)
    }

    yield* flattenedMatches
  }
}

function applyNewSelector(matches: Match[], info: { from: string; to: string }) {
  if (typeof info.from !== 'string' && typeof info.to !== 'string') {
    return matches
  }

  if (info.from === info.to) {
    return matches
  }

  for (let match of matches) {
    let container = postcss.root({ nodes: [match[1].clone()] })
    container.walkRules((node) => {
      let ast = selectorParser().astSync(node.selector)
      ast.walkClasses((node) => {
        if (node.value === info.from) {
          node.value = info.to
        }
      })
      node.selector = ast.toString()
      return false
    })
    match[1] = container.nodes[0]
  }

  return matches
}

function isArbitraryValue(input: string) {
  return input.startsWith('[') && input.endsWith(']')
}
