import dedent from 'dedent'
import { SourceMapGenerator, type RawSourceMap } from 'source-map-js'
import { expect, test } from 'vitest'
import { visualizeSourceMap, visualizeSourceMapRanges } from './visualize-source-map'

const css = dedent

function sourceMap({
  sources,
  mappings,
}: {
  sources: Record<string, string>
  mappings: {
    source: string
    original: [line: number, column: number]
    generated: [line: number, column: number]
  }[]
}) {
  let generator = new SourceMapGenerator()

  for (let mapping of mappings) {
    generator.addMapping({
      source: mapping.source,
      original: {
        line: mapping.original[0],
        column: mapping.original[1],
      },
      generated: {
        line: mapping.generated[0],
        column: mapping.generated[1],
      },
    })
  }

  for (let [source, content] of Object.entries(sources)) {
    generator.setSourceContent(source, content)
  }

  return JSON.parse(generator.toString()) as RawSourceMap
}

test('visualizes single-line ranges', () => {
  expect(
    visualizeSourceMapRanges(
      {
        // prettier-ignore
        'input.css': css`.foo { color: red; }`,
      },
      css`
        .foo {
          color: red;
        }
      `,
      [
        {
          original: {
            source: 'input.css',
            start: [1, 7],
            end: [1, 17],
          },
          generated: {
            start: [2, 2],
            end: [2, 12],
          },
        },
      ],
    ),
  ).toMatchInlineSnapshot(`
    "
       output.css              |    input.css
                               | 
    1  .foo {                  | 
    2    color: red;           | 1  .foo { color: red; }
         ^^^^^^^^^^ A @ 2:2-12 |           ^^^^^^^^^^ A @ 1:7-17
    3  }                       | 
    "
  `)
})

test('visualizes multi-line ranges', () => {
  expect(
    visualizeSourceMapRanges(
      {
        'input.css': css`
          /*! foo
           bar */
        `,
      },
      css`
        /*! foo
         bar */
      `,
      [
        {
          original: {
            source: 'input.css',
            start: [1, 0],
            end: [2, 7],
          },
          generated: {
            start: [1, 0],
            end: [2, 7],
          },
        },
      ],
    ),
  ).toMatchInlineSnapshot(`
    "
       output.css          |    input.css
                           | 
    1  /*! foo             | 1  /*! foo
       ^^^^^^^ A @ 1:0-2:7 |    ^^^^^^^ A @ 1:0-2:7
    2   bar */             | 2   bar */
       ^^^^^^^ A           |    ^^^^^^^ A
    "
  `)
})

test('visualizes multiple sources', () => {
  expect(
    visualizeSourceMapRanges(
      {
        'utilities.css': css`
          @tailwind utilities;
        `,
        'input.css': css`
          @utility custom {
            color: red;
          }
        `,
      },
      css`
        .flex {
          display: flex;
        }
        .custom {
          color: red;
        }
      `,
      [
        {
          original: {
            source: 'utilities.css',
            start: [1, 0],
            end: [1, 19],
          },
          generated: {
            start: [1, 0],
            end: [1, 6],
          },
        },
        {
          original: {
            source: 'utilities.css',
            start: [1, 0],
            end: [1, 19],
          },
          generated: {
            start: [2, 2],
            end: [2, 15],
          },
        },
        {
          original: {
            source: 'input.css',
            start: [2, 2],
            end: [2, 12],
          },
          generated: {
            start: [5, 2],
            end: [5, 12],
          },
        },
      ],
    ),
  ).toMatchInlineSnapshot(`
    "
       output.css                 |    original
                                  | 
                                  |    --- utilities.css ---
    1  .flex {                    | 1  @tailwind utilities;
       ^^^^^^ A @ 1:0-6           |    ^^^^^^^^^^^^^^^^^^^ A @ 1:0-19
    2    display: flex;           | 
         ^^^^^^^^^^^^^ A @ 2:2-15 | 
    3  }                          | 
    4  .custom {                  | 
                                  |    --- input.css ---
    5    color: red;              | 2    color: red;
         ^^^^^^^^^^ B @ 5:2-12    |      ^^^^^^^^^^ B @ 2:2-12
                                  | 3  }
    6  }                          | 
    "
  `)
})

test('visualizes source-map points as generated segments', () => {
  let generated = css`
    /*! foo
     bar */
  `

  expect(
    visualizeSourceMap(
      sourceMap({
        sources: {
          'input.css': css`
            /*! foo
             bar */
          `,
        },
        mappings: [
          { source: 'input.css', original: [1, 0], generated: [1, 0] },
          { source: 'input.css', original: [2, 0], generated: [2, 0] },
          { source: 'input.css', original: [2, 7], generated: [2, 7] },
        ],
      }),
      generated,
    ),
  ).toMatchInlineSnapshot(`
    "
       output.css          |    input.css
                           | 
    1  /*! foo             | 1  /*! foo
       ^^^^^^^ A @ 1:0-2:0 |    ^^^^^^^ A @ 1:0-2:0
    2   bar */             | 2   bar */
       ^^^^^^^ B @ 2:0-7   |    ^^^^^^^ B @ 2:0-7
    "
  `)
})

test('visualizes duplicate source-map points without hiding them', () => {
  expect(
    visualizeSourceMap(
      sourceMap({
        sources: {
          'input.css': css`
            aaaa
            bbbb
          `,
        },
        mappings: [
          { source: 'input.css', original: [1, 0], generated: [1, 0] },
          { source: 'input.css', original: [2, 0], generated: [1, 0] },
          { source: 'input.css', original: [2, 4], generated: [1, 4] },
        ],
      }),
      css`
        bbbb
      `,
    ),
  ).toMatchInlineSnapshot(`
    "
       output.css     |    input.css
                      | 
    1  bbbb           | 1  aaaa
       ^ A @ 1:0      |    ^ A @ 1:0
    1  bbbb           | 2  bbbb
       ^^^^ B @ 1:0-4 |    ^^^^ B @ 2:0-4
    "
  `)
})
