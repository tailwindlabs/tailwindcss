import postcss, {
  type ChildNode as PostCssChildNode,
  type Container as PostCssContainerNode,
  type Root as PostCssRoot,
  type Source as PostcssSource,
} from 'postcss'
import { atRule, comment, decl, rule, type AstNode } from '../../tailwindcss/src/ast'

const EXCLAMATION_MARK = 0x21

export function cssAstToPostCssAst(ast: AstNode[], source: PostcssSource | undefined): PostCssRoot {
  let root = postcss.root()
  root.source = source

  function transform(node: AstNode, parent: PostCssContainerNode) {
    // Declaration
    if (node.kind === 'declaration') {
      let astNode = postcss.decl({
        prop: node.property,
        value: node.value ?? '',
        important: node.important,
      })
      astNode.source = source
      parent.append(astNode)
    }

    // Rule
    else if (node.kind === 'rule') {
      let astNode = postcss.rule({ selector: node.selector })
      astNode.source = source
      astNode.raws.semicolon = true
      parent.append(astNode)
      for (let child of node.nodes) {
        transform(child, astNode)
      }
    }

    // AtRule
    else if (node.kind === 'at-rule') {
      let astNode = postcss.atRule({ name: node.name.slice(1), params: node.params })
      astNode.source = source
      astNode.raws.semicolon = true
      parent.append(astNode)
      for (let child of node.nodes) {
        transform(child, astNode)
      }
    }

    // Comment
    else if (node.kind === 'comment') {
      let astNode = postcss.comment({ text: node.value })
      // Spaces are encoded in our node.value already, no need to add additional
      // spaces.
      astNode.raws.left = ''
      astNode.raws.right = ''
      astNode.source = source
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
      if (node.text.charCodeAt(0) !== EXCLAMATION_MARK) return
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
