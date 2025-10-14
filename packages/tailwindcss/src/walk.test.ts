import { describe, expect, test } from 'vitest'
import { decl, rule, toCss, type AstNode as CSSAstNode } from './ast'
import { walk, WalkAction } from './walk'

type AstNode = { kind: string } | { kind: string; nodes: AstNode[] }

describe('AST Enter (function)', () => {
  test('visit all nodes in an AST', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, (node) => {
      visited.push(node.kind)
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'])
  })

  test('visit all nodes in an AST and calculate their path', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let paths: string[] = []
    walk(ast, (node, ctx) => {
      let path = ctx.path().map((n) => n.kind)
      if (path.length === 0) path.unshift('ø')
      path.push(node.kind)

      paths.push(path.join(' → ') || 'ø')
    })

    expect(`\n${paths.join('\n')}\n`).toMatchInlineSnapshot(`
      "
      ø → a
      a → b
      a → b → c
      a → d
      a → d → e
      a → d → e → f
      a → g
      a → g → h
      ø → i
      "
    `)
  })

  test("skip a node's children (first node)", () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, (node) => {
      visited.push(node.kind)

      if (node.kind === 'b') {
        return WalkAction.Skip
      }
    })

    expect(visited).toEqual(['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i'])
  })

  test("skip a node's children (middle node)", () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, (node) => {
      visited.push(node.kind)

      if (node.kind === 'd') {
        return WalkAction.Skip
      }
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'g', 'h', 'i'])
  })

  test("skip a node's children (last node)", () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, (node) => {
      visited.push(node.kind)

      if (node.kind === 'g') {
        return WalkAction.Skip
      }
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'i'])
  })

  test('stop entirely', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, (node) => {
      visited.push(node.kind)

      if (node.kind === 'd') {
        return WalkAction.Stop
      }
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd'])
  })

  test('replace a node, and visit the replacements', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, (node) => {
      visited.push(node.kind)

      if (node.kind === 'd') {
        return WalkAction.Replace([
          { kind: 'e1', nodes: [{ kind: 'f1' }] },
          { kind: 'e2', nodes: [{ kind: 'f2' }] },
        ])
      }
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
  })

  test('replace a node, and not visit the replacements', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, (node) => {
      visited.push(node.kind)

      if (node.kind === 'd') {
        return WalkAction.ReplaceSkip([
          { kind: 'e1', nodes: [{ kind: 'f1' }] },
          { kind: 'e2', nodes: [{ kind: 'f2' }] },
        ])
      }
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'g', 'h', 'i'])

    // Let's walk the mutated AST again, to ensure that we properly replaced the
    // node with new nodes.
    visited.splice(0)
    walk(ast, (node) => {
      visited.push(node.kind)
    })

    expect(visited).toEqual(['a', 'b', 'c', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
  })

  test('replace a leaf node, and visit the replacements', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, (node) => {
      visited.push(node.kind)

      if (node.kind === 'f') {
        return WalkAction.Replace([
          { kind: 'foo1', nodes: [{ kind: 'bar1' }] },
          { kind: 'foo2', nodes: [{ kind: 'bar2' }] },
        ])
      }
    })

    expect(visited).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'foo1',
      'bar1',
      'foo2',
      'bar2',
      'g',
      'h',
      'i',
    ])
  })

  test('replace a leaf node, and not visit the replacements', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, (node) => {
      visited.push(node.kind)

      if (node.kind === 'f') {
        return WalkAction.ReplaceSkip([
          { kind: 'foo1', nodes: [{ kind: 'bar1' }] },
          { kind: 'foo2', nodes: [{ kind: 'bar2' }] },
        ])
      }
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'])

    // Let's walk the mutated AST again, to ensure that we properly replaced the
    // node with new nodes.
    visited.splice(0)
    walk(ast, (node) => {
      visited.push(node.kind)
    })

    expect(visited).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
      'foo1',
      'bar1',
      'foo2',
      'bar2',
      'g',
      'h',
      'i',
    ])
  })

  test('replace a node, and stop the walk entirely', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, (node) => {
      visited.push(node.kind)

      if (node.kind === 'd') {
        return WalkAction.ReplaceStop([
          { kind: 'e1', nodes: [{ kind: 'f1' }] },
          { kind: 'e2', nodes: [{ kind: 'f2' }] },
        ])
      }
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd'])

    // Let's walk the mutated AST again, to ensure that we properly replaced the
    // node with new nodes.
    visited.splice(0)
    walk(ast, (node) => {
      visited.push(node.kind)
    })

    expect(visited).toEqual(['a', 'b', 'c', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
  })
})

