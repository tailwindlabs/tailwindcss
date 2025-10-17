import { dimensions } from './utils/dimensions'
import { isLength } from './utils/infer-data-type'
import * as ValueParser from './value-parser'
import { walk, WalkAction } from './walk'

// Assumption: We already assume that we receive somewhat valid `calc()`
// expressions. So we will see `calc(1 + 1)` and not `calc(1+1)`
export function constantFoldDeclaration(input: string, rem: number | null = null): string {
  let folded = false
  let valueAst = ValueParser.parse(input)

  walk(valueAst, {
    exit(valueNode) {
      // Canonicalize dimensions to their simplest form. This includes:
      // - Convert `-0`, `+0`, `0.0`, … to `0`
      // - Convert `-0px`, `+0em`, `0.0rem`, … to `0`
      // - Convert units to an equivalent unit
      if (
        valueNode.kind === 'word' &&
        valueNode.value !== '0' // Already `0`, nothing to do
      ) {
        let canonical = canonicalizeDimension(valueNode.value, rem)
        if (canonical === null) return // Couldn't be canonicalized, nothing to do
        if (canonical === valueNode.value) return // Already in canonical form, nothing to do

        folded = true
        return WalkAction.ReplaceSkip(ValueParser.word(canonical))
      }

      // Constant fold `calc()` expressions with two operands and one operator
      else if (
        valueNode.kind === 'function' &&
        (valueNode.value === 'calc' || valueNode.value === '')
      ) {
        // [
        //   { kind: 'word', value: '0.25rem' },            0
        //   { kind: 'separator', value: ' ' },             1
        //   { kind: 'word', value: '*' },                  2
        //   { kind: 'separator', value: ' ' },             3
        //   { kind: 'word', value: '256' }                 4
        // ]
        if (valueNode.nodes.length !== 5) return

        let lhs = dimensions.get(valueNode.nodes[0].value)
        let operator = valueNode.nodes[2].value
        let rhs = dimensions.get(valueNode.nodes[4].value)

        // Nullify entire expression when multiplying by `0`, e.g.: `calc(0 * 100vw)` -> `0`
        //
        // TODO: Ensure it's safe to do so based on the data types?
        if (
          operator === '*' &&
          ((lhs?.[0] === 0 && lhs?.[1] === null) || // 0 * something
            (rhs?.[0] === 0 && rhs?.[1] === null)) // something * 0
        ) {
          folded = true
          return WalkAction.ReplaceSkip(ValueParser.word('0'))
        }

        // We're not dealing with dimensions, so we can't fold this
        if (lhs === null || rhs === null) {
          return
        }

        switch (operator) {
          case '*': {
            if (
              lhs[1] === rhs[1] || // Same Units, e.g.: `1rem * 2rem`, `8 * 6`
              (lhs[1] === null && rhs[1] !== null) || // Unitless * Unit, e.g.: `2 * 1rem`
              (lhs[1] !== null && rhs[1] === null) // Unit * Unitless, e.g.: `1rem * 2`
            ) {
              folded = true
              return WalkAction.ReplaceSkip(ValueParser.word(`${lhs[0] * rhs[0]}${lhs[1] ?? ''}`))
            }
            break
          }

          case '+': {
            if (
              lhs[1] === rhs[1] // Same unit or unitless, e.g.: `1rem + 2rem`, `8 + 6`
            ) {
              folded = true
              return WalkAction.ReplaceSkip(ValueParser.word(`${lhs[0] + rhs[0]}${lhs[1] ?? ''}`))
            }
            break
          }

          case '-': {
            if (
              lhs[1] === rhs[1] // Same unit or unitless, e.g.: `2rem - 1rem`, `8 - 6`
            ) {
              folded = true
              return WalkAction.ReplaceSkip(ValueParser.word(`${lhs[0] - rhs[0]}${lhs[1] ?? ''}`))
            }
            break
          }

          case '/': {
            if (
              rhs[0] !== 0 && // Don't divide by zero
              ((lhs[1] === null && rhs[1] === null) || // Unitless / Unitless, e.g.: `8 / 2`
                (lhs[1] !== null && rhs[1] === null)) // Unit / Unitless, e.g.: `1rem / 2`
            ) {
              folded = true
              return WalkAction.ReplaceSkip(ValueParser.word(`${lhs[0] / rhs[0]}${lhs[1] ?? ''}`))
            }
            break
          }
        }
      }
    },
  })

  return folded ? ValueParser.toCss(valueAst) : input
}

function canonicalizeDimension(input: string, rem: number | null = null): string | null {
  let dimension = dimensions.get(input)
  if (dimension === null) return null // This shouldn't happen

  let [value, unit] = dimension
  if (unit === null) return `${value}` // Already unitless, nothing to do

  // Replace `0<length>` units with just `0`
  if (value === 0 && isLength(input)) return '0'

  // prettier-ignore
  switch (unit.toLowerCase()) {
    // <length> to px, https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units#lengths
    case 'in':  return `${value * 96}px`                  // 1in  = 96.000px
    case 'cm':  return `${value * 96 / 2.54}px`           // 1cm  = 37.795px
    case 'mm':  return `${value * 96 / 2.54 / 10}px`      // 1mm  =  3.779px
    case 'q':   return `${value * 96 / 2.54 / 10 / 4}px`  //  1q  =  0.945px
    case 'pc':  return `${value * 96 / 6}px`              // 1pc  = 16.000px
    case 'pt':  return `${value * 96 / 72}px`             // 1pt  =  1.333px
    case 'rem': return rem !== null ? `${value * rem}px` : null    // 1rem = 16.000px (Assuming root font-size is 16px)

    // <angle> to deg, https://developer.mozilla.org/en-US/docs/Web/CSS/angle
    case 'grad': return `${value * 0.9}deg`               // 1grad =   0.900deg
    case 'rad':  return `${value * 180 / Math.PI}deg`     //  1rad =  57.296deg
    case 'turn': return `${value * 360}deg`               // 1turn = 360.000deg

    // <time> to s, https://developer.mozilla.org/en-US/docs/Web/CSS/time
    case 'ms':   return `${value / 1000}s`                // 1ms = 0.001s

    // <frequency> to hz, https://developer.mozilla.org/en-US/docs/Web/CSS/frequency
    case 'khz':  return `${value * 1000}hz`               // 1kHz = 1000Hz

    default: return `${value}${unit}` // No canonicalization possible, return as-is
  }
}
