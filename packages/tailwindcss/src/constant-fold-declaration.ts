import { add, div, mul, mulDiv, normalize, round, sub } from './utils/decimal'
import { dimensions, numberPart } from './utils/dimensions'
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
    exit(valueNode, ctx) {
      // Canonicalize dimensions to their simplest form. This includes:
      // - Convert `-0`, `+0`, `0.0`, … to `0`
      // - Convert `-0px`, `+0em`, `0.0rem`, … to `0<unit>`
      // - Convert units to an equivalent unit
      if (
        valueNode.kind === 'word' &&
        valueNode.value !== '0' // Already `0`, nothing to do
      ) {
        let canonical = canonicalizeDimension(valueNode.value, rem, normalizeUnit)
        if (canonical === null) return // Couldn't be canonicalized, nothing to do
        if (canonical === valueNode.value) return // Already in canonical form, nothing to do

        // We need to be careful with `0` because `0<unit>` can only be
        // converted to `0` if we're dealing with a `<length>` type.
        if (canonical === '0') {
          // When used inside of a function such as `calc(…)`, then this isn't
          // always safe to convert to `0`.
          //
          // E.g.:
          // - `calc(0px + 1rem)` → `calc(0 + 1rem)` this goes from valid to invalid
          // - `calc(0px * 1rem)` → `calc(0 * 1rem)` this goes from invalid to valid
          if (ctx.parent?.kind === 'function') {
            let withUnit = canonicalizeDimension(valueNode.value, rem, false)
            if (withUnit === null) return

            folded = true
            return WalkAction.ReplaceSkip(ValueParser.word(withUnit))
          }
        }

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

        // Fold `0<unit> * something-without-unit` to just `0<unit>`, inside of a function such as `calc(…)`
        if (operator === '*' && lhs?.[0] === 0 && lhs?.[1] !== null && rhs?.[1] === null) {
          folded = true
          if (ctx.parent?.kind === 'function') {
            return WalkAction.ReplaceSkip(ValueParser.word(`0${lhs[1]}`))
          } else {
            return WalkAction.ReplaceSkip(ValueParser.word('0'))
          }
        }

        // Fold `something-without-unit * 0<unit>` to just `0<unit>`, inside of a function such as `calc(…)`
        if (operator === '*' && rhs?.[0] === 0 && rhs?.[1] !== null && lhs?.[1] === null) {
          folded = true
          if (ctx.parent?.kind === 'function') {
            return WalkAction.ReplaceSkip(ValueParser.word(`0${rhs[1]}`))
          } else {
            return WalkAction.ReplaceSkip(ValueParser.word('0'))
          }
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

              // `+` requires that both values being unitless, or both values
              // have a unit. Mixed units are valid, but we won't fold these.
              //
              // - `2    + 3`     → valid
              // - `4rem + 5`     → invalid
              // - `6    + 7rem`  → invalid
              // - `8rem + 9rem`  → valid
              if (
                operator === '+' &&
                !(
                  constant[1] === known[1] // Only same unit is allowed
                )
              ) {
                return
              }

              // re associate nested expressions so we can still fold the known
              // part of x op (y op z) when z is unknown
              // - calc(2 * calc(3 * var(--foo))) -> calc(6 * var(--foo))
              // - calc(1rem + calc(2rem + var(--foo))) -> calc(3rem + var(--foo))
              let constantNode = (lhs !== null ? lhsNode : rhsNode) as ValueParser.ValueWordNode
              let knownNode = (
                nestedLhs !== null ? nestedLhsNode : nestedRhsNode
              ) as ValueParser.ValueWordNode

              let a = numberPart(constantNode.value, constant[1])
              let b = numberPart(knownNode.value, known[1])
              let result = operator === '*' ? mul(a, b) : add(a, b)
              if (result === null) return

              let combined = `${result}${constant[1] ?? known[1] ?? ''}`

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

        //both sides are dimensions, so both nodes are words
        let lhsNumber = numberPart((lhsNode as ValueParser.ValueWordNode).value, lhs[1])
        let rhsNumber = numberPart((rhsNode as ValueParser.ValueWordNode).value, rhs[1])

        switch (operator) {
          case '*': {
            if (
              lhs[1] === rhs[1] || // Same Units, e.g.: `1rem * 2rem`, `8 * 6`
              (lhs[1] === null && rhs[1] !== null) || // Unitless * Unit, e.g.: `2 * 1rem`
              (lhs[1] !== null && rhs[1] === null) // Unit * Unitless, e.g.: `1rem * 2`
            ) {
              let result = mul(lhsNumber, rhsNumber)
              if (result === null) break

              folded = true
              return WalkAction.ReplaceSkip(ValueParser.word(`${result}${lhs[1] ?? rhs[1] ?? ''}`))
            }
            break
          }

          case '+': {
            if (
              lhs[1] === rhs[1] // Same unit or unitless, e.g.: `1rem + 2rem`, `8 + 6`
            ) {
              let result = add(lhsNumber, rhsNumber)
              if (result === null) break

              folded = true
              return WalkAction.ReplaceSkip(ValueParser.word(`${result}${lhs[1] ?? ''}`))
            }
            break
          }

          case '-': {
            if (
              lhs[1] === rhs[1] // Same unit or unitless, e.g.: `2rem - 1rem`, `8 - 6`
            ) {
              let result = sub(lhsNumber, rhsNumber)
              if (result === null) break

              folded = true
              return WalkAction.ReplaceSkip(ValueParser.word(`${result}${lhs[1] ?? ''}`))
            }
            break
          }

          case '/': {
            if (
              rhs[0] !== 0 && // Don't divide by zero
              ((lhs[1] === null && rhs[1] === null) || // Unitless / Unitless, e.g.: `8 / 2`
                (lhs[1] !== null && rhs[1] === null)) // Unit / Unitless, e.g.: `1rem / 2`
            ) {
              // Only fold with .xx precision, anything beyond that might be a bit too much.
              //
              // E.g. 100% / 3.5 = 28.571428571428573%, which is correct but not
              //      as user friendly. Especially when going from
              //      `w-[calc(100%/3.5)]` → `w-[28.571428571428573%]`
              let result = div(lhsNumber, rhsNumber, 2)
              if (result === null) break

              folded = true
              return WalkAction.ReplaceSkip(ValueParser.word(`${result}${lhs[1] ?? ''}`))
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
  if (unit === null) return normalize(input) // already unitless, only normalize the number

  // Replace `0<length>` units with just `0`
  if (value === 0 && isLength(input)) {
    if (normalizeUnit) return '0'
    else return `0${unit}` // Keep unit
  }

  // Only normalize into base units when necessary
  if (!normalizeUnit) return `${input}`

  let v = numberPart(input, unit)

  // prettier-ignore
  switch (unit.toLowerCase()) {
    // <length> to px, https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units#lengths
    case 'in':  return withUnit(mul(v, '96'), 'px')                      // 1in  = 96px
    case 'cm':  return withUnit(mulDiv(v, '4800', 127), 'px') // 1cm  = 96px / 2.54  = 4800px / 127
    case 'mm':  return withUnit(mulDiv(v, '480', 127), 'px')  // 1mm  = 96px / 25.4  =  480px / 127
    case 'q':   return withUnit(mulDiv(v, '120', 127), 'px')  // 1q   = 96px / 101.6 =  120px / 127
    case 'pc':  return withUnit(mul(v, '16'), 'px')                      // 1pc  = 16px
    case 'pt':  return withUnit(mulDiv(v, '4', 3), 'px')      // 1pt  = 4px / 3
    case 'rem': return rem !== null ? withUnit(mul(v, `${rem}`), 'px') : null // 1rem = 16px (Assuming root font-size is 16px)

    // <angle> to deg, https://developer.mozilla.org/en-US/docs/Web/CSS/angle
    case 'grad': return withUnit(mul(v, '0.9'), 'deg')                   // 1grad = 0.9deg
    case 'rad':  return withUnit(round(Number(v) * 180 / Math.PI), 'deg') // 1rad = 57.2957795131deg
    case 'turn': return withUnit(mul(v, '360'), 'deg')                   // 1turn = 360deg

    // <time> to s, https://developer.mozilla.org/en-US/docs/Web/CSS/time
    case 'ms':   return withUnit(mul(v, '0.001'), 's')                   // 1ms = 0.001s

    // <frequency> to hz, https://developer.mozilla.org/en-US/docs/Web/CSS/frequency
    case 'khz':  return withUnit(mul(v, '1000'), 'hz')                   // 1kHz = 1000Hz

    default: return withUnit(normalize(v), unit) // No canonicalization possible, only normalize the number
  }
}

function withUnit(value: string | null, unit: string): string | null {
  return value === null ? null : `${value}${unit}`
}
