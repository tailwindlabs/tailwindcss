import postcss, {
  type ChildNode as PostCssChildNode,
  type Container as PostCssContainerNode,
  type Root as PostCssRoot,
} from 'postcss'
import { atRule, comment, decl, rule, type AstNode } from '../../tailwindcss/src/ast'

export function cssAstToPostCssAst(ast: AstNode[]): PostCssRoot {
  let root = postcss.root()

  function transform(node: AstNode, parent: PostCssContainerNode) {
    // Declaration
    if (node.kind === 'declaration') {
      let astNode = postcss.decl({
        prop: node.property,
        value: node.value ?? '',
        important: node.important,
      })
      parent.append(astNode)
    }

    // Rule
    else if (node.kind === 'rule') {
      let astNode = postcss.rule({ selector: node.selector })
      parent.append(astNode)
      for (let child of node.nodes) {
        transform(child, astNode)
      }
    }

    // AtRule
    else if (node.kind === 'at-rule') {
      let astNode = postcss.atRule({ name: node.name.slice(1), params: node.params })
      parent.append(astNode)
      for (let child of node.nodes) {
        transform(child, astNode)
      }
    }

    // Comment
    else if (node.kind === 'comment') {
      let astNode = postcss.comment({ text: node.value })
      parent.append(astNode)
    }

    // AtRoot & Context should not happen
    else if (node.kind === 'at-root' || node.kind === 'context') {
    }

    // Unknown
    else {
      node satisfies never
    }
  }

  for (let node of ast) {
    transform(node, root)
  }

  return root
}

export function postCssAstToCssAst(root: PostCssRoot): AstNode[] {
  function transform(
    node: PostCssChildNode,
    parent: Extract<AstNode, { nodes: AstNode[] }>['nodes'],
  ) {
    // Declaration
    if (node.type === 'decl') {
      parent.push(decl(node.prop, node.value, node.important))
    }

    // Rule
    else if (node.type === 'rule') {
      let astNode = rule(node.selector)
      node.each((child) => transform(child, astNode.nodes))
      parent.push(astNode)
    }

    // AtRule
    else if (node.type === 'atrule') {
      let astNode = atRule(`@${node.name}`, node.params)
      node.each((child) => transform(child, astNode.nodes))
      parent.push(astNode)
    }

    // Comment
    else if (node.type === 'comment') {
      parent.push(comment(node.text))
    }

    // Unknown
    else {
      node satisfies never
    }
  }

  let ast: AstNode[] = []
  root.each((node) => transform(node, ast))

  return ast
}
