import * as ValueParser from '../value-parser'
import { walk, WalkAction } from '../walk'
import { isNamedColor } from './is-color'
import { segment } from './segment'

const KEYWORDS = new Set(['inset', 'inherit', 'initial', 'revert', 'unset'])
const LENGTH_FUNCTIONS = new Set(['calc', 'clamp', 'max', 'min', '--spacing'])
const COLOR_FUNCTIONS = new Set([
  'color',
  'color-mix',
  'contrast-color',
  'device-cmyk',
  'hsl',
  'hsla',
  'hwb',
  'lab',
  'lch',
  'light-dark',
  'oklab',
  'oklch',
  'rgb',
  'rgba',
  '--alpha',
])
const LENGTH = /^-?(\d+|\.\d+)(.*?)$/

export function replaceShadowColors(input: string, replacement: (color: string) => string) {
  function replaceAst(node: ValueParser.ValueAstNode): ValueParser.ValueAstNode[] {
    let color = ValueParser.toCss([node])
    let updatedColor = replacement(color)
    let ast = ValueParser.parse(updatedColor)
    return ast
  }

  let shadows = segment(input, ',').map((shadow) => {
    shadow = shadow.trim()
    let ast = ValueParser.parse(shadow)

    let unknown: ValueParser.ValueAstNode | null = null
    let unknowns = 0
    let lengths = 0
    let replaced = false

    walk(ast, (node) => {
      switch (node.kind) {
        case 'word': {
          // Skip known keywords
          if (KEYWORDS.has(node.value.toLowerCase())) {
            return WalkAction.Continue
          }

          // Must be a length
          if (LENGTH.test(node.value.toLowerCase())) {
            lengths++
            return WalkAction.Continue
          }

          // Must be a color
          if (node.value[0] === '#' || isNamedColor(node.value)) {
            replaced = true
            return WalkAction.ReplaceStop(replaceAst(node))
          }

          // We're not sure yet
          unknown = node
          unknowns++
          break
        }

        case 'function': {
          // Must be a color
          if (COLOR_FUNCTIONS.has(node.value.toLowerCase())) {
            replaced = true
            return WalkAction.ReplaceStop(replaceAst(node))
          }

          // Must be a length
          if (LENGTH_FUNCTIONS.has(node.value.toLowerCase())) {
            lengths++
            return WalkAction.Skip
          }

          // We're not sure yet
          unknown = node
          unknowns++

          // We're not interested in the arguments of the function
          return WalkAction.Skip
        }

        // Ignore separators
        case 'separator':
          return WalkAction.Continue

        default:
          node satisfies never
      }
    })

    // We definitely found a color, nothing else to do
    if (replaced) {
      return ValueParser.toCss(ast)
    }

    // If the x and y offsets were not detected, the shadow is either invalid or
    // using a variable to represent more than one field in the shadow value, so
    // we can't know what to replace.
    if (lengths < 2) {
      return shadow
    }

    // If no color was found, assume the shadow is relying on the browser
    // default shadow color and append the replacement color.
    if (unknowns === 0) {
      return `${shadow} ${replacement('currentcolor')}`
    }

    // A single left-over, we assume that this is the color
    if (unknowns === 1) {
      walk(ast, (node) => {
        if (node === unknown) {
          replaced = true
          return WalkAction.ReplaceStop(replaceAst(node))
        }

        // Keep the walk top-level only, no need to go into functions
        return WalkAction.Skip
      })
    }

    return replaced ? ValueParser.toCss(ast) : shadow
  })

  return shadows.join(', ')
}
