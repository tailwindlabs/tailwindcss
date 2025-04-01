import { expect, it } from 'vitest'
import {
  atRule,
  context,
  decl,
  optimizeAst,
  styleRule,
  toCss,
  walk,
  WalkAction,
  type AstNode,
} from './ast'
import * as CSS from './css-parser'
import { buildDesignSystem } from './design-system'
import { Theme } from './theme'

const css = String.raw
const defaultDesignSystem = buildDesignSystem(new Theme())

it('should pretty print an AST', () => {
  expect(toCss(optimizeAst(CSS.parse('.foo{color:red;&:hover{color:blue;}}'), defaultDesignSystem)))
    .toMatchInlineSnapshot(`
    ".foo {
      color: red;
      &:hover {
        color: blue;
      }
    }
    "
  `)
})

it('allows the placement of context nodes', () => {
  const ast = [
    styleRule('.foo', [decl('color', 'red')]),
    context({ context: 'a' }, [
      styleRule('.bar', [
        decl('color', 'blue'),
        context({ context: 'b' }, [
          //
          styleRule('.baz', [decl('color', 'green')]),
        ]),
      ]),
    ]),
  ]

  let redContext
  let blueContext
  let greenContext

  walk(ast, (node, { context }) => {
    if (node.kind !== 'declaration') return
    switch (node.value) {
      case 'red':
        redContext = context
        break
      case 'blue':
        blueContext = context
        break
      case 'green':
        greenContext = context
        break
    }
  })

  expect(redContext).toEqual({})
  expect(blueContext).toEqual({ context: 'a' })
  expect(greenContext).toEqual({ context: 'b' })

  expect(toCss(optimizeAst(ast, defaultDesignSystem))).toMatchInlineSnapshot(`
    ".foo {
      color: red;
    }
    .bar {
      color: blue;
      .baz {
        color: green;
      }
    }
    "
  `)
})

it('should stop walking when returning `WalkAction.Stop`', () => {
  let ast = [
    styleRule('.foo', [styleRule('.nested', [styleRule('.bail', [decl('color', 'red')])])]),
    styleRule('.bar'),
    styleRule('.baz'),
    styleRule('.qux'),
  ]

  let seen = new Set()

  walk(ast, (node) => {
    if (node.kind === 'rule') {
      seen.add(node.selector)
    }

    if (node.kind === 'rule' && node.selector === '.bail') {
      return WalkAction.Stop
    }
  })

  // We do not want to see `.bar`, `.baz`, or `.qux` because we bailed early
  expect(seen).toMatchInlineSnapshot(`
    Set {
      ".foo",
      ".nested",
      ".bail",
    }
  `)
})

it('should not emit empty rules once optimized', () => {
  let ast = CSS.parse(css`
    /* Empty rule */
    .foo {
    }

    /* Empty rule, with nesting */
    .foo {
      .bar {
      }
      .baz {
      }
    }

    /* Empty rule, with special case '&' rules */
    .foo {
      & {
        &:hover {
        }
        &:focus {
        }
      }
    }

    /* Empty at-rule */
    @media (min-width: 768px) {
    }

    /* Empty at-rule with nesting*/
    @media (min-width: 768px) {
      .foo {
      }

      @media (min-width: 1024px) {
        .bar {
        }
      }
    }

    /* Exceptions: */
    @charset "UTF-8";
    @layer foo, bar, baz;
    @custom-media --modern (color), (hover);
    @namespace 'http://www.w3.org/1999/xhtml';
    @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
  `)

  expect(toCss(ast)).toMatchInlineSnapshot(`
    ".foo {
    }
    .foo {
      .bar {
      }
      .baz {
      }
    }
    .foo {
      & {
        &:hover {
        }
        &:focus {
        }
      }
    }
    @media (min-width: 768px);
    @media (min-width: 768px) {
      .foo {
      }
      @media (min-width: 1024px) {
        .bar {
        }
      }
    }
    @charset "UTF-8";
    @layer foo, bar, baz;
    @custom-media --modern (color), (hover);
    @namespace 'http://www.w3.org/1999/xhtml';
    @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
    "
  `)

  expect(toCss(optimizeAst(ast, defaultDesignSystem))).toMatchInlineSnapshot(`
    "@charset "UTF-8";
    @layer foo, bar, baz;
    @custom-media --modern (color), (hover);
    @namespace 'http://www.w3.org/1999/xhtml';
    @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');
    "
  `)
})

it('should only visit children once when calling `replaceWith` with single element array', () => {
  let visited = new Set()

  let ast = [
    atRule('@media', '', [styleRule('.foo', [decl('color', 'blue')])]),
    styleRule('.bar', [decl('color', 'blue')]),
  ]

  walk(ast, (node, { replaceWith }) => {
    if (visited.has(node)) {
      throw new Error('Visited node twice')
    }
    visited.add(node)

    if (node.kind === 'at-rule') replaceWith(node.nodes)
  })
})

it('should only visit children once when calling `replaceWith` with multi-element array', () => {
  let visited = new Set()

  let ast = [
    atRule('@media', '', [
      context({}, [
        styleRule('.foo', [decl('color', 'red')]),
        styleRule('.baz', [decl('color', 'blue')]),
      ]),
    ]),
    styleRule('.bar', [decl('color', 'green')]),
  ]

  walk(ast, (node, { replaceWith }) => {
    let key = id(node)
    if (visited.has(key)) {
      throw new Error('Visited node twice')
    }
    visited.add(key)

    if (node.kind === 'at-rule') replaceWith(node.nodes)
  })

  expect(visited).toMatchInlineSnapshot(`
    Set {
      "@media ",
      ".foo",
      "color: red",
      ".baz",
      "color: blue",
      ".bar",
      "color: green",
    }
  `)
})

