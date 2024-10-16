/**
 * A logical expression represented as a nested object graph
 *
 * The possible nodes are:
 * - lit: A literal
 * - not: A negation
 * - and: A conjunction
 * - or: A disjunction
 * - none: A placeholder for a node that has been removed from the graph
 */
export type Expr<T = any> = {
  kind: 'lit' | 'not' | 'and' | 'or' | 'none'
  value: T | null
  nodes: Expr<T>[]
}

// This is a standin for a node that has been removed
export function none(): Expr<any> {
  return { kind: 'none', value: null, nodes: [] }
}

export function and<T>(nodes: Expr<T>[]): Expr<T> {
  return { kind: 'and', value: null, nodes }
}

export function or<T>(nodes: Expr<T>[]): Expr<T> {
  return { kind: 'or', value: null, nodes }
}

export function not<T>(node: Expr<T>): Expr<T> {
  return { kind: 'not', value: null, nodes: [node] }
}

export function lit<T>(value: T): Expr<T> {
  return { kind: 'lit', value, nodes: [] }
}

export type Visitor = (e: Expr) => Expr

export function visit(e: Expr, w: Visitor, depth: number = 0): Expr {
  e = w(e)

  for (let i = 0; i < e.nodes.length; i++) {
    e.nodes[i] = visit(e.nodes[i], w, depth + 1)
  }

  return e
}

export function visitDepth(e: Expr, w: Visitor, depth: number = 0): Expr {
  for (let i = 0; i < e.nodes.length; i++) {
    e.nodes[i] = visitDepth(e.nodes[i], w, depth + 1)
  }

  e = w(e)

  return e
}
