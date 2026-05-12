import { dimensions } from './utils/dimensions'
import { isLength } from './utils/infer-data-type'
import * as ValueParser from './value-parser'
import { walk, WalkAction } from './walk'

// Assumption: We already assume that we receive somewhat valid `calc()`
// expressions. So we will see `calc(1 + 1)` and not `calc(1+1)`
export function constantFoldDeclaration(
  input: string,
  rem: number | null = null,
  normalizeUnit = true,
): string {
  let [folded, valueAst] = constantFoldDeclarationAst(ValueParser.parse(input), rem, normalizeUnit)

  return folded ? ValueParser.toCss(valueAst) : input
}

export function constantFoldDeclarationAst(
  ast: ValueParser.ValueAstNode[],
  rem: number | null = null,
  normalizeUnit = true,
): [folded: boolean, ast: ValueParser.ValueAstNode[]] {
  let folded = false

  walk(ast, {
    exit(valueNode) {
      // Canonicalize dimensions to their simplest form. This includes:
      // - Convert `-0`, `+0`, `0.0`, … to `0`
      // - Convert `-0px`, `+0em`, `0.0rem`, … to `0`
      // - Convert units to an equivalent unit
      if (
        valueNode.kind === 'word' &&
        valueNode.value !== '0' // Already `0`, nothing to do
      ) {
        let canonical = canonicalizeDimension(valueNode.value, rem, normalizeUnit)
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
        if (valueNode.nodes[2].kind !== 'word') return

        let lhsNode = valueNode.nodes[0]
        let operator = valueNode.nodes[2].value
        let rhsNode = valueNode.nodes[4]

        let lhs = lhsNode.kind === 'word' ? dimensions.get(lhsNode.value) : null
        let rhs = rhsNode.kind === 'word' ? dimensions.get(rhsNode.value) : null

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

        if (operator === '*') {
          // Multiplying by `1` can always unwrap the other side, even when that
          // side is an expression like `var(--foo)` that we can't fully fold.
          if (lhs?.[0] === 1 && lhs?.[1] === null) {
            folded = true
            return WalkAction.ReplaceSkip(rhsNode)
          }

          if (rhs?.[0] === 1 && rhs?.[1] === null) {
            folded = true
            return WalkAction.ReplaceSkip(lhsNode)
          }
        }

        if (operator === '*' || operator === '+') {
          // If only one side is known, and the unknown side is itself another
          // binary expression with the same operator, try to combine the two
          // known parts and keep the unknown part in place.
          //
          // E.g.:
          //
          // - `calc(2rem * calc(3    * var(--foo)))` → `calc(6rem * var(--foo))`
          // - `calc(2rem + calc(3rem + var(--foo)))` → `calc(5rem + var(--foo))`
          //
          // At this point `lhs` and `rhs` are dimensions ([value, unit] |
          // null). The `null` one is the unknown node.
          let constant = lhs ?? rhs
          let nestedNode = lhs === null ? lhsNode : rhs === null ? rhsNode : null

          if (
            constant !== null &&
            nestedNode !== null &&
            nestedNode.kind === 'function' &&
            (nestedNode.value === 'calc' || nestedNode.value === '') &&
            nestedNode.nodes.length === 5 &&
            nestedNode.nodes[2].kind === 'word' &&
            nestedNode.nodes[2].value === operator
          ) {
            let nestedLhsNode = nestedNode.nodes[0]
            let nestedRhsNode = nestedNode.nodes[4]
            let nestedLhs =
              nestedLhsNode.kind === 'word' ? dimensions.get(nestedLhsNode.value) : null
            let nestedRhs =
              nestedRhsNode.kind === 'word' ? dimensions.get(nestedRhsNode.value) : null

            let known = nestedLhs ?? nestedRhs
            let unknown =
              nestedLhs === null ? nestedLhsNode : nestedRhs === null ? nestedRhsNode : null

            if (known !== null && unknown !== null) {
              // `*` requires both values being unitless, or one of them. Both
              // values having a unit is invalid.
              //
              // - `2    * 3`     → valid
              // - `4rem * 5`     → valid
              // - `6    * 7rem`  → valid
              // - `8rem * 9rem`  → invalid
              if (
                operator === '*' &&
                !(
                  (constant[1] === null && known[1] === null) || // Both can be unitless
                  (constant[1] === null && known[1] !== null) || // One of them can be unitless, but the other can't
                  (constant[1] !== null && known[1] === null) // One of them can be unitless, but the other can't
                )
              ) {
                return
              }

              // `+` requires that the units are the same. Adding a unitless
              // value to a value with a unit is not allowed.
              //
              // - `2    + 3`     → valid
              // - `4rem + 5`     → invalid
              // - `6    + 7rem`  → invalid
              // - `8rem + 9rem`  → valid
              if (
                operator === '+' &&
                !(
                  (constant[1] === known[1]) // Only same unit is allowed
                )
              ) {
                return
              }

              // Re-associate nested expressions so we can still fold the known
              // part of `x op (y op z)` when `z` is unknown.
              //
              // Examples:
              // - `calc(2 * calc(3 * var(--foo)))` -> `calc(6 * var(--foo))`
              // - `calc(1rem + calc(2rem + var(--foo)))` -> `calc(3rem + var(--foo))`
              let combined: string
              switch (operator) {
                case '*': {
                  combined = `${constant[0] * known[0]}${constant[1] ?? known[1] ?? ''}`
                  break
                }
                case '+': {
                  combined = `${constant[0] + known[0]}${constant[1] ?? known[1] ?? ''}`
                  break
                }

                default:
                  return
              }

              folded = true

              if (operator === '*' && combined === '1') {
                return WalkAction.ReplaceSkip(unknown)
              }

              let replacement: ValueParser.ValueFunctionNode = {
                kind: 'function',
                value: valueNode.value,
                nodes: [
                  ValueParser.word(combined),
                  valueNode.nodes[1],
                  valueNode.nodes[2],
                  valueNode.nodes[3],
                  unknown,
                ],
              }

              return WalkAction.ReplaceSkip(replacement)
            }
          }
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
              return WalkAction.ReplaceSkip(
                ValueParser.word(`${lhs[0] * rhs[0]}${lhs[1] ?? rhs[1] ?? ''}`),
              )
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

  return [folded, ast]
}

function canonicalizeDimension(
  input: string,
  rem: number | null = null,
  normalizeUnit = true,
): string | null {
  let dimension = dimensions.get(input)
  if (dimension === null) return null // This shouldn't happen

  let [value, unit] = dimension
  if (unit === null) return `${value}` // Already unitless, nothing to do

  // Replace `0<length>` units with just `0`
  if (value === 0 && isLength(input)) return '0'

  // Only normalize into base units when necessary
  if (!normalizeUnit) return `${input}`

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
