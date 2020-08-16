import _ from 'lodash'
import selectorParser from 'postcss-selector-parser'
import postcss from 'postcss'
import substituteTailwindAtRules from '../lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from '../lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from '../lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from '../lib/substituteResponsiveAtRules'
import convertLayerAtRulesToControlComments from '../lib/convertLayerAtRulesToControlComments'
import substituteScreenAtRules from '../lib/substituteScreenAtRules'
import prefixSelector from '../util/prefixSelector'

function hasAtRule(css, atRule) {
  let foundAtRule = false

  css.walkAtRules(atRule, () => {
    foundAtRule = true
    return false
  })

  return foundAtRule
}

const tailwindApplyPlaceholder = selectorParser.attribute({
  attribute: '__TAILWIND-APPLY-PLACEHOLDER__',
})

function generateRulesFromApply({ rule, utilityName: className, classPosition }, replaceWith) {
  const processedSelectors = rule.selectors.map(selector => {
    const processor = selectorParser(selectors => {
      let i = 0
      selectors.walkClasses(c => {
        if (classPosition === i++ && c.value === className) {
          c.replaceWith(tailwindApplyPlaceholder)
        }
      })
    })

    // You could argue we should make this replacement at the AST level, but if we believe
    // the placeholder string is safe from collisions then it is safe to do this is a simple
    // string replacement, and much, much faster.
    const processedSelector = processor
      .processSync(selector)
      .replace('[__TAILWIND-APPLY-PLACEHOLDER__]', replaceWith)

    return processedSelector
  })

  const cloned = rule.clone()
  let current = cloned
  let parent = rule.parent

  while (parent && parent.type !== 'root') {
    const parentClone = parent.clone()
    parentClone.removeAll()
    parentClone.append(current)
    current.parent = parentClone
    current = parentClone
    parent = parent.parent
  }

  cloned.selectors = processedSelectors
  return current
}

function extractUtilityNames(selector) {
  const processor = selectorParser(selectors => {
    let classes = []

    selectors.walkClasses(c => {
      classes.push(c)
    })

    return classes.map(c => c.value)
  })

  return processor.transformSync(selector)
}

function buildUtilityMap(css) {
  let index = 0
  const utilityMap = {}

  css.walkRules(rule => {
    const utilityNames = extractUtilityNames(rule.selector)

    utilityNames.forEach((utilityName, i) => {
      if (utilityMap[utilityName] === undefined) {
        utilityMap[utilityName] = []
      }

      utilityMap[utilityName].push({
        index,
        utilityName,
        classPosition: i,
        get rule() {
          // TODO: #perf every time we "read" this value we will create a copy.
          // Is this an issue?
          return rule.clone({ parent: rule.parent })
        },
      })
      index++
    })
  })

  return utilityMap
}

function mergeAdjacentRules(initialRule, rulesToInsert) {
  let previousRule = initialRule

  rulesToInsert.forEach(toInsert => {
    if (
      toInsert.type === 'rule' &&
      previousRule.type === 'rule' &&
      toInsert.selector === previousRule.selector
    ) {
      previousRule.append(toInsert.nodes)
    } else if (
      toInsert.type === 'atrule' &&
      previousRule.type === 'atrule' &&
      toInsert.params === previousRule.params
    ) {
      const merged = mergeAdjacentRules(
        previousRule.nodes[previousRule.nodes.length - 1],
        toInsert.nodes
      )

      previousRule.append(merged)
    } else {
      previousRule = toInsert
    }

    toInsert.walk(n => {
      if (n.nodes && n.nodes.length === 0) {
        n.remove()
      }
    })
  })

  return rulesToInsert.filter(r => r.nodes.length > 0)
}

function makeExtractUtilityRules(css, config) {
  const utilityMap = buildUtilityMap(css)

  return function extractUtilityRules(utilityNames, rule) {
    const combined = []

    utilityNames.forEach(utilityName => {
      if (utilityMap[utilityName] === undefined) {
        // Look for prefixed utility in case the user has goofed
        const prefixedUtility = prefixSelector(config.prefix, `.${utilityName}`).slice(1)

        if (utilityMap[prefixedUtility] !== undefined) {
          throw rule.error(
            `The \`${utilityName}\` class does not exist, but \`${prefixedUtility}\` does. Did you forget the prefix?`
          )
        }

        throw rule.error(
          `The \`${utilityName}\` class does not exist. If you're sure that \`${utilityName}\` exists, make sure that any \`@import\` statements are being properly processed before Tailwind CSS sees your CSS, as \`@apply\` can only be used for classes in the same CSS tree.`,
          { word: utilityName }
        )
      }

      combined.push(...utilityMap[utilityName])
    })

    return combined.sort((a, b) => a.index - b.index)
  }
}

