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

function replace<T>(nodes: T[], index: number, replacements: T[]) {
  switch (replacements.length) {
    case 0:
      nodes.splice(index, 1)
      break
    case 1:
      nodes[index] = replacements[0]
      break
    default:
      nodes.splice(index, 1, ...replacements)
      break
  }
}

export function walk<T extends object>(
  ast: T[],
  hooks:
    | ((node: T, ctx: VisitContext<T>) => EnterResult<T> | void) // Old API, enter only
    | {
        enter: (node: T, ctx: VisitContext<T>) => EnterResult<T> | void
        exit: (node: T, ctx: VisitContext<T>) => ExitResult<T> | void
      }
    | {
        enter: (node: T, ctx: VisitContext<T>) => EnterResult<T> | void
        exit?: never
      }
    | {
        enter?: never
        exit: (node: T, ctx: VisitContext<T>) => ExitResult<T> | void
      },
): void {
  if (typeof hooks === 'function') walkEnter(ast, hooks)
  else if (hooks.enter && hooks.exit) walkEnterExit(ast, hooks.enter, hooks.exit)
  else if (hooks.enter) walkEnter(ast, hooks.enter)
  else if (hooks.exit) walkExit(ast, hooks.exit)
}

function walkEnter<T extends { nodes?: T[] }>(
  ast: T[],
  enter: (node: T, ctx: VisitContext<T>) => EnterResult<T> | void,
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

    let node = nodes[offset]

    ctx.parent = parent
    ctx.depth = depth

    let result = enter(node, ctx) ?? WalkAction.Continue

    switch (result.kind) {
      case WalkKind.Continue: {
        if (node.nodes && node.nodes.length > 0) {
          stack.push([node.nodes, 0, node as Parent<T>])
        }

        stack[depth][1]++ // Advance to next sibling
        continue
      }

      case WalkKind.Stop:
        return // Stop immediately

      case WalkKind.Skip:
        stack[depth][1]++ // Advance to next sibling
        continue

      case WalkKind.Replace: {
        // Replace current node, with new nodes. No need to change the offset
        // because we want to re-visit the current index, which now contains the
        // new nodes.
        replace(nodes, offset, result.nodes)
        continue
      }

      case WalkKind.ReplaceStop: {
        replace(nodes, offset, result.nodes) // Replace current node
        return // Stop immediately
      }

      case WalkKind.ReplaceSkip: {
        replace(nodes, offset, result.nodes) // Replace current node
        stack[depth][1] += result.nodes.length // Advance to next sibling past replacements
        continue
      }

      default: {
        result satisfies never

        throw new Error(
          // @ts-expect-error `result.kind` could still be filled in with an invalid value
          `Invalid \`WalkAction.${WalkKind[result.kind] ?? `Unknown(${result.kind})`}\` in enter.`,
        )
      }
    }
  }
}

function walkExit<T extends { nodes?: T[] }>(
  ast: T[],
  exit: (node: T, ctx: VisitContext<T>) => ExitResult<T> | void,
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

    // "Enter" phase. We need to enter the AST so we can go back up again
    if (offset >= 0) {
      let node = nodes[offset]

      if (node.nodes && node.nodes.length > 0) {
        stack[depth][1] = ~offset // Prepare for actual exit phase
        stack.push([node.nodes, 0, node as Parent<T>])
        continue
      }

      // Leaf node: run exit immediately
      let result = exit(node, ctx) ?? WalkAction.Continue

      switch (result.kind) {
        case WalkKind.Continue: {
          stack[depth][1]++ // Advance to next sibling
          continue
        }

        case WalkKind.Stop:
          return // Stop immediately

        case WalkKind.ReplaceStop: {
          replace(nodes, offset, result.nodes)
          return // Stop immediately
        }

        case WalkKind.Replace:
        case WalkKind.ReplaceSkip: {
          replace(nodes, offset, result.nodes)
          stack[depth][1] += result.nodes.length
          continue
        }

        default: {
          result satisfies never
          throw new Error(
            // @ts-expect-error `result.kind` could still be filled in with an invalid value
            `Invalid \`WalkAction.${WalkKind[result.kind] ?? `Unknown(${result.kind})`}\` in exit (leaf).`,
          )
        }
      }
    }

    // Actual exit phase for nodes[~offset]
    let index = ~offset
    let node = nodes[index]

    let result = exit(node, ctx) ?? WalkAction.Continue

    switch (result.kind) {
      case WalkKind.Continue: {
        stack[depth][1] = index + 1 // Advance to next sibling
        continue
      }

      case WalkKind.Stop:
        return // Stop immediately

      case WalkKind.ReplaceStop: {
        replace(nodes, index, result.nodes)
        return // Stop immediately
      }

      case WalkKind.Replace:
      case WalkKind.ReplaceSkip: {
        replace(nodes, index, result.nodes)
        stack[depth][1] = index + result.nodes.length // Advance to next sibling past replacements
        continue
      }

      default: {
        result satisfies never
        throw new Error(
          // @ts-expect-error `result.kind` could still be filled in with an invalid value
          `Invalid \`WalkAction.${WalkKind[result.kind] ?? `Unknown(${result.kind})`}\` in exit.`,
        )
      }
    }
  }
}

