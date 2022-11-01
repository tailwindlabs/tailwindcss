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
import { backgroundSize } from './validateFormalSyntax'
import { flagEnabled } from '../featureFlags.js'

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

export function filterSelectorsForClass(selectors, classCandidate) {
  let parser = selectorParser((selectors) => {
    selectors.each((sel) => {
      const containsClass = sel.nodes.some(
        (node) => node.type === 'class' && node.value === classCandidate
      )
      if (!containsClass) {
        sel.remove()
      }
    })
  })

  let result = parser.processSync(selectors)

  return result
}

function resolveArbitraryValue(modifier, validate) {
  if (!isArbitraryValue(modifier)) {
    return undefined
  }

  let value = modifier.slice(1, -1)

  if (!validate(value)) {
    return undefined
  }

  return normalize(value)
}

function asNegativeValue(modifier, lookup = {}, validate) {
  let positiveValue = lookup[modifier]

  if (positiveValue !== undefined) {
    return negateValue(positiveValue)
  }

  if (isArbitraryValue(modifier)) {
    let resolved = resolveArbitraryValue(modifier, validate)

    if (resolved === undefined) {
      return undefined
    }

    return negateValue(resolved)
  }
}

export function asValue(modifier, options = {}, { validate = () => true } = {}) {
  let value = options.values?.[modifier]

  if (value !== undefined) {
    return value
  }

  if (options.supportsNegativeValues && modifier.startsWith('-')) {
    return asNegativeValue(modifier.slice(1), options.values, validate)
  }

  return resolveArbitraryValue(modifier, validate)
}

function isArbitraryValue(input) {
  return input.startsWith('[') && input.endsWith(']')
}

function splitUtilityModifier(modifier) {
  let slashIdx = modifier.lastIndexOf('/')

  if (slashIdx === -1 || slashIdx === modifier.length - 1) {
    return [modifier, undefined]
  }

  let arbitrary = isArbitraryValue(modifier)

  // The modifier could be of the form `[foo]/[bar]`
  // We want to handle this case properly
  // without affecting `[foo/bar]`
  if (arbitrary && !modifier.includes(']/[')) {
    return [modifier, undefined]
  }

  return [modifier.slice(0, slashIdx), modifier.slice(slashIdx + 1)]
}

export function parseColorFormat(value) {
  if (typeof value === 'string' && value.includes('<alpha-value>')) {
    let oldValue = value

    return ({ opacityValue = 1 }) => oldValue.replace('<alpha-value>', opacityValue)
  }

  return value
}

export function asColor(
  _,
  options = {},
  { tailwindConfig = {}, utilityModifier, rawModifier } = {}
) {
  if (options.values?.[rawModifier] !== undefined) {
    return parseColorFormat(options.values?.[rawModifier])
  }

  // TODO: Hoist this up to getMatchingTypes or something
  // We do this here because we need the alpha value (if any)
  let [color, alpha] = splitUtilityModifier(rawModifier)

  if (alpha !== undefined) {
    let normalizedColor =
      options.values?.[color] ?? (isArbitraryValue(color) ? color.slice(1, -1) : undefined)

    if (normalizedColor === undefined) {
      return undefined
    }

    normalizedColor = parseColorFormat(normalizedColor)

    if (isArbitraryValue(alpha)) {
      return withAlphaValue(normalizedColor, alpha.slice(1, -1))
    }

    if (tailwindConfig.theme?.opacity?.[alpha] === undefined) {
      return undefined
    }

    return withAlphaValue(normalizedColor, tailwindConfig.theme.opacity[alpha])
  }

  return asValue(rawModifier, options, { rawModifier, utilityModifier, validate: validateColor })
}

export function asLookupValue(modifier, options = {}) {
  return options.values?.[modifier]
}

function guess(validate) {
  return (modifier, options, extras) => {
    return asValue(modifier, options, { ...extras, validate })
  }
}

export let typeMap = {
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
  size: guess(backgroundSize),
}

let supportedTypes = Object.keys(typeMap)

function splitAtFirst(input, delim) {
  let idx = input.indexOf(delim)
  if (idx === -1) return [undefined, input]
  return [input.slice(0, idx), input.slice(idx + 1)]
}

export function coerceValue(types, modifier, options, tailwindConfig) {
  if (isArbitraryValue(modifier)) {
    let arbitraryValue = modifier.slice(1, -1)
    let [explicitType, value] = splitAtFirst(arbitraryValue, ':')

    // It could be that this resolves to `url(https` which is not a valid
    // identifier. We currently only support "simple" words with dashes or
    // underscores. E.g.: family-name
    if (!/^[\w-_]+$/g.test(explicitType)) {
      value = arbitraryValue
    }

    //
    else if (explicitType !== undefined && !supportedTypes.includes(explicitType)) {
      return []
    }

    if (value.length > 0 && supportedTypes.includes(explicitType)) {
      return [asValue(`[${value}]`, options), explicitType, null]
    }
  }

  let matches = getMatchingTypes(types, modifier, options, tailwindConfig)

  // Find first matching type
  for (let match of matches) {
    return match
  }

  return []
}

/**
 *
 * @param {{type: string}[]} types
 * @param {string} rawModifier
 * @param {any} options
 * @param {any} tailwindConfig
 * @returns {Iterator<[value: string, type: string, modifier: string | null]>}
 */
export function* getMatchingTypes(types, rawModifier, options, tailwindConfig) {
  let modifiersEnabled = flagEnabled(tailwindConfig, 'generalizedModifiers')

  let [modifier, utilityModifier] = splitUtilityModifier(rawModifier)

  let canUseUtilityModifier =
    modifiersEnabled &&
    options.modifiers != null &&
    (options.modifiers === 'any' ||
      (typeof options.modifiers === 'object' &&
        ((utilityModifier && isArbitraryValue(utilityModifier)) ||
          utilityModifier in options.modifiers)))

  if (!canUseUtilityModifier) {
    modifier = rawModifier
    utilityModifier = undefined
  }

  if (utilityModifier !== undefined && modifier === '') {
    modifier = 'DEFAULT'
  }

  // Check the full value first
  // TODO: Move to asValue… somehow
  if (utilityModifier !== undefined) {
    if (typeof options.modifiers === 'object') {
      let configValue = options.modifiers?.[utilityModifier] ?? null
      if (configValue !== null) {
        utilityModifier = configValue
      } else if (isArbitraryValue(utilityModifier)) {
        utilityModifier = utilityModifier.slice(1, -1)
      }
    }

    let result = asValue(rawModifier, options, { rawModifier, utilityModifier, tailwindConfig })
    if (result !== undefined) {
      yield [result, 'any', null]
    }
  }

  for (const { type } of types ?? []) {
    let result = typeMap[type](modifier, options, {
      rawModifier,
      utilityModifier,
      tailwindConfig,
    })

    if (result === undefined) {
      continue
    }

    yield [result, type, utilityModifier ?? null]
  }
}
