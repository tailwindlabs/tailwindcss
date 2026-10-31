import dedent from 'dedent'
import { assert, expect, test } from 'vitest'
import { toCss, type AstNode } from '../ast'
import * as CSS from '../css-parser'
import { createTranslationMap } from './source-map'
import { visualizeSourceMapRanges, type SourceMapVisualizationRange } from './visualize-source-map'

async function analyze(input: string) {
  let ast = CSS.parse(input, { from: 'input.css' })
  let css = toCss(ast, true)
  let translate = createTranslationMap({
    original: input,
    generated: css,
  })

  function format(node: AstNode) {
    let ranges: SourceMapVisualizationRange[] = []

    for (let [oStart, oEnd, gStart, gEnd] of translate(node)) {
      ranges.push({
        original: {
          source: 'input.css',
          start: [oStart.line, oStart.column],
          end: [oEnd.line, oEnd.column],
        },
        generated:
          gStart && gEnd
            ? {
                start: [gStart.line, gStart.column],
                end: [gEnd.line, gEnd.column],
              }
            : null,
      })
    }

    return visualizeSourceMapRanges({ 'input.css': input }, css, ranges)
  }

  return { ast, css, format }
}

test('comment, single line', async () => {
  let { ast, css, format } = await analyze(`/*! foo */`)

  assert(ast[0].kind === 'comment')
  expect(format(ast[0])).toMatchInlineSnapshot(`
    "
       output.css            |    input.css
                             | 
    1  /*! foo */            | 1  /*! foo */
       ^^^^^^^^^^ A @ 1:0-10 |    ^^^^^^^^^^ A @ 1:0-10
    2                        | 
    "
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
    "
       output.css           |    input.css
                            | 
    1  /*! foo              | 1  /*! foo 
       ^^^^^^^^ A @ 1:0-2:7 |    ^^^^^^^^ A @ 1:0-2:7
    2   bar */              | 2   bar */
       ^^^^^^^ A            |    ^^^^^^^ A
    3                       | 
    "
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
    "
       output.css              |    input.css
                               | 
    1  .foo {                  | 
    2    color: red;           | 1  .foo { color: red; }
         ^^^^^^^^^^ A @ 2:2-12 |           ^^^^^^^^^^ A @ 1:7-17
    3  }                       | 
    4                          | 
    "
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
    "
       output.css                                                |    input.css
                                                                 | 
    1  .foo {                                                    | 
    2    grid-template-areas: "a b c" "d e f" "g h i";           | 2    grid-template-areas:
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ A @ 2:2-46 |      ^^^^^^^^^^^^^^^^^^^^ A @ 2:2-5:11
                                                                 | 3      "a b c"
                                                                 |    ^^^^^^^^^^^ A
                                                                 | 4      "d e f"
                                                                 |    ^^^^^^^^^^^ A
                                                                 | 5      "g h i";
                                                                 |    ^^^^^^^^^^^ A
                                                                 | 6  }
    3  }                                                         | 
    4                                                            | 
    "
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
    "
       output.css              |    input.css
                               | 
    1  .foo {                  | 
    2    --foo: bar;           | 1  .foo { --foo: bar; }
         ^^^^^^^^^^ A @ 2:2-12 |           ^^^^^^^^^^ A @ 1:7-17
    3  }                       | 
    4                          | 
    "
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
    "
       output.css               |    input.css
                                | 
    1  .foo {                   | 
    2    --foo: bar             | 2    --foo: bar
         ^^^^^^^^^^ A @ 2:2-3:3 |      ^^^^^^^^^^ A @ 2:2-3:3
    3  baz;                     | 3  baz;
       ^^^ A                    |    ^^^ A
                                | 4  }
    4  }                        | 
    5                           | 
    "
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
    "
       output.css                 |    input.css
                                  | 
    1  @layer foo, bar;           | 1  @layer foo,     bar;
       ^^^^^^^^^^^^^^^ A @ 1:0-15 |    ^^^^^^^^^^^^^^^^^^^ A @ 1:0-19
    2                             | 
    "
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
    "
       output.css                 |    input.css
                                  | 
    1  @layer foo, bar;           | 1  @layer
       ^^^^^^^^^^^^^^^ A @ 1:0-15 |    ^^^^^^ A @ 1:0-4:0
                                  | 2    foo,
                                  |    ^^^^^^ A
                                  | 3    bar
                                  |    ^^^^^ A
    2                             | 
    "
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
    "
       output.css             |    input.css
                              | 
    1  @layer foo {           | 1  @layer foo { color: red; }
       ^^^^^^^^^^^ A @ 1:0-11 |    ^^^^^^^^^^^ A @ 1:0-11
    2    color: red;          | 
    3  }                      | 
    4                         | 
    "
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
    "
       output.css             |    input.css
                              | 
    1  @layer foo {           | 1  @layer
       ^^^^^^^^^^^ A @ 1:0-11 |    ^^^^^^ A @ 1:0-3:0
                              | 2    foo
                              |    ^^^^^ A
    2    color: baz;          | 
    3  }                      | 
    4                         | 
    "
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
    "
       output.css                |    input.css
                                 | 
    1  .foo:is(.bar) {           | 1  .foo:is(.bar) { color: red; }
       ^^^^^^^^^^^^^^ A @ 1:0-14 |    ^^^^^^^^^^^^^^ A @ 1:0-14
    2    color: red;             | 
    3  }                         | 
    4                            | 
    "
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
    "
       output.css                  |    input.css
                                   | 
    1  .foo:is( .bar ) {           | 1  .foo:is(
       ^^^^^^^^^^^^^^^^ A @ 1:0-16 |    ^^^^^^^^ A @ 1:0-3:2
                                   | 2    .bar
                                   |    ^^^^^^ A
                                   | 3  ) {
                                   |    ^^ A
    2    color: red;               | 
    3  }                           | 
    4                              | 
    "
  `)

  expect(css).toMatchInlineSnapshot(`
    ".foo:is( .bar ) {
      color: red;
    }
    "
  `)
})
