import * as ValueParser from '../value-parser'

export function extractUsedVariables(raw: string): string[] {
  let variables: string[] = []
  ValueParser.walk(ValueParser.parse(raw), (node) => {
    if (node.kind !== 'function' || node.value !== 'var') return

    ValueParser.walk(node.nodes, (child) => {
      if (child.kind !== 'word' || child.value[0] !== '-' || child.value[1] !== '-') return

      variables.push(child.value)
    })

    return ValueParser.ValueWalkAction.Skip
  })
  return variables
}
