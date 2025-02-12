export const enum WalkAction {
  // Continue walking the tree. Default behavior.
  Continue,

  // Skip walking into the current node.
  Skip,

  // Stop walking the tree entirely.
  Stop,
}

interface Walkable<T> {
  each(cb: (node: T, index: number) => void): void
}

// Custom walk implementation where we can skip going into nodes when we don't
// need to process them.
export function walk<T>(
  rule: Walkable<T>,
  cb: (rule: T, idx: number, parent: Walkable<T>) => void | WalkAction,
): undefined | false {
  let result: undefined | false = undefined

  rule.each?.((node, idx) => {
    let action = cb(node, idx, rule) ?? WalkAction.Continue
    if (action === WalkAction.Stop) {
      result = false
      return result
    }
    if (action !== WalkAction.Skip) {
      result = walk(node as Walkable<T>, cb)
      return result
    }
  })

  return result
}

// Depth first walk reversal implementation.
export function walkDepth<T>(rule: Walkable<T>, cb: (rule: T) => void) {
  rule?.each?.((node) => {
    walkDepth(node as Walkable<T>, cb)
    cb(node)
  })
}
