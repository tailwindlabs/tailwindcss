// @ts-check

/** @typedef {import('./candidate.d').Plugin} Plugin */
/** @typedef {import('./candidate.d').Arbitrary} Arbitrary */
/** @typedef {import('./candidate.d').Candidate} Candidate */
/** @typedef {import('./candidate.d').DataType} DataType */
/** @typedef {import('./candidate.d').Variant} Variant */
/** @typedef {import('./candidate.d').Modifier} Modifier */

import { normalize } from '../util/dataTypes.js'
import isValidArbitraryValue from '../util/isValidArbitraryValue.js'
import { splitAtTopLevelOnly } from '../util/splitAtTopLevelOnly.js'
import { isParsableCssValue, isValidPropName, looksLikeUri } from '../util/css-validation.js'
import { candidatePermutations } from '../util/candidatePermutations'
import * as sharedState from './sharedState'
import { asClass } from '../util/nameClass.js'

let caches = {
  /** @type {Map<string, Candidate[]>} */
  candidates: new Map(),

  /** @type {Map<string, Variant>} */
  variants: new Map(),

  /** @type {Map<string, Modifier>} */
  modifiers: new Map(),

  /** @type {Map<string, Arbitrary | string>} */
  arbitrary: new Map(),
}

/**
 *
 * @param {string} raw
 * @param {any} context
 * @returns {Iterable<Candidate>}
 */
export function parseCandidate(raw, context) {
  if (caches.candidates.has(raw)) {
    return caches.candidates.get(raw)
  }

  let candidates = Array.from(parseStructure(raw, context))
    .map((candidate) => validateCandidate(candidate))
    .filter(Boolean)

  return put(caches.candidates, raw, candidates)
}

/**
 *
 * @param {Candidate} candidate
 * @returns {Candidate | null}
 */
function validateCandidate(candidate) {
  // Normalize arbitrary values in variants
  for (const item of candidate.variants) {
    if (item.type === 'partial' || item.type === 'custom') {
      item.value = normalize(item.value)
    }
  }

  candidate = validateCustomCandidate(candidate)

  if (!candidate) {
    return candidate
  }

  if (candidate.type !== 'constrained') {
    return candidate
  }

  // Normalize arbitrary values
  candidate.plugins = Array.from(validatePlugins(candidate.plugins))

  return candidate
}

/**
 *
 * @param {Candidate} candidate
 * @returns {Candidate | null}
 */
function validateCustomCandidate(candidate) {
  if (candidate.type !== 'custom') {
    return candidate
  }

  // Ignore invalid custom property names
  if (!isValidPropName(candidate.name)) {
    return null
  }

  // Ignore url-like custom properties
  if (looksLikeUri(`${candidate.name}:${candidate.value}`)) {
    return null
  }

  if (!isValidArbitraryValue(candidate.value)) {
    return null
  }

  if (!isParsableCssValue(candidate.name, candidate.value)) {
    return null
  }

  // Normalize arbitrary values in modifiers
  candidate.modifiers = Array.from(normalizeModifiers(candidate.modifiers))
  candidate.value = normalize(candidate.value)

  return candidate
}

/**
 *
 * @param {Iterable<Modifier>} modifiers
 * @returns {Iterable<Modifier>}
 */
function* normalizeModifiers(modifiers) {
  // Normalize arbitrary values in modifiers
  for (const modifier of modifiers) {
    if (typeof modifier.value === 'string') {
      modifier.value = normalize(modifier.value)
    } else if (typeof modifier.value === 'object') {
      modifier.value.value = normalize(modifier.value.value)
    }

    yield modifier
  }
}

/**
 *
 * @param {Iterable<Plugin>} plugins
 */
function* validatePlugins(plugins) {
  for (const plugin of plugins) {
    if (typeof plugin.value === 'object') {
      if (!isValidArbitraryValue(plugin.value.value)) {
        continue
      }

      plugin.modifiers = Array.from(normalizeModifiers(plugin.modifiers))
      plugin.value.value = normalize(plugin.value.value)
    }

    yield plugin
  }
}