function processApplyAtRules(css, lookupTree, config) {
  const extractUtilityRules = makeExtractUtilityRules(lookupTree, config)

  do {
    css.walkRules(rule => {
      const applyRules = []

      // Only walk direct children to avoid issues with nesting plugins
      rule.each(child => {
        if (child.type === 'atrule' && child.name === 'apply') {
          applyRules.unshift(child)
        }
      })

      applyRules.forEach(applyRule => {
        const [
          importantEntries,
          applyUtilityNames,
          important = importantEntries.length > 0,
        ] = _.partition(applyRule.params.split(' '), n => n === '!important')

        const currentUtilityNames = extractUtilityNames(rule.selector)

        if (_.intersection(applyUtilityNames, currentUtilityNames).length > 0) {
          const currentUtilityName = _.intersection(applyUtilityNames, currentUtilityNames)[0]
          throw rule.error(
            `You cannot \`@apply\` the \`${currentUtilityName}\` utility here because it creates a circular dependency.`
          )
        }

        // Extract any post-apply declarations and re-insert them after apply rules
        const afterRule = rule.clone({ raws: {} })
        afterRule.nodes = afterRule.nodes.slice(rule.index(applyRule) + 1)
        rule.nodes = rule.nodes.slice(0, rule.index(applyRule) + 1)

        // Sort applys to match CSS source order
        const applys = extractUtilityRules(applyUtilityNames, applyRule)

        // Get new rules with the utility portion of the selector replaced with the new selector
        const rulesToInsert = [
          ...applys.map(applyUtility => {
            return generateRulesFromApply(applyUtility, rule.selector)
          }),
          afterRule,
        ]

        const { nodes } = _.tap(postcss.root({ nodes: rulesToInsert }), root =>
          root.walkDecls(d => (d.important = important))
        )

        const mergedRules = mergeAdjacentRules(rule, nodes)

        applyRule.remove()
        rule.after(mergedRules)
      })

      // If the base rule has nothing in it (all applys were pseudo or responsive variants),
      // remove the rule fuggit.
      if (rule.nodes.length === 0) {
        rule.remove()
      }
    })

    // We already know that we have at least 1 @apply rule. Otherwise this
    // function would not have been called. Therefore we can execute this code
    // at least once. This also means that in the best case scenario we only
    // call this 2 times, instead of 3 times.
    // 1st time -> before we call this function
    // 2nd time -> when we check if we have to do this loop again (because do {} while (check))
    // .. instead of
    // 1st time -> before we call this function
    // 2nd time -> when we check the first time (because while (check) do {})
    // 3rd time -> when we re-check to see if we should do this loop again
  } while (hasAtRule(css, 'apply'))

  return css
}

export default function applyComplexClasses(config, getProcessedPlugins) {
  return function(css) {
    // We can stop already when we don't have any @apply rules. Vue users: you're welcome!
    if (!hasAtRule(css, 'apply')) {
      return css
    }

    // Tree already contains @tailwind rules, don't prepend default Tailwind tree
    if (hasAtRule(css, 'tailwind')) {
      return processApplyAtRules(css, css, config)
    }

    // Tree contains no @tailwind rules, so generate all of Tailwind's styles and
    // prepend them to the user's CSS. Important for <style> blocks in Vue components.
    return postcss([
      substituteTailwindAtRules(config, getProcessedPlugins()),
      evaluateTailwindFunctions(config),
      substituteVariantsAtRules(config, getProcessedPlugins()),
      substituteResponsiveAtRules(config),
      convertLayerAtRulesToControlComments(config),
      substituteScreenAtRules(config),
    ])
      .process(
        `
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        `,
        { from: undefined }
      )
      .then(result => {
        // Prepend Tailwind's generated classes to the tree so they are available for `@apply`
        const lookupTree = _.tap(css.clone(), tree => tree.prepend(result.root))
        return processApplyAtRules(css, lookupTree, config)
      })
  }
}
