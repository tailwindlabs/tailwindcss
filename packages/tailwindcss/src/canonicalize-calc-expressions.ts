import { dimensions } from './utils/dimensions'
import * as ValueParser from './value-parser'
import { walk, WalkAction } from './walk'

// Assumption: We already assume that we receive somewhat valid `calc()`
// expressions. So we will see `calc(1 + 1)` and not `calc(1+1)`
export function canonicalizeCalcExpressions(input: string): string {
  let [canonicalized, valueAst] = canonicalizeCalcExpressionsAst(ValueParser.parse(input))

  return canonicalized ? ValueParser.toCss(valueAst) : input
}

export function canonicalizeCalcExpressionsAst(
  ast: ValueParser.ValueAstNode[],
): [canonicalized: boolean, ast: ValueParser.ValueAstNode[]] {
  let canonicalized = false

  walk(ast, {
    exit(valueNode) {
      // We are only interested in binary expressions in `calc(…)` and `(…)`,
      // and only with the `*` or `+` operators.
      if (valueNode.kind !== 'function') return
      if (valueNode.value !== 'calc' && valueNode.value !== '') return
      if (valueNode.nodes.length !== 5) return
      if (valueNode.nodes[2].kind !== 'word') return
      if (valueNode.nodes[2].value !== '*' && valueNode.nodes[2].value !== '+') return

      let lhs = valueNode.nodes[0]
      let rhs = valueNode.nodes[4]

      if (shouldSwap(lhs, rhs)) {
        canonicalized = true

        let replacement: ValueParser.ValueFunctionNode = {
          kind: 'function',
          value: valueNode.value,
          nodes: [
            rhs, // Now lhs
            valueNode.nodes[1], // Separator
            valueNode.nodes[2], // Operator
            valueNode.nodes[3], // Separator
            lhs, // Now rhs
          ],
        }

        return WalkAction.ReplaceSkip(replacement)
      }
    },
  })

  return [canonicalized, ast]
}

function shouldSwap(lhs: ValueParser.ValueAstNode, rhs: ValueParser.ValueAstNode): boolean {
  let lhsDimension = lhs.kind === 'word' ? dimensions.get(lhs.value) : null
  let rhsDimension = rhs.kind === 'word' ? dimensions.get(rhs.value) : null

  if (lhsDimension !== null && rhsDimension === null) return true
  if (lhsDimension === null && rhsDimension !== null) return false

  if (lhsDimension !== null && rhsDimension !== null) {
    let [lhsValue, lhsUnit] = lhsDimension
    let [rhsValue, rhsUnit] = rhsDimension

    // Within dimensions, keep unit-bearing values ahead of unitless numbers so
    // `1rem` sorts before `1`.
    if (lhsUnit === null && rhsUnit !== null) return true
    if (lhsUnit !== null && rhsUnit === null) return false

    // Then sort dimensions numerically, and finally by unit for ties.
    if (lhsValue !== rhsValue) {
      return lhsValue - rhsValue > 0
    }

    if (lhsUnit !== rhsUnit) {
      return (lhsUnit ?? '').localeCompare(rhsUnit ?? '') > 0
    }
  }

  // Both nodes are not non-dimensions, sort them as strings
  return ValueParser.toCss([lhs]).localeCompare(ValueParser.toCss([rhs])) > 0
}
