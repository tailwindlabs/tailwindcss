import { dimensions } from './utils/dimensions'
import { isLength } from './utils/infer-data-type'
import * as ValueParser from './value-parser'

// Assumption: We already assume that we receive somewhat valid `calc()`
// expressions. So we will see `calc(1 + 1)` and not `calc(1+1)`
export function constantFoldDeclaration(input: string): string {
  let folded = false
  let valueAst = ValueParser.parse(input)

  ValueParser.walkDepth(valueAst, (valueNode, { replaceWith }) => {
    // Convert `-0`, `+0`, `0.0`, … to `0`
    // Convert `-0px`, `+0em`, `0.0rem`, … to `0`
    if (
      valueNode.kind === 'word' &&
      valueNode.value !== '0' && // Already `0`, nothing to do
      ((valueNode.value[0] === '-' && valueNode.value[1] === '0') || // `-0…`
        (valueNode.value[0] === '+' && valueNode.value[1] === '0') || // `+0…`
        valueNode.value[0] === '0') // `0…`
    ) {
      let dimension = dimensions.get(valueNode.value)
      if (dimension === null) return // This shouldn't happen

      if (dimension[0] !== 0) return // Not a zero value, nothing to do

      // Replace length units with just `0`
      if (dimension[1] === null || isLength(valueNode.value)) {
        folded = true
        replaceWith(ValueParser.word('0'))
        return
      }

      // Replace other units with `0<unit>`, e.g. `0%`, `0fr`, `0s`, …
      else if (valueNode.value !== `0${dimension[1]}`) {
        folded = true
        replaceWith(ValueParser.word(`0${dimension[1]}`))
        return
      }
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
        replaceWith(ValueParser.word('0'))
        return
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
            replaceWith(ValueParser.word(`${lhs[0] * rhs[0]}${lhs[1] ?? ''}`))
          }
          break
        }

        case '+': {
          if (
            lhs[1] === rhs[1] // Same unit or unitless, e.g.: `1rem + 2rem`, `8 + 6`
          ) {
            folded = true
            replaceWith(ValueParser.word(`${lhs[0] + rhs[0]}${lhs[1] ?? ''}`))
          }
          break
        }

        case '-': {
          if (
            lhs[1] === rhs[1] // Same unit or unitless, e.g.: `2rem - 1rem`, `8 - 6`
          ) {
            folded = true
            replaceWith(ValueParser.word(`${lhs[0] - rhs[0]}${lhs[1] ?? ''}`))
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
            replaceWith(ValueParser.word(`${lhs[0] / rhs[0]}${lhs[1] ?? ''}`))
          }
          break
        }
      }
    }
  })

  return folded ? ValueParser.toCss(valueAst) : input
}