function walkEnterExit<T extends { nodes?: T[] }>(
  ast: T[],
  enter: (node: T, ctx: VisitContext<T>) => EnterResult<T> | void,
  exit: (node: T, ctx: VisitContext<T>) => EnterResult<T> | void,
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
            stack[depth][1] = ~offset // Prepare for exit phase, same offset
            stack.push([node.nodes, 0, node as Parent<T>])
            continue
          }

          // Already a leaf node, can immediately exit
          {
            let result = exit(node, ctx) ?? WalkAction.Continue

            switch (result.kind) {
              case WalkKind.Continue:
              case WalkKind.Skip:
                stack[depth][1]++ // Advance to next sibling
                continue

              case WalkKind.Stop:
                return // Stop immediately

              case WalkKind.ReplaceStop:
                replace(nodes, offset, result.nodes)
                return // Stop immediately

              case WalkKind.Replace:
              case WalkKind.ReplaceSkip:
                replace(nodes, offset, result.nodes)
                stack[depth][1] += result.nodes.length // Advance to next sibling past replacements
                continue

              default: {
                result satisfies never
                throw new Error(
                  // @ts-expect-error r.kind may be invalid
                  `Invalid \`WalkAction.${WalkKind[result.kind] ?? `Unknown(${result.kind})`}\` in exit (leaf).`,
                )
              }
            }
          }
        }

        case WalkKind.Stop:
          return // Stop immediately

        case WalkKind.Skip: {
          let result = exit(node, ctx) ?? WalkAction.Continue

          switch (result.kind) {
            case WalkKind.Continue:
            case WalkKind.Skip:
              stack[depth][1]++
              continue

            case WalkKind.Stop:
              return // Stop immediately

            case WalkKind.Replace:
              replace(nodes, offset, result.nodes)
              stack[depth][1] += result.nodes.length // don't visit replacements' exits
              continue

            case WalkKind.ReplaceStop:
              replace(nodes, offset, result.nodes)
              return // Stop immediately

            case WalkKind.ReplaceSkip:
              replace(nodes, offset, result.nodes)
              stack[depth][1] += result.nodes.length // don't visit replacements' exits
              continue

            default: {
              result satisfies never
              throw new Error(
                // @ts-expect-error r.kind may be invalid
                `Invalid \`WalkAction.${WalkKind[result.kind] ?? `Unknown(${result.kind})`}\` in exit (skip).`,
              )
            }
          }
        }

        case WalkKind.Replace: {
          // Replace current node; re-visit current index (enter on first replacement)
          replace(nodes, offset, result.nodes)
          continue
        }

        case WalkKind.ReplaceStop: {
          replace(nodes, offset, result.nodes)
          return // Stop immediately
        }

        case WalkKind.ReplaceSkip: {
          replace(nodes, offset, result.nodes)
          stack[depth][1] += result.nodes.length // Advance to next sibling past replacements
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
      case WalkKind.Skip:
        stack[depth][1] = index + 1 // Advance to next sibling
        continue

      case WalkKind.Stop:
        return // Stop immediately

      case WalkKind.Replace: {
        replace(nodes, index, result.nodes)
        stack[depth][1] = index + result.nodes.length // Advance to next sibling past replacements
        continue
      }

      case WalkKind.ReplaceStop: {
        replace(nodes, index, result.nodes)
        return // Stop immediately
      }

      case WalkKind.ReplaceSkip: {
        replace(nodes, index, result.nodes)
        stack[depth][1] = index + result.nodes.length // Advance to next sibling past replacements
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
