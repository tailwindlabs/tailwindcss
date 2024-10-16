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
      let selector = child.kind === 'not' ? child.nodes[0].value! : child.value!
      let negated = negateSelector(selector)

      // We can't negate this selector which means we're unable to accurately
      // negate the entire AST
      if (negated === null) throw new Error(`Unable to negate rule: ${selector}`)

      current = rule(negated, current ? [current] : [])
    }

    if (current) {
      newAst.push(current)
    }
  }

  return flattenNesting(newAst)
}

function negateSelector(selector: string): string | null {
  function negateConditions(ruleName: string, conditions: string[]) {
    return conditions.map((condition) => {
      condition = condition.trim()

      let parts = segment(condition, ' ')

      // @media not {query}
      // @supports not {query}
      // @container not {query}
      if (parts[0] === 'not') {
        return parts.slice(1).join(' ')
      }

      if (ruleName === 'container') {
        // @container {query}
        if (parts[0].startsWith('(')) {
          return `not ${condition}`
        }

        // @container {name} not {query}
        else if (parts[1] === 'not') {
          return `${parts[0]} ${parts.slice(2).join(' ')}`
        }

        // @container {name} {query}
        else {
          return `${parts[0]} not ${parts.slice(1).join(' ')}`
        }
      }

      return `not ${condition}`
    })
  }

  if (selector[0] === '@') {
    let name = selector.slice(1, selector.indexOf(' '))
    let params = selector.slice(selector.indexOf(' ') + 1)

    if (name === 'media' || name === 'supports' || name === 'container') {
      let conditions = negateConditions(name, segment(params, ','))

      return `@${name} ${conditions.join(', ')}`
    }

    // This contains an at-rule that we can't negate
    return null
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
