import type { AstNode } from '../ast'
import { rule, walkDepth } from '../ast'
import { DefaultMap } from '../utils/default-map'
import { segment } from '../utils/segment'
import { and, lit, not, or, type Expr } from './expr'
import { flattenNesting } from './nesting'
import { toDNF } from './rewriting'

export function negateRules(ast: AstNode[]): AstNode[] {
  // 1. Flatten any nesting
  // 2. Isolate rules such that no siblings are present except at the root
  let flattened = flattenNesting(structuredClone(ast))

  // 3. Convert the AST into an expression graph
  // 4. Negate the graph
  let graph = not(toGraph(flattened))

  // 5. Convert the graph to Disjunctive Normal Form (DNF)
  graph = toDNF(graph)

  // 6. Convert the graph back into a structured AST
  // The current graph looks like this
  // (A && B && …) || (D && E && …) || …

  // Each conjunction represents one set of nested rules
  // Each disjunction represents a separate set of rules
  let newAst: AstNode[] = []

  for (let expr of graph.nodes) {
    let current: AstNode | null = null

    for (let child of expr.nodes.reverse()) {
      let selector = child.kind === 'not' ? invertSelector(child.nodes[0].value!) : child.value!

      current = rule(selector, current ? [current] : [])
    }

    if (current) {
      newAst.push(current)
    }
  }

  return flattenNesting(newAst)
}

function invertSelector(selector: string): string {
  if (selector[0] === '@') {
    return selector
      .replace('@media', '@media not')
      .replace('@supports', '@supports not')
      .replace('@document', '@document not')
  }

  let selectors = segment(selector, ',').map((part) => {
    part = part.trim()

    if (part.startsWith(':is(') && part.endsWith(')')) {
      part = part.slice(4, -1)
    }

    part = part.replaceAll('&', '*')

    return part
  })

  return `&:not(${selectors.join(', ')})`
}

function toGraph(ast: AstNode[]): Expr<string> {
  let current = 1
  let table = new DefaultMap<string, number>(() => current++)
  let graph = or([])

  walkDepth(ast, (node, { path }) => {
    // Ignore non-rules
    if (node.kind !== 'rule') return

    // Only consider leaf nodes
    if (node.nodes.length > 0) return

    let rules = path.filter((node) => node.kind === 'rule')

    graph.nodes.push(and(rules.map((rule) => lit(rule.selector))))
  })

  return graph as Expr<string>
}
