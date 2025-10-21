import { decl, type AstNode } from './ast'
import { SignatureFeatures } from './canonicalize-candidates'
import { segment } from './utils/segment'

function createPrefixedQuad(
  prefix: string,
  t = 'top',
  r = 'right',
  b = 'bottom',
  l = 'left',
): Record<number, [prop: string, index: number][]> {
  return createBareQuad(`${prefix}-${t}`, `${prefix}-${r}`, `${prefix}-${b}`, `${prefix}-${l}`)
}

// prettier-ignore
function createBareQuad(t = 'top', r = 'right', b = 'bottom', l = 'left'): Record<number, [prop: string, index: number][]> {
  return {
    1: [[t, 0], [r, 0], [b, 0], [l, 0]],
    2: [[t, 0], [r, 1], [b, 0], [l, 1]],
    3: [[t, 0], [r, 1], [b, 2], [l, 1]],
    4: [[t, 0], [r, 1], [b, 2], [l, 3]],
  } as const;
}

// prettier-ignore
function createPair(lhs: string, rhs: string): Record<number, [prop: string, index: number][]> {
  return {
    1: [[lhs, 0], [rhs, 0]],
    2: [[lhs, 0], [rhs, 1]],
  } as const;
}

// Depending on the length of the value, map to different properties
let VARIADIC_EXPANSION_MAP: Record<string, Record<number, [prop: string, index: number][]>> = {
  inset: createBareQuad(),
  margin: createPrefixedQuad('margin'),
  padding: createPrefixedQuad('padding'),
  gap: createPair('row-gap', 'column-gap'),
}

// Depending on the length of the value, map to different properties
let VARIADIC_LOGICAL_EXPANSION_MAP: Record<
  string,
  Record<number, [prop: string, index: number][]>
> = {
  'inset-block': createPair('top', 'bottom'),
  'inset-inline': createPair('left', 'right'),
  'margin-block': createPair('margin-top', 'margin-bottom'),
  'margin-inline': createPair('margin-left', 'margin-right'),
  'padding-block': createPair('padding-top', 'padding-bottom'),
  'padding-inline': createPair('padding-left', 'padding-right'),
}

// The entire value is mapped to each property
let LOGICAL_EXPANSION_MAP: Record<string, string[]> = {
  'border-block': ['border-bottom', 'border-top'],
  'border-block-color': ['border-bottom-color', 'border-top-color'],
  'border-block-style': ['border-bottom-style', 'border-top-style'],
  'border-block-width': ['border-bottom-width', 'border-top-width'],
  'border-inline': ['border-left', 'border-right'],
  'border-inline-color': ['border-left-color', 'border-right-color'],
  'border-inline-style': ['border-left-style', 'border-right-style'],
  'border-inline-width': ['border-left-width', 'border-right-width'],
}

export function expandDeclaration(
  node: Extract<AstNode, { kind: 'declaration' }>,
  options: SignatureFeatures,
): AstNode[] | null {
  if (options & SignatureFeatures.LogicalToPhysical) {
    if (node.property in VARIADIC_LOGICAL_EXPANSION_MAP) {
      let args = segment(node.value!, ' ')
      return VARIADIC_LOGICAL_EXPANSION_MAP[node.property][args.length]?.map(([prop, index]) => {
        return decl(prop, args[index], node.important)
      })
    }

    if (node.property in LOGICAL_EXPANSION_MAP) {
      return LOGICAL_EXPANSION_MAP[node.property]?.map((prop) => {
        return decl(prop, node.value!, node.important)
      })
    }
  }

  if (node.property in VARIADIC_EXPANSION_MAP) {
    let args = segment(node.value!, ' ')
    return VARIADIC_EXPANSION_MAP[node.property][args.length]?.map(([prop, index]) => {
      return decl(prop, args[index], node.important)
    })
  }

  return null
}