it('should never visit children when calling `replaceWith` with `WalkAction.Skip`', () => {
  let visited = new Set()

  let inner = styleRule('.foo', [decl('color', 'blue')])

  let ast = [atRule('@media', '', [inner]), styleRule('.bar', [decl('color', 'blue')])]

  walk(ast, (node, { replaceWith }) => {
    visited.add(node)

    if (node.kind === 'at-rule') {
      replaceWith(node.nodes)
      return WalkAction.Skip
    }
  })

  expect(visited).not.toContain(inner)
  expect(visited).toMatchInlineSnapshot(`
    Set {
      {
        "kind": "at-rule",
        "name": "@media",
        "nodes": [
          {
            "kind": "rule",
            "nodes": [
              {
                "important": false,
                "kind": "declaration",
                "property": "color",
                "value": "blue",
              },
            ],
            "selector": ".foo",
          },
        ],
        "params": "",
      },
      {
        "kind": "rule",
        "nodes": [
          {
            "important": false,
            "kind": "declaration",
            "property": "color",
            "value": "blue",
          },
        ],
        "selector": ".bar",
      },
      {
        "important": false,
        "kind": "declaration",
        "property": "color",
        "value": "blue",
      },
    }
  `)
})

it('should skip the correct number of children based on the the replaced children nodes', () => {
  {
    let ast = [
      decl('--index', '0'),
      decl('--index', '1'),
      decl('--index', '2'),
      decl('--index', '3'),
      decl('--index', '4'),
    ]
    let visited: string[] = []
    walk(ast, (node, { replaceWith }) => {
      visited.push(id(node))
      if (node.kind === 'declaration' && node.value === '2') {
        replaceWith([])
        return WalkAction.Skip
      }
    })

    expect(visited).toMatchInlineSnapshot(`
      [
        "--index: 0",
        "--index: 1",
        "--index: 2",
        "--index: 3",
        "--index: 4",
      ]
    `)
  }

  {
    let ast = [
      decl('--index', '0'),
      decl('--index', '1'),
      decl('--index', '2'),
      decl('--index', '3'),
      decl('--index', '4'),
    ]
    let visited: string[] = []
    walk(ast, (node, { replaceWith }) => {
      visited.push(id(node))
      if (node.kind === 'declaration' && node.value === '2') {
        replaceWith([])
        return WalkAction.Continue
      }
    })

    expect(visited).toMatchInlineSnapshot(`
      [
        "--index: 0",
        "--index: 1",
        "--index: 2",
        "--index: 3",
        "--index: 4",
      ]
    `)
  }

  {
    let ast = [
      decl('--index', '0'),
      decl('--index', '1'),
      decl('--index', '2'),
      decl('--index', '3'),
      decl('--index', '4'),
    ]
    let visited: string[] = []
    walk(ast, (node, { replaceWith }) => {
      visited.push(id(node))
      if (node.kind === 'declaration' && node.value === '2') {
        replaceWith([decl('--index', '2.1')])
        return WalkAction.Skip
      }
    })

    expect(visited).toMatchInlineSnapshot(`
      [
        "--index: 0",
        "--index: 1",
        "--index: 2",
        "--index: 3",
        "--index: 4",
      ]
    `)
  }

  {
    let ast = [
      decl('--index', '0'),
      decl('--index', '1'),
      decl('--index', '2'),
      decl('--index', '3'),
      decl('--index', '4'),
    ]
    let visited: string[] = []
    walk(ast, (node, { replaceWith }) => {
      visited.push(id(node))
      if (node.kind === 'declaration' && node.value === '2') {
        replaceWith([decl('--index', '2.1')])
        return WalkAction.Continue
      }
    })

    expect(visited).toMatchInlineSnapshot(`
      [
        "--index: 0",
        "--index: 1",
        "--index: 2",
        "--index: 2.1",
        "--index: 3",
        "--index: 4",
      ]
    `)
  }

  {
    let ast = [
      decl('--index', '0'),
      decl('--index', '1'),
      decl('--index', '2'),
      decl('--index', '3'),
      decl('--index', '4'),
    ]
    let visited: string[] = []
    walk(ast, (node, { replaceWith }) => {
      visited.push(id(node))
      if (node.kind === 'declaration' && node.value === '2') {
        replaceWith([decl('--index', '2.1'), decl('--index', '2.2')])
        return WalkAction.Skip
      }
    })

    expect(visited).toMatchInlineSnapshot(`
      [
        "--index: 0",
        "--index: 1",
        "--index: 2",
        "--index: 3",
        "--index: 4",
      ]
    `)
  }

  {
    let ast = [
      decl('--index', '0'),
      decl('--index', '1'),
      decl('--index', '2'),
      decl('--index', '3'),
      decl('--index', '4'),
    ]
    let visited: string[] = []
    walk(ast, (node, { replaceWith }) => {
      visited.push(id(node))
      if (node.kind === 'declaration' && node.value === '2') {
        replaceWith([decl('--index', '2.1'), decl('--index', '2.2')])
        return WalkAction.Continue
      }
    })

    expect(visited).toMatchInlineSnapshot(`
      [
        "--index: 0",
        "--index: 1",
        "--index: 2",
        "--index: 2.1",
        "--index: 2.2",
        "--index: 3",
        "--index: 4",
      ]
    `)
  }
})

function id(node: AstNode) {
  switch (node.kind) {
    case 'at-rule':
      return `${node.name} ${node.params}`
    case 'rule':
      return node.selector
    case 'context':
      return '<context>'
    case 'at-root':
      return '<at-root>'
    case 'declaration':
      return `${node.property}: ${node.value}`
    case 'comment':
      return `// ${node.value}`
    default:
      node satisfies never
      throw new Error('Unknown node kind')
  }
}