describe('AST Enter (obj)', () => {
  test('visit all nodes in an AST', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node) {
        visited.push(node.kind)
      },
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'])
  })

  test('visit all nodes in an AST and calculate their path', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let paths: string[] = []
    walk(ast, {
      enter(node, ctx) {
        let path = ctx.path().map((n) => n.kind)
        if (path.length === 0) path.unshift('ø')
        path.push(node.kind)

        paths.push(path.join(' → ') || 'ø')
      },
    })

    expect(`\n${paths.join('\n')}\n`).toMatchInlineSnapshot(`
      "
      ø → a
      a → b
      a → b → c
      a → d
      a → d → e
      a → d → e → f
      a → g
      a → g → h
      ø → i
      "
    `)
  })

  test("skip a node's children (first node)", () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node) {
        visited.push(node.kind)

        if (node.kind === 'b') {
          return WalkAction.Skip
        }
      },
    })

    expect(visited).toEqual(['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i'])
  })

  test("skip a node's children (middle node)", () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node) {
        visited.push(node.kind)

        if (node.kind === 'd') {
          return WalkAction.Skip
        }
      },
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'g', 'h', 'i'])
  })

  test("skip a node's children (last node)", () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node) {
        visited.push(node.kind)

        if (node.kind === 'g') {
          return WalkAction.Skip
        }
      },
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'i'])
  })

  test('stop entirely', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node) {
        visited.push(node.kind)

        if (node.kind === 'd') {
          return WalkAction.Stop
        }
      },
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd'])
  })

  test('replace a node, and visit the replacements', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node) {
        visited.push(node.kind)

        if (node.kind === 'd') {
          return WalkAction.Replace([
            { kind: 'e1', nodes: [{ kind: 'f1' }] },
            { kind: 'e2', nodes: [{ kind: 'f2' }] },
          ])
        }
      },
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
  })

  test('replace a node, and not visit the replacements', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node) {
        visited.push(node.kind)

        if (node.kind === 'd') {
          return WalkAction.ReplaceSkip([
            { kind: 'e1', nodes: [{ kind: 'f1' }] },
            { kind: 'e2', nodes: [{ kind: 'f2' }] },
          ])
        }
      },
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'g', 'h', 'i'])

    // Let's walk the mutated AST again, to ensure that we properly replaced the
    // node with new nodes.
    visited.splice(0)
    walk(ast, (node) => {
      visited.push(node.kind)
    })

    expect(visited).toEqual(['a', 'b', 'c', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
  })

  test('replace a leaf node, and visit the replacements', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node) {
        visited.push(node.kind)

        if (node.kind === 'f') {
          return WalkAction.Replace([
            { kind: 'foo1', nodes: [{ kind: 'bar1' }] },
            { kind: 'foo2', nodes: [{ kind: 'bar2' }] },
          ])
        }
      },
    })

    expect(visited).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'foo1',
      'bar1',
      'foo2',
      'bar2',
      'g',
      'h',
      'i',
    ])
  })

  test('replace a leaf node, and not visit the replacements', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node) {
        visited.push(node.kind)

        if (node.kind === 'f') {
          return WalkAction.ReplaceSkip([
            { kind: 'foo1', nodes: [{ kind: 'bar1' }] },
            { kind: 'foo2', nodes: [{ kind: 'bar2' }] },
          ])
        }
      },
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'])

    // Let's walk the mutated AST again, to ensure that we properly replaced the
    // node with new nodes.
    visited.splice(0)
    walk(ast, (node) => {
      visited.push(node.kind)
    })

    expect(visited).toEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
      'foo1',
      'bar1',
      'foo2',
      'bar2',
      'g',
      'h',
      'i',
    ])
  })

  test('replace a node, and stop the walk entirely', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node) {
        visited.push(node.kind)

        if (node.kind === 'd') {
          return WalkAction.ReplaceStop([
            { kind: 'e1', nodes: [{ kind: 'f1' }] },
            { kind: 'e2', nodes: [{ kind: 'f2' }] },
          ])
        }
      },
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd'])

    // Let's walk the mutated AST again, to ensure that we properly replaced the
    // node with new nodes.
    visited.splice(0)
    walk(ast, (node) => {
      visited.push(node.kind)
    })

    expect(visited).toEqual(['a', 'b', 'c', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
  })
})

