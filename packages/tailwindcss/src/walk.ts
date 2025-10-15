const enum WalkKind {
  Continue,
  Skip,
  Stop,
  Replace,
  ReplaceSkip,
  ReplaceStop,
}

export const WalkAction = {
  Continue: { kind: WalkKind.Continue } as const,
  Skip: { kind: WalkKind.Skip } as const,
  Stop: { kind: WalkKind.Stop } as const,
  Replace: <T>(nodes: T | T[]) =>
    ({ kind: WalkKind.Replace, nodes: Array.isArray(nodes) ? nodes : [nodes] }) as const,
  ReplaceSkip: <T>(nodes: T | T[]) =>
    ({ kind: WalkKind.ReplaceSkip, nodes: Array.isArray(nodes) ? nodes : [nodes] }) as const,
  ReplaceStop: <T>(nodes: T | T[]) =>
    ({ kind: WalkKind.ReplaceStop, nodes: Array.isArray(nodes) ? nodes : [nodes] }) as const,
} as const

type WalkAction = typeof WalkAction
type WalkResult<T> =
  | WalkAction['Continue']
  | WalkAction['Skip']
  | WalkAction['Stop']
  | ReturnType<typeof WalkAction.Replace<T>>
  | ReturnType<typeof WalkAction.ReplaceSkip<T>>
  | ReturnType<typeof WalkAction.ReplaceStop<T>>

type EnterResult<T> = WalkResult<T>
type ExitResult<T> = Exclude<WalkResult<T>, { kind: WalkKind.Skip }>

type Parent<T> = T & { nodes: T[] }

export interface VisitContext<T> {
  parent: Parent<T> | null
  depth: number
  path: () => T[]
}

export function walk<T extends object>(
  ast: T[],
  hooks:
    | ((node: T, ctx: VisitContext<T>) => EnterResult<T> | void) // Old API, enter only
    | {
        enter?: (node: T, ctx: VisitContext<T>) => EnterResult<T> | void
        exit?: (node: T, ctx: VisitContext<T>) => ExitResult<T> | void
      },
): void {
  if (typeof hooks === 'function') walkImplementation(ast, hooks)
  else walkImplementation(ast, hooks.enter, hooks.exit)
}

function walkImplementation<T extends { nodes?: T[] }>(
  ast: T[],
  enter: (node: T, ctx: VisitContext<T>) => EnterResult<T> | void = () => WalkAction.Continue,
  exit: (node: T, ctx: VisitContext<T>) => ExitResult<T> | void = () => WalkAction.Continue,
) {
  let stack: [nodes: T[], offset: number, parent: Parent<T> | null][] = [[ast, 0, null]]
  let ctx: VisitContext<T> = {
    parent: null,
    depth: 0,
    path() {
      let path: T[] = []

      for (let i = 1; i < stack.length; i++) {
        let parent = stack[i][2]
        if (parent) path.push(parent)
      }

      return path
    },
  }

  while (stack.length > 0) {
    let depth = stack.length - 1
    let frame = stack[depth]
    let nodes = frame[0]
    let offset = frame[1]
    let parent = frame[2]

    // Done with this level
    if (offset >= nodes.length) {
      stack.pop()
      continue
    }

    ctx.parent = parent
    ctx.depth = depth

    // Enter phase (offsets are positive)
    if (offset >= 0) {
      let node = nodes[offset]
      let result = enter(node, ctx) ?? WalkAction.Continue

      switch (result.kind) {
        case WalkKind.Continue: {
          if (node.nodes && node.nodes.length > 0) {
            stack.push([node.nodes, 0, node as Parent<T>])
          }

          frame[1] = ~offset // Prepare for exit phase, same offset
          continue
        }

        case WalkKind.Stop:
          return // Stop immediately

        case WalkKind.Skip: {
          frame[1] = ~offset // Prepare for exit phase, same offset
          continue
        }

        case WalkKind.Replace: {
          nodes.splice(offset, 1, ...result.nodes)
          continue // Re-process at same offset
        }

        case WalkKind.ReplaceStop: {
          nodes.splice(offset, 1, ...result.nodes)
          return // Stop immediately
        }

        case WalkKind.ReplaceSkip: {
          nodes.splice(offset, 1, ...result.nodes)
          frame[1] += result.nodes.length // Advance to next sibling past replacements
          continue
        }

        default: {
          result satisfies never
          throw new Error(
            // @ts-expect-error enterResult.kind may be invalid
            `Invalid \`WalkAction.${WalkKind[result.kind] ?? `Unknown(${result.kind})`}\` in enter.`,
          )
        }
      }
    }

    // Exit phase for nodes[~offset]
    let index = ~offset // Two's complement to get original offset
    let node = nodes[index]

    let result = exit(node, ctx) ?? WalkAction.Continue

    switch (result.kind) {
      case WalkKind.Continue:
        frame[1] = index + 1 // Advance to next sibling
        continue

      case WalkKind.Stop:
        return // Stop immediately

      case WalkKind.Replace: {
        nodes.splice(index, 1, ...result.nodes)
        frame[1] = index + result.nodes.length // Advance to next sibling past replacements
        continue
      }

      case WalkKind.ReplaceStop: {
        nodes.splice(index, 1, ...result.nodes)
        return // Stop immediately
      }

      case WalkKind.ReplaceSkip: {
        nodes.splice(index, 1, ...result.nodes)
        frame[1] = index + result.nodes.length // Advance to next sibling past replacements
        continue
      }

      default: {
        result satisfies never
        throw new Error(
          // @ts-expect-error `result.kind` could still be filled with an invalid value
          `Invalid \`WalkAction.${WalkKind[result.kind] ?? `Unknown(${result.kind})`}\` in exit.`,
        )
      }
    }
  }
}