/**
 *
 * @param {string} raw
 * @param {any} context
 * @returns {Iterable<Candidate>}
 */
function* parseStructure(raw, context) {
  // TODO: Can we remove this?
  if (raw === sharedState.NOT_ON_DEMAND) {
    yield {
      raw,
      withoutVariants: raw,
      className: `${sharedState.NOT_ON_DEMAND}`,

      // This is always gonna be the same
      // but is included for completeness
      prefix: context.tailwindConfig.prefix ?? '',
      important: false,
      variants: [],
      negative: false,

      type: 'constrained',
      plugins: [
        {
          // @ts-ignore: TODO Would love to remove the need for the new String('*) stuff if at all ever maybe possible
          plugin: sharedState.NOT_ON_DEMAND,
          value: 'DEFAULT',
          modifiers: [],
        },
      ],
    }

    return
  }

  // Parse out the variants
  let [candidate, ...rawVariants] = Array.from(
    splitAtTopLevelOnly(raw, context.tailwindConfig.separator)
  ).reverse()

  let variants = rawVariants.map(parseVariant)

  // Important?
  let important = candidate[0] === '!'
  if (important) {
    candidate = candidate.slice(1)
  }

  let withoutVariants = candidate

  // Negative before prefix
  let negative = false
  if (candidate[0] === '-') {
    negative = true
    candidate = candidate.slice(1)
  }

  // Verify the prefix
  // If the candidate isn't prefixed with the configured prefix
  // Then we treat the entire thing as the candidate rather than just the prefixed portion
  let prefix = context.tailwindConfig.prefix ?? ''
  let prefixLength = prefix.length

  if (prefix !== '') {
    if (candidate.slice(0, prefixLength) === prefix) {
      candidate = candidate.slice(prefixLength)
    } else {
      prefix = ''
      prefixLength = 0
    }
  }

  // Negative after prefix
  if (prefix !== '' && candidate[0] === '-') {
    // We had a negative before the prefix
    // This means we're looking at something like -tw--top-1
    // That's weird and invalid
    if (negative === true) {
      return
    }

    negative = true
    candidate = candidate.slice(1)
  }

  let common = {
    raw,
    className: asClass(raw),
    withoutVariants,
    prefix,
    important,
    variants,
    negative,
  }

  let arbitraryProperty = parseArbitraryProperty(candidate)
  if (arbitraryProperty) {
    yield Object.assign({}, common, {
      /** @type {'custom'} */
      type: 'custom',
      name: arbitraryProperty[0],
      value: arbitraryProperty[1],
      modifiers: [],
    })

    return
  }

  // Generate each plugin
  let plugins = generatePlugins(candidate, negative)

  // Insert modifier versions of each plugin (if necessary)
  plugins = insertModifierPlugins(plugins, parseModifiers(candidate))

  // Scan for the name up to the modifier, opening arbitrary value bracket, or end of string
  yield Object.assign({}, common, {
    /** @type {'constrained'} */
    type: 'constrained',
    plugins: Array.from(plugins),
  })
}

/**
 *
 * @param {string} candidate
 * @param {boolean} negative
 * @returns {Iterable<Plugin>}
 */
function* generatePlugins(candidate, negative) {
  for (const plugin of candidatePermutations(candidate, negative)) {
    yield plugin

    let arbitrary = extractArbitraryValue(`${plugin.value}`)
    if (arbitrary) {
      yield {
        ...plugin,
        value: arbitrary,
      }
    }
  }
}

/**
 *
 * @param {Iterable<Plugin>} plugins
 * @param {Modifier[]} modifiers
 * @returns {Iterable<Plugin>}
 */
function* insertModifierPlugins(plugins, modifiers) {
  for (const plugin of plugins) {
    if (typeof plugin.value === 'object') {
      plugin.modifiers = modifiers
    }

    yield plugin

    if (modifiers.length === 0) {
      continue
    }

    if (typeof plugin.value === 'string' && plugin.value.includes(`/${modifiers[0].raw}`)) {
      yield {
        ...plugin,
        value: plugin.value.slice(0, plugin.value.indexOf(`/${modifiers[0].raw}`)),
        modifiers,
      }
    }
  }
}

