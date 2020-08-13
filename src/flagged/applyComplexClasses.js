import _ from 'lodash'
import selectorParser from 'postcss-selector-parser'

function hasInject(css) {
  let foundInject = false

  css.walkAtRules('apply', () => {
    foundInject = true
    return false
  })

  return foundInject
}
function applyUtility(rule, className, replaceWith) {
  const processedSelectors = rule.selectors.map(selector => {
    const processor = selectorParser(selectors => {
      selectors.walkClasses(c => {
        if (c.value === className) {
          c.replaceWith(selectorParser.attribute({ attribute: '__TAILWIND-APPLY-PLACEHOLDER__' }))
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

    utilityNames.forEach(utilityName => {
      if (utilityMap[utilityName] === undefined) {
        utilityMap[utilityName] = []
      }

      utilityMap[utilityName].push({
        index,
        utilityName,
        rule: rule.clone({ parent: rule.parent }),
        containsApply: hasInject(rule),
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

function makeExtractUtilityRules(css) {
  const utilityMap = buildUtilityMap(css)
  const orderUtilityMap = Object.fromEntries(
    Object.entries(utilityMap).flatMap(([_utilityName, utilities]) => {
      return utilities.map(utility => {
        return [utility.index, utility]
      })
    })
  )
  return function(utilityNames, rule) {
    return utilityNames
      .flatMap(utilityName => {
        if (utilityMap[utilityName] === undefined) {
          throw rule.error(
            `The \`${utilityName}\` utility does not exist. If you're sure that \`${utilityName}\` exists, make sure that any \`@import\` statements are being properly processed before Tailwind CSS sees your CSS, as \`@apply\` can only be used for classes in the same CSS tree.`,
            { word: utilityName }
          )
        }
        return utilityMap[utilityName].map(({ index }) => index)
      })
      .sort((a, b) => a - b)
      .map(i => orderUtilityMap[i])
  }
}

export default function applyComplexClasses(css) {
  const extractUtilityRules = makeExtractUtilityRules(css)

  while (hasInject(css)) {
    css.walkRules(rule => {
      const injectRules = []

      // Only walk direct children to avoid issues with nesting plugins
      rule.each(child => {
        if (child.type === 'atrule' && child.name === 'apply') {
          injectRules.unshift(child)
        }
      })

      injectRules.forEach(inject => {
        const injectUtilityNames = inject.params.split(' ')
        const currentUtilityNames = extractUtilityNames(rule.selector)

        if (_.intersection(injectUtilityNames, currentUtilityNames).length > 0) {
          const currentUtilityName = _.intersection(injectUtilityNames, currentUtilityNames)[0]
          throw rule.error(
            `You cannot \`@apply\` the \`${currentUtilityName}\` utility here because it creates a circular dependency.`
          )
        }

        // Extract any post-inject declarations and re-insert them after inject rules
        const afterRule = rule.clone({ raws: {} })
        afterRule.nodes = afterRule.nodes.slice(rule.index(inject) + 1)
        rule.nodes = rule.nodes.slice(0, rule.index(inject) + 1)

        // Sort injects to match CSS source order
        const injects = extractUtilityRules(injectUtilityNames, inject)

        // Get new rules with the utility portion of the selector replaced with the new selector
        const rulesToInsert = [
          ...injects.map(injectUtility => {
            return applyUtility(injectUtility.rule, injectUtility.utilityName, rule.selector)
          }),
          afterRule,
        ]

        const mergedRules = mergeAdjacentRules(rule, rulesToInsert)

        inject.remove()
        rule.after(mergedRules)
      })

      // If the base rule has nothing in it (all injects were pseudo or responsive variants),
      // remove the rule fuggit.
      if (rule.nodes.length === 0) {
        rule.remove()
      }
    })
  }

  return css
}
