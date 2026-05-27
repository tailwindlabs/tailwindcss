import * as ValueParser from '../value-parser'
import { walk, WalkAction } from '../walk'
import { DefaultMap } from './default-map'

let extractUsedVariablesCache = new DefaultMap((raw) => {
  let variables: string[] = []
  walk(ValueParser.parse(raw), (node) => {
    if (node.kind !== 'function' || node.value !== 'var') return

    walk(node.nodes, (child) => {
      if (child.kind !== 'word' || child.value[0] !== '-' || child.value[1] !== '-') return

      variables.push(child.value)
    })

    return WalkAction.Skip
  })
  return variables
})

export function extractUsedVariables(raw: string): string[] {
  return extractUsedVariablesCache.get(raw)
}