/**
 *
 * @param {string} str
 * @returns {[string, string] | null}
 */
function parseArbitraryProperty(str) {
  let [, property, value] = str.match(/^\[([a-zA-Z0-9-_]+):(\S+)\]$/) ?? []

  if (value === undefined) {
    return null
  }

  return [property, value]
}

/**
 * @param {string} raw
 * @returns {Arbitrary | null}
 */
function extractArbitraryValue(raw) {
  let arbitraryStart = raw.indexOf('[')
  let arbitraryEnd = raw.lastIndexOf(']/')
  if (arbitraryEnd === -1) {
    arbitraryEnd = raw.lastIndexOf(']')
  }

  if (arbitraryStart === -1 || arbitraryEnd === -1) {
    return null
  }

  let arbitrary = parseArbitraryValue(raw.slice(arbitraryStart, arbitraryEnd + 1))

  if (typeof arbitrary === 'string') {
    return null
  }

  return arbitrary
}

/**
 * @param {string} raw
 * @returns {string | Arbitrary}
 */
function parseArbitraryValue(raw) {
  if (caches.arbitrary.has(raw)) {
    return caches.arbitrary.get(raw)
  }

  if (raw[0] !== '[' || raw[raw.length - 1] !== ']') {
    return raw
  }

  let dataTypeSeparator = raw.indexOf(':')
  let dataType = raw.slice(1, dataTypeSeparator)
  let isValidDataType = dataTypeSeparator !== -1 && /^[\w-_]+$/g.test(dataType)
  let value = raw.slice(dataTypeSeparator + 1, -1)

  // It could also be that the user says something like bg-[color:]
  // This would be treated as an "empty" arbitrary value with type of `color` which is not what we want
  // This this is not really an arbitrary value but just a raw string
  if (value === '') {
    return raw
  }

  // It could be that this resolves to `url(https` which is not a valid
  // identifier. We currently only support "simple" words with dashes or
  // underscores. E.g.: family-name
  if (!isValidDataType) {
    return put(caches.arbitrary, raw, {
      raw,
      value: raw.slice(1, -1),
      dataType: 'any',
    })
  }

  return put(caches.arbitrary, raw, {
    raw,
    value,
    dataType,
  })
}

/**
 *
 * @param {string} raw
 * @returns {Variant}
 */
function parseVariant(raw) {
  if (caches.variants.has(raw)) {
    return caches.variants.get(raw)
  }

  if (raw[0] === '[' && raw[raw.length - 1] === ']') {
    return put(caches.variants, raw, {
      /** @type {'custom'} */
      type: 'custom',
      raw,
      value: raw.slice(1, -1),
      dataType: 'any',
    })
  }

  if (raw[0] !== '[' && raw[raw.length - 1] === ']') {
    let value = raw.slice(raw.lastIndexOf('[') + 1, -1)
    let name = raw.slice(0, raw.indexOf(value) - 1 /* - */ - 1 /* [ */)

    return put(caches.variants, raw, {
      type: 'partial',
      raw,
      name,
      value,
      dataType: 'any',
    })
  }

  return put(caches.variants, raw, {
    type: 'constrained',
    raw,
    name: raw,
  })
}

/**
 *
 * @param {string} raw
 * @returns {Modifier[]}
 */
function parseModifiers(raw) {
  let match = raw.match(/\/(\[[^\[\]]+\])|\/([^\[\]]+)$/) ?? []

  if (match.length === 0) {
    return []
  }

  if (match[1] !== undefined) {
    return [
      {
        raw: match[1],
        value: parseArbitraryValue(match[1]),
      },
    ]
  }

  if (match[2] !== undefined) {
    return [
      {
        raw: match[2],
        value: match[2],
      },
    ]
  }

  return null
}

/**
 * @template T
 * @param {Map<string, T>} cache
 * @param {string} key
 * @param {T} value
 * @returns {T}
 */
function put(cache, key, value) {
  cache.set(key, value)

  // console.log('CACHE MISS', { key, value })

  return value
}
