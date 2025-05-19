import postcss, {
  Input,
  type ChildNode as PostCssChildNode,
  type Container as PostCssContainerNode,
  type Root as PostCssRoot,
  type Source as PostcssSource,
} from 'postcss'
import { atRule, comment, decl, rule, type AstNode } from '../../tailwindcss/src/ast'
import { createLineTable, type LineTable } from '../../tailwindcss/src/source-maps/line-table'
import type { Source, SourceLocation } from '../../tailwindcss/src/source-maps/source'
import { DefaultMap } from '../../tailwindcss/src/utils/default-map'

const EXCLAMATION_MARK = 0x21

export function cssAstToPostCssAst(ast: AstNode[], source: PostcssSource | undefined): PostCssRoot {
  let inputMap = new DefaultMap<Source, Input>((src) => {
    return new Input(src.code, {
      map: source?.input.map,
      from: src.file ?? undefined,
    })
  })

  let lineTables = new DefaultMap<Source, LineTable>((src) => createLineTable(src.code))

  let root = postcss.root()
  root.source = source

  function toSource(loc: SourceLocation | undefined): PostcssSource | undefined {
    // Use the fallback if this node has no location info in the AST
    if (!loc) return
    if (!loc[0]) return

    let table = lineTables.get(loc[0])
    let start = table.find(loc[1])
    let end = table.find(loc[2])

    return {
      input: inputMap.get(loc[0]),
      start: {
        line: start.line,
        column: start.column + 1,
        offset: loc[1],
      },
      end: {
        line: end.line,
        column: end.column + 1,
        offset: loc[2],
      },
    }
  }

  function updateSource(astNode: PostCssChildNode, loc: SourceLocation | undefined) {
    let source = toSource(loc)

    // The `source` property on PostCSS nodes must be defined if present because
    // `toJSON()` reads each property and tries to read from source.input if it
    // sees a `source` property. This means for a missing or otherwise absent
    // source it must be *missing* from the object rather than just `undefined`
    if (source) {
      astNode.source = source
    } else {
      delete astNode.source
    }
  }

  function transform(node: AstNode, parent: PostCssContainerNode) {
    // Declaration
    if (node.kind === 'declaration') {
      let astNode = postcss.decl({
        prop: node.property,
        value: node.value ?? '',
        important: node.important,
      })
      updateSource(astNode, node.src)
      parent.append(astNode)
    }

    // Rule
    else if (node.kind === 'rule') {
      let astNode = postcss.rule({ selector: node.selector })
      updateSource(astNode, node.src)
      astNode.raws.semicolon = true
      parent.append(astNode)
      for (let child of node.nodes) {
        transform(child, astNode)
      }
    }

    // AtRule
    else if (node.kind === 'at-rule') {
      let astNode = postcss.atRule({ name: node.name.slice(1), params: node.params })
      updateSource(astNode, node.src)
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
      updateSource(astNode, node.src)
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
  let inputMap = new DefaultMap<Input, Source>((input) => ({
    file: input.file ?? input.id ?? null,
    code: input.css,
  }))

  function toSource(node: PostCssChildNode): SourceLocation | undefined {
    let source = node.source
    if (!source) return

    let input = source.input
    if (!input) return
    if (source.start === undefined) return
    if (source.end === undefined) return

    return [inputMap.get(input), source.start.offset, source.end.offset]
  }

  function transform(
    node: PostCssChildNode,
    parent: Extract<AstNode, { nodes: AstNode[] }>['nodes'],
  ) {
    // Declaration
    if (node.type === 'decl') {
      let astNode = decl(node.prop, node.value, node.important)
      astNode.src = toSource(node)
      parent.push(astNode)
    }

    // Rule
    else if (node.type === 'rule') {
      let astNode = rule(node.selector)
      astNode.src = toSource(node)
      node.each((child) => transform(child, astNode.nodes))
      parent.push(astNode)
    }

    // AtRule
    else if (node.type === 'atrule') {
      let astNode = atRule(`@${node.name}`, node.params)
      astNode.src = toSource(node)
      node.each((child) => transform(child, astNode.nodes))
      parent.push(astNode)
    }

    // Comment
    else if (node.type === 'comment') {
      if (node.text.charCodeAt(0) !== EXCLAMATION_MARK) return
      let astNode = comment(node.text)
      astNode.src = toSource(node)
      parent.push(astNode)
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
