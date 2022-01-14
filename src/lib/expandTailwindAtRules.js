import LRU from 'quick-lru'
import * as sharedState from './sharedState'
import { generateRules } from './generateRules'
import bigSign from '../util/bigSign'
import log from '../util/log'
import cloneNodes from '../util/cloneNodes'
import { defaultExtractor } from './defaultExtractor'

let env = sharedState.env

const builtInExtractors = {
  DEFAULT: defaultExtractor,
}

const builtInTransformers = {
  DEFAULT: (content) => content,
  svelte: (content) => content.replace(/(?:^|\s)class:/g, ' '),
}

function getExtractor(tailwindConfig, fileExtension) {
  let extractors = tailwindConfig.content.extract

  return (
    extractors[fileExtension] ||
    extractors.DEFAULT ||
    builtInExtractors[fileExtension] ||
    builtInExtractors.DEFAULT
  )
}

function getTransformer(tailwindConfig, fileExtension) {
  let transformers = tailwindConfig.content.transform

  return (
    transformers[fileExtension] ||
    transformers.DEFAULT ||
    builtInTransformers[fileExtension] ||
    builtInTransformers.DEFAULT
  )
}

let extractorCache = new WeakMap()

// Scans template contents for possible classes. This is a hot path on initial build but
// not too important for subsequent builds. The faster the better though — if we can speed
// up these regexes by 50% that could cut initial build time by like 20%.
function getClassCandidates(content, extractor, candidates, seen) {
  if (!extractorCache.has(extractor)) {
    extractorCache.set(extractor, new LRU({ maxSize: 25000 }))
  }

  for (let line of content.split('\n')) {
    line = line.trim()

    if (seen.has(line)) {
      continue
    }
    seen.add(line)

    if (extractorCache.get(extractor).has(line)) {
      for (let match of extractorCache.get(extractor).get(line)) {
        candidates.add(match)
      }
    } else {
      let extractorMatches = extractor(line).filter((s) => s !== '!*')
      let lineMatchesSet = new Set(extractorMatches)

      for (let match of lineMatchesSet) {
        candidates.add(match)
      }

      extractorCache.get(extractor).set(line, lineMatchesSet)
    }
  }
}

function buildStylesheet(rules, context) {
  let sortedRules = rules.sort(([a], [z]) => bigSign(a - z))

  let returnValue = {
    base: new Set(),
    defaults: new Set(),
    components: new Set(),
    utilities: new Set(),
    variants: new Set(),

    // All the CSS that is not Tailwind related can be put in this bucket. This
    // will make it easier to later use this information when we want to
    // `@apply` for example. The main reason we do this here is because we
    // still need to make sure the order is correct. Last but not least, we
    // will make sure to always re-inject this section into the css, even if
    // certain rules were not used. This means that it will look like a no-op
    // from the user's perspective, but we gathered all the useful information
    // we need.
    user: new Set(),
  }

  for (let [sort, rule] of sortedRules) {
    if (sort >= context.minimumScreen) {
      returnValue.variants.add(rule)
      continue
    }

    if (sort & context.layerOrder.base) {
      returnValue.base.add(rule)
      continue
    }

    if (sort & context.layerOrder.defaults) {
      returnValue.defaults.add(rule)
      continue
    }

    if (sort & context.layerOrder.components) {
      returnValue.components.add(rule)
      continue
    }

    if (sort & context.layerOrder.utilities) {
      returnValue.utilities.add(rule)
      continue
    }

    if (sort & context.layerOrder.user) {
      returnValue.user.add(rule)
      continue
    }
  }

  return returnValue
}

