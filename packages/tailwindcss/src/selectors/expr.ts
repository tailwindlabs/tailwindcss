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

/**
 * A placeholder for a node that has been removed from the expression graph
 */
export function none(): Expr<any> {
  return { kind: 'none', value: null, nodes: [] }
}

/**
 * Creates an AND relationship between the given nodes
 */
export function and<T>(nodes: Expr<T>[]): Expr<T> {
  return { kind: 'and', value: null, nodes }
}

/**
 * Creates an OR relationship between the given nodes
 */
export function or<T>(nodes: Expr<T>[]): Expr<T> {
  return { kind: 'or', value: null, nodes }
}

/**
 * Creates a NOT relationship with the given node
 */
export function not<T>(node: Expr<T>): Expr<T> {
  return { kind: 'not', value: null, nodes: [node] }
}

/**
 * Represents a "literal" value in the expression graph.
 * This is essential an opaque variable that stands in for some value.
 */
export function lit<T>(value: T): Expr<T> {
  return { kind: 'lit', value, nodes: [] }
}

export type Visitor = {
  Enter?: (e: Expr) => Expr
  Exit?: (e: Expr) => Expr
}

export function visit(e: Expr, w: Visitor): Expr {
  e = w.Enter?.(e) ?? e

  for (let i = 0; i < e.nodes.length; i++) {
    e.nodes[i] = visit(e.nodes[i], w)
  }

  e = w.Exit?.(e) ?? e

  return e
}
