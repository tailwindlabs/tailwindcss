import dedent from 'dedent'
import { assert, expect, test } from 'vitest'
import { toCss, type AstNode } from '../ast'
import * as CSS from '../css-parser'
import { createTranslationMap } from './source-map'

async function analyze(input: string) {
  let ast = CSS.parse(input, { from: 'input.css' })
  let css = toCss(ast, true)
  let translate = createTranslationMap({
    original: input,
    generated: css,
  })

  function format(node: AstNode) {
    let lines: string[] = []

    for (let [oStart, oEnd, gStart, gEnd] of translate(node)) {
      let src = `${oStart.line}:${oStart.column}-${oEnd.line}:${oEnd.column}`

      let dst = '(none)'

      if (gStart && gEnd) {
        dst = `${gStart.line}:${gStart.column}-${gEnd.line}:${gEnd.column}`
      }

      lines.push(`${dst} <- ${src}`)
    }

    return lines
  }

  return { ast, css, format }
}

test('comment, single line', async () => {
  let { ast, css, format } = await analyze(`/*! foo */`)

  assert(ast[0].kind === 'comment')
  expect(format(ast[0])).toMatchInlineSnapshot(`
    [
      "1:0-1:10 <- 1:0-1:10",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    "/*! foo */
    "
  `)
})

test('comment, multi line', async () => {
  let { ast, css, format } = await analyze(`/*! foo \n bar */`)

  assert(ast[0].kind === 'comment')
  expect(format(ast[0])).toMatchInlineSnapshot(`
    [
      "1:0-2:7 <- 1:0-2:7",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    "/*! foo 
     bar */
    "
  `)
})

test('declaration, normal property, single line', async () => {
  let { ast, css, format } = await analyze(`.foo { color: red; }`)

  assert(ast[0].kind === 'rule')
  assert(ast[0].nodes[0].kind === 'declaration')
  expect(format(ast[0].nodes[0])).toMatchInlineSnapshot(`
    [
      "2:2-2:12 <- 1:7-1:17",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    ".foo {
      color: red;
    }
    "
  `)
})

test('declaration, normal property, multi line', async () => {
  // Works, no changes needed
  let { ast, css, format } = await analyze(dedent`
    .foo {
      grid-template-areas:
        "a b c"
        "d e f"
        "g h i";
    }
  `)

  assert(ast[0].kind === 'rule')
  assert(ast[0].nodes[0].kind === 'declaration')
  expect(format(ast[0].nodes[0])).toMatchInlineSnapshot(`
    [
      "2:2-2:46 <- 2:2-5:11",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    ".foo {
      grid-template-areas: "a b c" "d e f" "g h i";
    }
    "
  `)
})

test('declaration, custom property, single line', async () => {
  let { ast, css, format } = await analyze(`.foo { --foo: bar; }`)

  assert(ast[0].kind === 'rule')
  assert(ast[0].nodes[0].kind === 'declaration')
  expect(format(ast[0].nodes[0])).toMatchInlineSnapshot(`
    [
      "2:2-2:12 <- 1:7-1:17",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    ".foo {
      --foo: bar;
    }
    "
  `)
})

test('declaration, custom property, multi line', async () => {
  let { ast, css, format } = await analyze(dedent`
    .foo {
      --foo: bar\nbaz;
    }
  `)

  assert(ast[0].kind === 'rule')
  assert(ast[0].nodes[0].kind === 'declaration')
  expect(format(ast[0].nodes[0])).toMatchInlineSnapshot(`
    [
      "2:2-3:3 <- 2:2-3:3",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    ".foo {
      --foo: bar
    baz;
    }
    "
  `)
})

test('at rules, bodyless, single line', async () => {
  // This intentionally has extra spaces
  let { ast, css, format } = await analyze(`@layer foo,     bar;`)

  assert(ast[0].kind === 'at-rule')
  expect(format(ast[0])).toMatchInlineSnapshot(`
    [
      "1:0-1:15 <- 1:0-1:19",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    "@layer foo, bar;
    "
  `)
})

test('at rules, bodyless, multi line', async () => {
  let { ast, css, format } = await analyze(dedent`
    @layer
      foo,
      bar
    ;
  `)

  assert(ast[0].kind === 'at-rule')
  expect(format(ast[0])).toMatchInlineSnapshot(`
    [
      "1:0-1:15 <- 1:0-4:0",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    "@layer foo, bar;
    "
  `)
})

test('at rules, body, single line', async () => {
  let { ast, css, format } = await analyze(`@layer foo { color: red; }`)

  assert(ast[0].kind === 'at-rule')
  expect(format(ast[0])).toMatchInlineSnapshot(`
    [
      "1:0-1:11 <- 1:0-1:11",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    "@layer foo {
      color: red;
    }
    "
  `)
})

test('at rules, body, multi line', async () => {
  let { ast, css, format } = await analyze(dedent`
    @layer
      foo
    {
      color: baz;
    }
  `)

  assert(ast[0].kind === 'at-rule')
  expect(format(ast[0])).toMatchInlineSnapshot(`
    [
      "1:0-1:11 <- 1:0-3:0",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    "@layer foo {
      color: baz;
    }
    "
  `)
})

test('style rules, body, single line', async () => {
  let { ast, css, format } = await analyze(`.foo:is(.bar) { color: red; }`)

  assert(ast[0].kind === 'rule')
  expect(format(ast[0])).toMatchInlineSnapshot(`
    [
      "1:0-1:14 <- 1:0-1:14",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    ".foo:is(.bar) {
      color: red;
    }
    "
  `)
})

test('style rules, body, multi line', async () => {
  // Works, no changes needed
  let { ast, css, format } = await analyze(dedent`
    .foo:is(
      .bar
    ) {
      color: red;
    }
  `)

  assert(ast[0].kind === 'rule')
  expect(format(ast[0])).toMatchInlineSnapshot(`
    [
      "1:0-1:16 <- 1:0-3:2",
    ]
  `)

  expect(css).toMatchInlineSnapshot(`
    ".foo:is( .bar ) {
      color: red;
    }
    "
  `)
})