export default function expandTailwindAtRules(context) {
  return (root) => {
    let layerNodes = {
      base: null,
      components: null,
      utilities: null,
      variants: null,
    }

    root.walkAtRules((rule) => {
      // Make sure this file contains Tailwind directives. If not, we can save
      // a lot of work and bail early. Also we don't have to register our touch
      // file as a dependency since the output of this CSS does not depend on
      // the source of any templates. Think Vue <style> blocks for example.
      if (rule.name === 'tailwind') {
        if (Object.keys(layerNodes).includes(rule.params)) {
          layerNodes[rule.params] = rule
        }
      }
    })

    if (Object.values(layerNodes).every((n) => n === null)) {
      return root
    }

    // ---

    // Find potential rules in changed files
    let candidates = new Set(['*'])
    let seen = new Set()

    env.DEBUG && console.time('Reading changed files')

    for (let { content, extension } of context.changedContent) {
      let transformer = getTransformer(context.tailwindConfig, extension)
      let extractor = getExtractor(context.tailwindConfig, extension)
      getClassCandidates(transformer(content), extractor, candidates, seen)
    }

    env.DEBUG && console.timeEnd('Reading changed files')

    // ---

    // Generate the actual CSS
    let classCacheCount = context.classCache.size

    env.DEBUG && console.time('Generate rules')
    let rules = generateRules(candidates, context)
    env.DEBUG && console.timeEnd('Generate rules')

    // We only ever add to the classCache, so if it didn't grow, there is nothing new.
    env.DEBUG && console.time('Build stylesheet')
    if (context.stylesheetCache === null || context.classCache.size !== classCacheCount) {
      for (let rule of rules) {
        context.ruleCache.add(rule)
      }

      context.stylesheetCache = buildStylesheet([...context.ruleCache], context)
    }
    env.DEBUG && console.timeEnd('Build stylesheet')

    let {
      defaults: defaultNodes,
      base: baseNodes,
      components: componentNodes,
      utilities: utilityNodes,
      variants: screenNodes,
    } = context.stylesheetCache

    // ---

    // Replace any Tailwind directives with generated CSS

    if (layerNodes.base) {
      layerNodes.base.before(cloneNodes([...baseNodes, ...defaultNodes], layerNodes.base.source))
      layerNodes.base.remove()
    }

    if (layerNodes.components) {
      layerNodes.components.before(cloneNodes([...componentNodes], layerNodes.components.source))
      layerNodes.components.remove()
    }

    if (layerNodes.utilities) {
      layerNodes.utilities.before(cloneNodes([...utilityNodes], layerNodes.utilities.source))
      layerNodes.utilities.remove()
    }

    // We do post-filtering to not alter the emitted order of the variants
    const variantNodes = Array.from(screenNodes).filter((node) => {
      const parentLayer = node.raws.tailwind?.parentLayer

      if (parentLayer === 'components') {
        return layerNodes.components !== null
      }

      if (parentLayer === 'utilities') {
        return layerNodes.utilities !== null
      }

      return true
    })

    if (layerNodes.variants) {
      layerNodes.variants.before(cloneNodes(variantNodes, layerNodes.variants.source))
      layerNodes.variants.remove()
    } else if (variantNodes.length > 0) {
      root.append(cloneNodes(variantNodes, root.source))
    }

    // If we've got a utility layer and no utilities are generated there's likely something wrong
    const hasUtilityVariants = variantNodes.some(
      (node) => node.raws.tailwind?.parentLayer === 'utilities'
    )

    if (layerNodes.utilities && utilityNodes.size === 0 && !hasUtilityVariants) {
      log.warn('content-problems', [
        'No utilities were generated there is likely a problem with the `content` key in the tailwind config. For more information see the documentation: https://tailwindcss.com/docs/content-configuration',
      ])
    }

    // ---

    if (env.DEBUG) {
      console.log('Potential classes: ', candidates.size)
      console.log('Active contexts: ', sharedState.contextSourcesMap.size)
    }

    // Clear the cache for the changed files
    context.changedContent = []

    // Cleanup any leftover @layer atrules
    root.walkAtRules('layer', (rule) => {
      if (Object.keys(layerNodes).includes(rule.params)) {
        rule.remove()
      }
    })
  }
}
