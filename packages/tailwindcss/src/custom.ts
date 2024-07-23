// ASTs / parsers for custom utilities

import { segment } from './utils/segment'

const DOUBLE_QUOTE = 0x22
const SINGLE_QUOTE = 0x27

/**
 * Represents a dynamic value used by a custom functional utility.
 *
 * It takes one or more values which can represent a theme value, a bare value, or an arbitrary value.
 * They're looked at in order, and the first one that matches is used.
 */
export type FunctionalUtilityValueFn = {
  kind: 'value' | 'modifier'
  values: UtilityValue[]

  /** The starting location of the value in a given string */
  start: number

  /** The ending location of the value in a given string */
  end: number
}

/**
 * This represents an individual value used by a custom utility.
 */
export type UtilityValue =
  /**
   * An arbitrary value of a given type, inferred as a color in this case:
   * border-[#f00]
   *         ^^^^
   */
  | { kind: 'arbitrary'; dataType: string }

  /**
   * A named, bare value where it's just a number:
   * border-2
   *        ^
   *
   * A named, bare value with a type (inferred as `percentage` in this case):
   * via-33%
   */
  | { kind: 'bare'; dataType: string }

  /**
   * A named, theme value looking in `--color-*`:
   * border-red-500
   *        ^^^^^^^
   */
  | { kind: 'theme'; themeKey: string }

export function findValueFns(value: string) {
  let tmp: FunctionalUtilityValueFn[] = []

  let start = 0

  while (start < value.length) {
    let fnStart = value.indexOf('value(', start)

    // TODO: This is not correct because we could be looking at a "partial" value here
    // It should be the next balanced paren
    let fnEnd = value.indexOf(')', fnStart)

    if (fnStart === -1 || fnEnd === -1) {
      break
    }

    let slice = value.slice(fnStart + 6, fnEnd)
    let values = segment(slice, ',')

    tmp.push({
      kind: 'value',
      start: fnStart,
      end: fnEnd,
      values: values.map((value) => parseValue(value)),
    })

    start = fnEnd
  }

  return tmp
}

function parseValue(value: string): UtilityValue {
  // This is a bare value
  if (value.startsWith('named:')) {
    return { kind: 'bare', dataType: value.slice(6).trim() }
  }

  // Remove quotes if they're present
  let charStart = value.charCodeAt(0)
  let charEnd = value.charCodeAt(value.length - 1)

  if (charStart === DOUBLE_QUOTE && charEnd === DOUBLE_QUOTE) {
    value = value.slice(1, -1)
  } else if (charStart == SINGLE_QUOTE && charEnd == SINGLE_QUOTE) {
    value = value.slice(1, -1)
  }

  // This represents a theme key
  if (value.startsWith('--')) {
    // Remove trailing -* from the theme key if it's present
    if (value.endsWith('-*')) {
      value = value.slice(0, -2)
    }

    return { kind: 'theme', themeKey: value }
  }

  // This is an arbitrary value of a given type
  if (value === '') {
    return { kind: 'arbitrary', dataType: '*' }
  }

  return { kind: 'arbitrary', dataType: value }
}