describe('AST Exit (obj)', () => {
  test('visit all nodes in an AST', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      exit(node) {
        visited.push(node.kind)
      },
    })

    expect(visited).toEqual(['c', 'b', 'f', 'e', 'd', 'h', 'g', 'a', 'i'])
  })

  test('visit all nodes in an AST and calculate their path', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let paths: string[] = []
    walk(ast, {
      exit(node, ctx) {
        let path = ctx.path().map((n) => n.kind)
        if (path.length === 0) path.unshift('ø')
        path.push(node.kind)

        paths.push(path.join(' → ') || 'ø')
      },
    })

    expect(`\n${paths.join('\n')}\n`).toMatchInlineSnapshot(`
      "
      a → b → c
      a → b
      a → d → e → f
      a → d → e
      a → d
      a → g → h
      a → g
      ø → a
      ø → i
      "
    `)
  })

  test('stop entirely', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      exit(node) {
        visited.push(node.kind)

        if (node.kind === 'd') {
          return WalkAction.Stop
        }
      },
    })

    expect(visited).toEqual(['c', 'b', 'f', 'e', 'd'])
  })

  test('replace a node, and not visit the replacements', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      exit(node) {
        visited.push(node.kind)

        if (node.kind === 'd') {
          return WalkAction.Replace([
            { kind: 'e1', nodes: [{ kind: 'f1' }] },
            { kind: 'e2', nodes: [{ kind: 'f2' }] },
          ])
        }
      },
    })

    expect(visited).toEqual(['c', 'b', 'f', 'e', 'd', 'h', 'g', 'a', 'i'])

    // Let's walk the mutated AST again, to ensure that we properly replaced the
    // node with new nodes.
    visited.splice(0)
    walk(ast, (node) => {
      visited.push(node.kind)
    })

    expect(visited).toEqual(['a', 'b', 'c', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
  })

  test('replace a leaf node, and not visit the replacements', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      exit(node) {
        visited.push(node.kind)

        if (node.kind === 'f') {
          return WalkAction.Replace([{ kind: 'f1' }, { kind: 'f2' }])
        }
      },
    })

    expect(visited).toEqual(['c', 'b', 'f', 'e', 'd', 'h', 'g', 'a', 'i'])

    // Let's walk the mutated AST again, to ensure that we properly replaced the
    // node with new nodes.
    visited.splice(0)
    walk(ast, (node) => {
      visited.push(node.kind)
    })

    expect(visited).toEqual(['a', 'b', 'c', 'd', 'e', 'f1', 'f2', 'g', 'h', 'i'])
  })

  test('replace a node, and stop the walk entirely', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      exit(node) {
        visited.push(node.kind)

        if (node.kind === 'd') {
          return WalkAction.ReplaceStop([
            { kind: 'e1', nodes: [{ kind: 'f1' }] },
            { kind: 'e2', nodes: [{ kind: 'f2' }] },
          ])
        }
      },
    })

    expect(visited).toEqual(['c', 'b', 'f', 'e', 'd'])

    // Let's walk the mutated AST again, to ensure that we properly replaced the
    // node with new nodes.
    visited.splice(0)
    walk(ast, (node) => {
      visited.push(node.kind)
    })

    expect(visited).toEqual(['a', 'b', 'c', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
  })
})

