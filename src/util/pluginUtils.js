import selectorParser from 'postcss-selector-parser'
import escapeCommas from './escapeCommas'
import { withAlphaValue } from './withAlphaVariable'
import {
  normalize,
  length,
  number,
  percentage,
  url,
  color as validateColor,
  genericName,
  familyName,
  image,
  absoluteSize,
  relativeSize,
  position,
  lineWidth,
  shadow,
} from './dataTypes'
import negateValue from './negateValue'

export function updateAllClasses(selectors, updateClass) {
  let parser = selectorParser((selectors) => {
    selectors.walkClasses((sel) => {
      let updatedClass = updateClass(sel.value)
      sel.value = updatedClass
      if (sel.raws && sel.raws.value) {
        sel.raws.value = escapeCommas(sel.raws.value)
      }
    })
  })

  let result = parser.processSync(selectors)

  return result
}

function resolveArbitraryValue(modifier, validate) {
  if (isArbitraryValue(modifier)) {
    if (!validate(modifier.value)) {
      return undefined
    }

    return modifier.value
  }

  return undefined
}

function asNegativeValue(modifier, lookup = {}, validate) {
  let positiveValue = lookup[modifier]

  if (positiveValue !== undefined) {
    return negateValue(positiveValue)
  }
}

export function asValue(modifier, options = {}, { candidate, validate = () => true } = {}) {
  if (isArbitraryValue(modifier)) {
    let resolved = resolveArbitraryValue(modifier, validate)

    if (resolved === undefined) {
      return undefined
    }

    if (options.supportsNegativeValues && candidate.negative) {
      return negateValue(resolved)
    }

    return resolved
  }

  let value = options.values?.[modifier]

  if (value !== undefined) {
    return value
  }

  if (options.supportsNegativeValues && modifier.startsWith('-')) {
    return asNegativeValue(modifier.slice(1), options.values, validate)
  }

  return undefined
}

function isArbitraryValue(input) {
  return typeof input === 'object'
}

/**
 *
 * @param {string} modifier
 * @param {any} options
 * @param {object} param2
 * @param {any} param2.tailwindConfig
 * @param {import('../lib/candidate').Candidate} param2.candidate
 * @param {import('../lib/candidate').Plugin} param2.candidatePlugin
 * @returns
 */
export function asColor(
  modifier,
  options = {},
  { tailwindConfig = {}, candidate, candidatePlugin } = {}
) {
  if (options.values?.[modifier] !== undefined && candidatePlugin.modifiers.length === 0) {
    return options.values?.[modifier]
  }

  let alpha = candidatePlugin.modifiers[0]?.value ?? undefined

  if (typeof alpha === 'string') {
    alpha = tailwindConfig.theme?.opacity?.[alpha] ?? undefined

    if (alpha === undefined) {
      return undefined
    }
  } else if (typeof alpha === 'object') {
    alpha = alpha.value
  }

  if (alpha !== undefined) {
    let normalizedColor =
      options.values?.[modifier] ?? (isArbitraryValue(modifier) ? modifier.value : undefined)

    if (normalizedColor === undefined) {
      return undefined
    }

    return withAlphaValue(normalizedColor, alpha)
  }

  return asValue(modifier, options, { candidate, validate: validateColor })
}

export function asLookupValue(modifier, options = {}) {
  return options.values?.[modifier]
}

function guess(validate) {
  return (modifier, options, { candidate }) => {
    return asValue(modifier, options, { candidate, validate })
  }
}

let typeMap = {
  any: asValue,
  color: asColor,
  url: guess(url),
  image: guess(image),
  length: guess(length),
  percentage: guess(percentage),
  position: guess(position),
  lookup: asLookupValue,
  'generic-name': guess(genericName),
  'family-name': guess(familyName),
  number: guess(number),
  'line-width': guess(lineWidth),
  'absolute-size': guess(absoluteSize),
  'relative-size': guess(relativeSize),
  shadow: guess(shadow),
}

let supportedTypes = Object.keys(typeMap)

export function coerceValue(types, modifier, options, tailwindConfig, candidate, candidatePlugin) {
  if (isArbitraryValue(modifier)) {
    if (!supportedTypes.includes(modifier.dataType)) {
      return []
    }

    // 'any' is the default data type for arbitrary values
    // TODO: We should probably guess them when parsing candidates
    if (modifier.dataType !== 'any') {
      return [asValue(modifier, options), modifier.dataType]
    }
  }

  // Find first matching type
  for (let type of [].concat(types)) {
    let result = typeMap[type](modifier, options, { tailwindConfig, candidate, candidatePlugin })
    if (result !== undefined) return [result, type]
  }

  return []
}
