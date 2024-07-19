// ASTs / parsers for custom utilities

import { segment } from './utils/segment'

export type UtilityDefinition = {
  /**
   * static: @utility scale{ … }
   *                       ^ (no `-*`)
   * functional: @utility scale-* { … }
   *                           ^^^
   */
  kind: 'static' | 'functional'

  /**
   * @utility scale { … }
   *          ^^^^^
   *
   * @utility scale-* { … }
   *          ^^^^^
   */
  name: string

  /**
   * @utility scale-* value(--spacing-*) modifier(--spacing-*)
   *                  ^^^^^^^^^^^^^^^^^^
   */
  value: UtilityDetail | null

  /**
   * @utility scale-* value(--spacing-*) modifier(--spacing-*)
   *                                     ^^^^^^^^^^^^^^^^^^^^^
   */
  modifier: UtilityDetail | null
}

export type UtilityDetail = {
  /**
   * @utility scale-* value(--spacing-*) modifier(--spacing-*)
   *                  ^^^^^              ^^^^^^^^
   */
  name: string

  /**
   * @utility scale-* value(--spacing-*) modifier(--spacing-*)
   *                        ^^^^^^^^^             ^^^^^^^^^
   */
  themeKeys: string[]
}

export function parseUtilityDefinition(descriptor: string): UtilityDefinition | null {
  let parts = segment(descriptor, ' ')

  let name = parts[0]

  let value: UtilityDetail | null = null
  let modifier: UtilityDetail | null = null

  if (name.endsWith('-*')) {
    name = name.slice(0, -2)

    for (let part of parts.slice(1)) {
      let detail = parseUtilityDetail(part)
      if (detail === null) return null

      if (detail.name === 'value') {
        value = detail
      } else if (detail.name === 'modifier') {
        modifier = detail
      } else {
        // Unknown thing maybe need good error message or something
        return null
      }
    }

    return {
      kind: 'functional',
      name,
      value,
      modifier,
    }
  }

  return {
    kind: 'static',
    name,
    value,
    modifier,
  }
}

function parseUtilityDetail(detail: string): UtilityDetail | null {
  let argStart = detail.indexOf('(')
  if (argStart === -1) return null

  let argEnd = detail.indexOf(')')
  if (argEnd === -1) return null

  let name = detail.slice(0, argStart)

  let args = segment(detail.slice(argStart + 1, argEnd), ',')
  if (args.length === 0) return null

  let themeKeys: string[] = []

  for (let arg of args) {
    if (arg.startsWith('--') && arg.endsWith('-*')) {
      themeKeys.push(arg.slice(0, -2))
    }
  }

  if (themeKeys.length === 0) return null

  return {
    name,
    themeKeys,
  }
}