describe('AST Enter & Exit', () => {
  test('visit all nodes in an AST', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let visited: string[] = []
    walk(ast, {
      enter(node, ctx) {
        visited.push(`${'  '.repeat(ctx.depth)} Enter(${node.kind})`)
      },
      exit(node, ctx) {
        visited.push(`${'  '.repeat(ctx.depth)} Exit(${node.kind})`)
      },
    })

    expect(`\n${visited.join('\n')}\n`).toMatchInlineSnapshot(`
      "
       Enter(a)
         Enter(b)
           Enter(c)
           Exit(c)
         Exit(b)
         Enter(d)
           Enter(e)
             Enter(f)
             Exit(f)
           Exit(e)
         Exit(d)
         Enter(g)
           Enter(h)
           Exit(h)
         Exit(g)
       Exit(a)
       Enter(i)
       Exit(i)
      "
    `)
  })

  test('visit all nodes in an AST and calculate their path', () => {
    let ast: AstNode[] = [
      {
        kind: 'a',
        nodes: [
          { kind: 'b', nodes: [{ kind: 'c' }] },
          { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
          { kind: 'g', nodes: [{ kind: 'h' }] },
        ],
      },
      { kind: 'i' },
    ]

    let paths: string[] = []
    walk(ast, {
      enter(node, ctx) {
        let path = ctx.path().map((n) => n.kind)
        if (path.length === 0) path.unshift('ø')
        path.push(node.kind)

        paths.push(`Enter(${path.join(' → ') || 'ø'})`)
      },
      exit(node, ctx) {
        let path = ctx.path().map((n) => n.kind)
        if (path.length === 0) path.unshift('ø')
        path.push(node.kind)

        paths.push(`Exit(${path.join(' → ') || 'ø'})`)
      },
    })

    expect(`\n${paths.join('\n')}\n`).toMatchInlineSnapshot(`
      "
      Enter(ø → a)
      Enter(a → b)
      Enter(a → b → c)
      Exit(a → b → c)
      Exit(a → b)
      Enter(a → d)
      Enter(a → d → e)
      Enter(a → d → e → f)
      Exit(a → d → e → f)
      Exit(a → d → e)
      Exit(a → d)
      Enter(a → g)
      Enter(a → g → h)
      Exit(a → g → h)
      Exit(a → g)
      Exit(ø → a)
      Enter(ø → i)
      Exit(ø → i)
      "
    `)
  })

  test('"real" world use case', () => {
    let ast: CSSAstNode[] = [
      rule('.example', [
        decl('margin-top', '12px'),
        decl('padding', '8px'),
        decl('margin', '16px 18px'),
        decl('colors', 'red'),
      ]),
    ]

    walk(ast, {
      enter(node) {
        // Expand `margin` shorthand into multiple properties
        if (node.kind === 'declaration' && node.property === 'margin' && node.value) {
          let [y, x] = node.value.split(' ')
          return WalkAction.Replace([
            decl('margin-top', y),
            decl('margin-bottom', y),
            decl('margin-left', x),
            decl('margin-right', x),
          ])
        }

        // These properties should not be uppercased, so skip them
        else if (node.kind === 'declaration' && node.property === 'colors' && node.value) {
          return WalkAction.ReplaceSkip([
            decl('color', node.value),
            decl('background-color', node.value),
            decl('border-color', node.value),
          ])
        }

        // Make all properties uppercase (this should see the expanded margin properties as well)
        // but it should not see the `color` property as we skipped it above.
        else if (node.kind === 'declaration') {
          node.property = node.property.toUpperCase()
        }
      },

      exit(node) {
        // Sort declarations alphabetically within a rule (this should see the
        // nodes after transformations in `enter` phase)
        if (node.kind === 'rule') {
          node.nodes.sort((a, z) => {
            if (a.kind === 'declaration' && z.kind === 'declaration') {
              return a.property.localeCompare(z.property)
            }

            // Stable sort
            return 0
          })
        }
      },
    })

    expect(toCss(ast)).toMatchInlineSnapshot(`
      ".example {
        background-color: red;
        border-color: red;
        color: red;
        MARGIN-BOTTOM: 16px;
        MARGIN-LEFT: 18px;
        MARGIN-RIGHT: 18px;
        MARGIN-TOP: 12px;
        MARGIN-TOP: 16px;
        PADDING: 8px;
      }
      "
    `)
  })

  describe('enter phase', () => {
    test('visit all nodes in an AST', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter(node) {
          visited.push(node.kind)
        },
        exit() {},
      })

      expect(visited).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'])
    })

    test("skip a node's children (first node)", () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter(node) {
          visited.push(node.kind)

          if (node.kind === 'b') {
            return WalkAction.Skip
          }
        },
        exit() {},
      })

      expect(visited).toEqual(['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i'])
    })

    test("skip a node's children (middle node)", () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter(node) {
          visited.push(node.kind)

          if (node.kind === 'd') {
            return WalkAction.Skip
          }
        },
        exit() {},
      })

      expect(visited).toEqual(['a', 'b', 'c', 'd', 'g', 'h', 'i'])
    })

    test("skip a node's children (last node)", () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter(node) {
          visited.push(node.kind)

          if (node.kind === 'g') {
            return WalkAction.Skip
          }
        },
        exit() {},
      })

      expect(visited).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'i'])
    })

    test('stop entirely', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter(node) {
          visited.push(node.kind)

          if (node.kind === 'd') {
            return WalkAction.Stop
          }
        },
        exit() {},
      })

      expect(visited).toEqual(['a', 'b', 'c', 'd'])
    })

    test('replace a node, and visit the replacements', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter(node) {
          visited.push(node.kind)

          if (node.kind === 'd') {
            return WalkAction.Replace([
              { kind: 'e1', nodes: [{ kind: 'f1' }] },
              { kind: 'e2', nodes: [{ kind: 'f2' }] },
            ])
          }
        },
        exit() {},
      })

      expect(visited).toEqual(['a', 'b', 'c', 'd', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
    })

    test('replace a node, and not visit the replacements', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter(node) {
          visited.push(node.kind)

          if (node.kind === 'd') {
            return WalkAction.ReplaceSkip([
              { kind: 'e1', nodes: [{ kind: 'f1' }] },
              { kind: 'e2', nodes: [{ kind: 'f2' }] },
            ])
          }
        },
        exit() {},
      })

      expect(visited).toEqual(['a', 'b', 'c', 'd', 'g', 'h', 'i'])

      // Let's walk the mutated AST again, to ensure that we properly replaced the
      // node with new nodes.
      visited.splice(0)
      walk(ast, (node) => {
        visited.push(node.kind)
      })

      expect(visited).toEqual(['a', 'b', 'c', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
    })

    test('replace a leaf node, and visit the replacements', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter(node) {
          visited.push(node.kind)

          if (node.kind === 'f') {
            return WalkAction.Replace([
              { kind: 'foo1', nodes: [{ kind: 'bar1' }] },
              { kind: 'foo2', nodes: [{ kind: 'bar2' }] },
            ])
          }
        },
        exit() {},
      })

      expect(visited).toEqual([
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'foo1',
        'bar1',
        'foo2',
        'bar2',
        'g',
        'h',
        'i',
      ])
    })

    test('replace a leaf node, and not visit the replacements', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter(node) {
          visited.push(node.kind)

          if (node.kind === 'f') {
            return WalkAction.ReplaceSkip([
              { kind: 'foo1', nodes: [{ kind: 'bar1' }] },
              { kind: 'foo2', nodes: [{ kind: 'bar2' }] },
            ])
          }
        },
        exit() {},
      })

      expect(visited).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'])

      // Let's walk the mutated AST again, to ensure that we properly replaced the
      // node with new nodes.
      visited.splice(0)
      walk(ast, (node) => {
        visited.push(node.kind)
      })

      expect(visited).toEqual([
        'a',
        'b',
        'c',
        'd',
        'e',
        'foo1',
        'bar1',
        'foo2',
        'bar2',
        'g',
        'h',
        'i',
      ])
    })

    test('replace a node, and stop the walk entirely', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter(node) {
          visited.push(node.kind)

          if (node.kind === 'd') {
            return WalkAction.ReplaceStop([
              { kind: 'e1', nodes: [{ kind: 'f1' }] },
              { kind: 'e2', nodes: [{ kind: 'f2' }] },
            ])
          }
        },
        exit() {},
      })

      expect(visited).toEqual(['a', 'b', 'c', 'd'])

      // Let's walk the mutated AST again, to ensure that we properly replaced the
      // node with new nodes.
      visited.splice(0)
      walk(ast, (node) => {
        visited.push(node.kind)
      })

      expect(visited).toEqual(['a', 'b', 'c', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
    })
  })

  describe('exit phase', () => {
    test('visit all nodes in an AST', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter() {},
        exit(node) {
          visited.push(node.kind)
        },
      })

      expect(visited).toEqual(['c', 'b', 'f', 'e', 'd', 'h', 'g', 'a', 'i'])
    })

    test('stop entirely', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter() {},
        exit(node) {
          visited.push(node.kind)

          if (node.kind === 'd') {
            return WalkAction.Stop
          }
        },
      })

      expect(visited).toEqual(['c', 'b', 'f', 'e', 'd'])
    })

    test('replace a node, and not visit the replacements', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter() {},
        exit(node) {
          visited.push(node.kind)

          if (node.kind === 'd') {
            return WalkAction.Replace([
              { kind: 'e1', nodes: [{ kind: 'f1' }] },
              { kind: 'e2', nodes: [{ kind: 'f2' }] },
            ])
          }
        },
      })

      expect(visited).toEqual(['c', 'b', 'f', 'e', 'd', 'h', 'g', 'a', 'i'])

      // Let's walk the mutated AST again, to ensure that we properly replaced the
      // node with new nodes.
      visited.splice(0)
      walk(ast, (node) => {
        visited.push(node.kind)
      })

      expect(visited).toEqual(['a', 'b', 'c', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
    })

    test('replace a node, and stop the walk entirely', () => {
      let ast: AstNode[] = [
        {
          kind: 'a',
          nodes: [
            { kind: 'b', nodes: [{ kind: 'c' }] },
            { kind: 'd', nodes: [{ kind: 'e', nodes: [{ kind: 'f' }] }] },
            { kind: 'g', nodes: [{ kind: 'h' }] },
          ],
        },
        { kind: 'i' },
      ]

      let visited: string[] = []
      walk(ast, {
        enter() {},
        exit(node) {
          visited.push(node.kind)

          if (node.kind === 'd') {
            return WalkAction.ReplaceStop([
              { kind: 'e1', nodes: [{ kind: 'f1' }] },
              { kind: 'e2', nodes: [{ kind: 'f2' }] },
            ])
          }
        },
      })

      expect(visited).toEqual(['c', 'b', 'f', 'e', 'd'])

      // Let's walk the mutated AST again, to ensure that we properly replaced the
      // node with new nodes.
      visited.splice(0)
      walk(ast, (node) => {
        visited.push(node.kind)
      })

      expect(visited).toEqual(['a', 'b', 'c', 'e1', 'f1', 'e2', 'f2', 'g', 'h', 'i'])
    })
  })
})
