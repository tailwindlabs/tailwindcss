import remapping from '@jridgewell/remapping'
import dedent from 'dedent'
import MagicString from 'magic-string'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { SourceMapGenerator, type RawSourceMap } from 'source-map-js'
import { test } from 'vitest'
import { compile } from '..'
import createPlugin from '../plugin'
import { DefaultMap } from '../utils/default-map'
import type { DecodedSource, DecodedSourceMap } from './source-map'
import { visualizeSourceMap } from './visualize-source-map'
const css = dedent

interface RunOptions {
  input: string
  candidates?: string[]
  options?: Parameters<typeof compile>[1]
}

async function run({ input, candidates, options }: RunOptions) {
  let source = new MagicString(input)
  let root = path.resolve(__dirname, '../..')

  let compiler = await compile(source.toString(), {
    from: 'input.css',
    async loadStylesheet(id, base) {
      let resolvedPath = path.resolve(root, id === 'tailwindcss' ? 'index.css' : id)

      return {
        path: path.relative(root, resolvedPath),
        base,
        content: await fs.readFile(resolvedPath, 'utf-8'),
      }
    },
    ...options,
  })

  let css = compiler.build(candidates ?? [])
  let decoded = compiler.buildSourceMap()
  let rawMap = toRawSourceMap(decoded)
  let combined = remapping(rawMap, () => null)
  let map = JSON.parse(rawMap.toString()) as RawSourceMap

  let sources = combined.sources
  let annotations = visualizeSourceMap(map, css)

  return { css, map, sources, annotations }
}

function toRawSourceMap(map: DecodedSourceMap): string {
  let generator = new SourceMapGenerator()

  let id = 1
  let sourceTable = new DefaultMap<
    DecodedSource | null,
    {
      url: string
      content: string
    }
  >((src) => {
    return {
      url: src?.url ?? `<unknown ${id++}>`,
      content: src?.content ?? '<none>',
    }
  })

  for (let mapping of map.mappings) {
    let original = sourceTable.get(mapping.originalPosition?.source ?? null)

    generator.addMapping({
      generated: mapping.generatedPosition,
      original: mapping.originalPosition,
      source: original.url,
      name: mapping.name ?? undefined,
    })

    generator.setSourceContent(original.url, original.content)
  }

  return generator.toString()
}

test('source maps trace back to @import location', async ({ expect }) => {
  let { sources, annotations } = await run({
    input: css`
      @import 'tailwindcss';

      .foo {
        @apply underline;
      }
    `,
  })

  // All CSS should be mapped back to the original source file
  expect(sources).toEqual([
    //
    'index.css',
    'theme.css',
    'preflight.css',
    'input.css',
  ])
  expect(sources.length).toBe(4)

  // The output CSS should include annotations linking back to:
  // 1. The class definition `.foo`
  // 2. The `@apply underline` line inside of it
  expect(annotations).toMatchInlineSnapshot(`
    "
         output.css                                                                                      |      original
                                                                                                         | 
                                                                                                         |      --- index.css ---
      1  @layer theme, base, components, utilities;                                                      |   1  @layer theme, base, components, utilities;
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ A @ 1:0-41                                            |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ A @ 1:0-41
      2  @layer theme {                                                                                  |   3  @import './theme.css' layer(theme);
         ^^^^^^^^^^^^^ B @ 2:0-13                                                                        |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ B @ 3:0-34
                                                                                                         |      --- theme.css ---
      3    :root, :host {                                                                                |   1  @theme default {
           ^^^^^^^^^^^^^ C @ 3:2-15                                                                      |      ^^^^^^^^^^^^^^^ C @ 1:0-15
      4      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'N... |   2    --font-sans:
             ^ D @ 4:4                                                                                   |        ^ D @ 2:2
      4      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'N... |   3      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Ar...
             ^ E @ 4:4                                                                                   |      ^ E @ 3:0
      4      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'N... |   4      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... F @ 4:4-5:0 |      ^ F @ 4:0
      5      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';   |   4      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
                                                                                        ... G @ 5:92-6:0 |                                                                                         ... G @ 4:92
                                                                                                         |   5    --font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
      6      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', '... |   6    --font-mono:
             ^ H @ 6:4                                                                                   |        ^ H @ 6:2
      6      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', '... |   7      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
             ^ I @ 6:4                                                                                   |      ^ I @ 7:0
      6      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', '... |   8      monospace;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... J @ 6:4-7:0 |      ^ J @ 8:0
      7      monospace;                                                                                  |   8      monospace;
                      ^ K @ 7:13-8:0                                                                     |                   ^ K @ 8:13
      8      --default-font-family: var(--font-sans);                                                    | 494    --default-font-family: --theme(--font-sans, initial);
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ L @ 8:4-43                                          |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ L @ 494:2-54
                                                                                                         | 495    --default-font-feature-settings: --theme(--font-sans--font-feature-settings, initial);
                                                                                                         | 496    --default-font-variation-settings: --theme(--font-sans--font-variation-settings, initial);
      9      --default-mono-font-family: var(--font-mono);                                               | 497    --default-mono-font-family: --theme(--font-mono, initial);
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ M @ 9:4-48                                     |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ M @ 497:2-59
     10    }                                                                                             | 
     11  }                                                                                               | 
                                                                                                         |      --- index.css ---
     12  @layer base {                                                                                   |   4  @import './preflight.css' layer(base);
         ^^^^^^^^^^^^ N @ 12:0-12                                                                        |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ N @ 4:0-37
                                                                                                         |      --- preflight.css ---
     13    *, ::after, ::before, ::backdrop, ::file-selector-button {                                    |   7  *,
           ^ O @ 13:2                                                                                    |      ^ O @ 7:0
     13    *, ::after, ::before, ::backdrop, ::file-selector-button {                                    |   8  ::after,
           ^ P @ 13:2                                                                                    |      ^ P @ 8:0
     13    *, ::after, ::before, ::backdrop, ::file-selector-button {                                    |   9  ::before,
           ^ Q @ 13:2                                                                                    |      ^ Q @ 9:0
     13    *, ::after, ::before, ::backdrop, ::file-selector-button {                                    |  10  ::backdrop,
           ^ R @ 13:2                                                                                    |      ^ R @ 10:0
     13    *, ::after, ::before, ::backdrop, ::file-selector-button {                                    |  11  ::file-selector-button {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ S @ 13:2-59                         |      ^^^^^^^^^^^^^^^^^^^^^^^ S @ 11:0-23
     14      box-sizing: border-box;                                                                     |  12    box-sizing: border-box; /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^ T @ 14:4-26                                                          |        ^^^^^^^^^^^^^^^^^^^^^^ T @ 12:2-24
     15      margin: 0;                                                                                  |  13    margin: 0; /* 2 */
             ^^^^^^^^^ U @ 15:4-13                                                                       |        ^^^^^^^^^ U @ 13:2-11
     16      padding: 0;                                                                                 |  14    padding: 0; /* 2 */
             ^^^^^^^^^^ V @ 16:4-14                                                                      |        ^^^^^^^^^^ V @ 14:2-12
     17      border: 0 solid;                                                                            |  15    border: 0 solid; /* 3 */
             ^^^^^^^^^^^^^^^ W @ 17:4-19                                                                 |        ^^^^^^^^^^^^^^^ W @ 15:2-17
                                                                                                         |  16  }
     18    }                                                                                             | 
     19    html, :host {                                                                                 |  28  html,
           ^ X @ 19:2                                                                                    |      ^ X @ 28:0
     19    html, :host {                                                                                 |  29  :host {
           ^^^^^^^^^^^^ Y @ 19:2-14                                                                      |      ^^^^^^ Y @ 29:0-6
     20      line-height: 1.5;                                                                           |  30    line-height: 1.5; /* 1 */
             ^^^^^^^^^^^^^^^^ Z @ 20:4-20                                                                |        ^^^^^^^^^^^^^^^^ Z @ 30:2-18
     21      -webkit-text-size-adjust: 100%;                                                             |  31    -webkit-text-size-adjust: 100%; /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AA @ 21:4-34                                                 |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AA @ 31:2-32
     22      tab-size: 4;                                                                                |  32    tab-size: 4; /* 3 */
             ^^^^^^^^^^^ AB @ 22:4-15                                                                    |        ^^^^^^^^^^^ AB @ 32:2-13
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  33    font-family: --theme(
             ^ AC @ 23:4                                                                                 |        ^ AC @ 33:2
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  34      --default-font-family,
             ^ AD @ 23:4                                                                                 |      ^ AD @ 34:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  35      -apple-system,
             ^ AE @ 23:4                                                                                 |      ^ AE @ 35:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  36      BlinkMacSystemFont,
             ^ AF @ 23:4                                                                                 |      ^ AF @ 36:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  37      'Segoe UI',
             ^ AG @ 23:4                                                                                 |      ^ AG @ 37:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  38      Roboto,
             ^ AH @ 23:4                                                                                 |      ^ AH @ 38:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  39      'Helvetica Neue',
             ^ AI @ 23:4                                                                                 |      ^ AI @ 39:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  40      'Noto Sans',
             ^ AJ @ 23:4                                                                                 |      ^ AJ @ 40:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  41      Arial,
             ^ AK @ 23:4                                                                                 |      ^ AK @ 41:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  42      sans-serif,
             ^ AL @ 23:4                                                                                 |      ^ AL @ 42:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  43      'Apple Color Emoji',
             ^ AM @ 23:4                                                                                 |      ^ AM @ 43:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  44      'Segoe UI Emoji',
             ^ AN @ 23:4                                                                                 |      ^ AN @ 44:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  45      'Segoe UI Symbol',
             ^ AO @ 23:4                                                                                 |      ^ AO @ 45:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  46      'Noto Color Emoji'
             ^ AP @ 23:4                                                                                 |      ^ AP @ 46:0
     23      font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', R... |  47    ); /* 4 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... AQ @ 23:4-226 |      ^^^ AQ @ 47:0-3
     24      font-feature-settings: var(--default-font-feature-settings, normal);                        |  48    font-feature-settings: --theme(--default-font-feature-settings, normal); /* 5 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AR @ 24:4-71            |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AR @ 48:2-73
     25      font-variation-settings: var(--default-font-variation-settings, normal);                    |  49    font-variation-settings: --theme(--default-font-variation-settings, normal); /* 6 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AS @ 25:4-75        |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AS @ 49:2-77
     26      -webkit-tap-highlight-color: transparent;                                                   |  50    -webkit-tap-highlight-color: transparent; /* 7 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AT @ 26:4-44                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AT @ 50:2-42
                                                                                                         |  51  }
     27    }                                                                                             | 
     28    hr {                                                                                          |  59  hr {
           ^^^ AU @ 28:2-5                                                                               |      ^^^ AU @ 59:0-3
     29      height: 0;                                                                                  |  60    height: 0; /* 1 */
             ^^^^^^^^^ AV @ 29:4-13                                                                      |        ^^^^^^^^^ AV @ 60:2-11
     30      color: inherit;                                                                             |  61    color: inherit; /* 2 */
             ^^^^^^^^^^^^^^ AW @ 30:4-18                                                                 |        ^^^^^^^^^^^^^^ AW @ 61:2-16
     31      border-top-width: 1px;                                                                      |  62    border-top-width: 1px; /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^ AX @ 31:4-25                                                          |        ^^^^^^^^^^^^^^^^^^^^^ AX @ 62:2-23
                                                                                                         |  63  }
     32    }                                                                                             | 
     33    abbr:where([title]) {                                                                         |  69  abbr:where([title]) {
           ^^^^^^^^^^^^^^^^^^^^ AY @ 33:2-22                                                             |      ^^^^^^^^^^^^^^^^^^^^ AY @ 69:0-20
     34      -webkit-text-decoration: underline dotted;                                                  |  70    -webkit-text-decoration: underline dotted;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AZ @ 34:4-45                                      |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AZ @ 70:2-43
     35      text-decoration: underline dotted;                                                          |  71    text-decoration: underline dotted;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BA @ 35:4-37                                              |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BA @ 71:2-35
                                                                                                         |  72  }
     36    }                                                                                             | 
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  78  h1,
           ^ BB @ 37:2                                                                                   |      ^ BB @ 78:0
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  79  h2,
           ^ BC @ 37:2                                                                                   |      ^ BC @ 79:0
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  80  h3,
           ^ BD @ 37:2                                                                                   |      ^ BD @ 80:0
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  81  h4,
           ^ BE @ 37:2                                                                                   |      ^ BE @ 81:0
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  82  h5,
           ^ BF @ 37:2                                                                                   |      ^ BF @ 82:0
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  83  h6 {
           ^^^^^^^^^^^^^^^^^^^^^^^ BG @ 37:2-25                                                          |      ^^^ BG @ 83:0-3
     38      font-size: inherit;                                                                         |  84    font-size: inherit;
             ^^^^^^^^^^^^^^^^^^ BH @ 38:4-22                                                             |        ^^^^^^^^^^^^^^^^^^ BH @ 84:2-20
     39      font-weight: inherit;                                                                       |  85    font-weight: inherit;
             ^^^^^^^^^^^^^^^^^^^^ BI @ 39:4-24                                                           |        ^^^^^^^^^^^^^^^^^^^^ BI @ 85:2-22
                                                                                                         |  86  }
     40    }                                                                                             | 
     41    a {                                                                                           |  92  a {
           ^^ BJ @ 41:2-4                                                                                |      ^^ BJ @ 92:0-2
     42      color: inherit;                                                                             |  93    color: inherit;
             ^^^^^^^^^^^^^^ BK @ 42:4-18                                                                 |        ^^^^^^^^^^^^^^ BK @ 93:2-16
     43      -webkit-text-decoration: inherit;                                                           |  94    -webkit-text-decoration: inherit;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BL @ 43:4-36                                               |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BL @ 94:2-34
     44      text-decoration: inherit;                                                                   |  95    text-decoration: inherit;
             ^^^^^^^^^^^^^^^^^^^^^^^^ BM @ 44:4-28                                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^ BM @ 95:2-26
                                                                                                         |  96  }
     45    }                                                                                             | 
     46    b, strong {                                                                                   | 102  b,
           ^ BN @ 46:2                                                                                   |      ^ BN @ 102:0
     46    b, strong {                                                                                   | 103  strong {
           ^^^^^^^^^^ BO @ 46:2-12                                                                       |      ^^^^^^^ BO @ 103:0-7
     47      font-weight: bolder;                                                                        | 104    font-weight: bolder;
             ^^^^^^^^^^^^^^^^^^^ BP @ 47:4-23                                                            |        ^^^^^^^^^^^^^^^^^^^ BP @ 104:2-21
                                                                                                         | 105  }
     48    }                                                                                             | 
     49    code, kbd, samp, pre {                                                                        | 114  code,
           ^ BQ @ 49:2                                                                                   |      ^ BQ @ 114:0
     49    code, kbd, samp, pre {                                                                        | 115  kbd,
           ^ BR @ 49:2                                                                                   |      ^ BR @ 115:0
     49    code, kbd, samp, pre {                                                                        | 116  samp,
           ^ BS @ 49:2                                                                                   |      ^ BS @ 116:0
     49    code, kbd, samp, pre {                                                                        | 117  pre {
           ^^^^^^^^^^^^^^^^^^^^^ BT @ 49:2-23                                                            |      ^^^^ BT @ 117:0-4
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 118    font-family: --theme(
             ^ BU @ 50:4                                                                                 |        ^ BU @ 118:2
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 119      --default-mono-font-family,
             ^ BV @ 50:4                                                                                 |      ^ BV @ 119:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 120      ui-monospace,
             ^ BW @ 50:4                                                                                 |      ^ BW @ 120:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 121      SFMono-Regular,
             ^ BX @ 50:4                                                                                 |      ^ BX @ 121:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 122      Menlo,
             ^ BY @ 50:4                                                                                 |      ^ BY @ 122:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 123      Monaco,
             ^ BZ @ 50:4                                                                                 |      ^ BZ @ 123:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 124      Consolas,
             ^ CA @ 50:4                                                                                 |      ^ CA @ 124:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 125      'Liberation Mono',
             ^ CB @ 50:4                                                                                 |      ^ CB @ 125:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 126      'Courier New',
             ^ CC @ 50:4                                                                                 |      ^ CC @ 126:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 127      monospace
             ^ CD @ 50:4                                                                                 |      ^ CD @ 127:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 128    ); /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... CE @ 50:4-148 |      ^^^ CE @ 128:0-3
     51      font-feature-settings: var(--default-mono-font-feature-settings, normal);                   | 129    font-feature-settings: --theme(--default-mono-font-feature-settings, normal); /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CF @ 51:4-76       |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CF @ 129:2-78
     52      font-variation-settings: var(--default-mono-font-variation-settings, normal);               | 130    font-variation-settings: --theme(--default-mono-font-variation-settings, normal); /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CG @ 52:4-80   |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... CG @ 130:2-82
     53      font-size: 1em;                                                                             | 131    font-size: 1em; /* 4 */
             ^^^^^^^^^^^^^^ CH @ 53:4-18                                                                 |        ^^^^^^^^^^^^^^ CH @ 131:2-16
                                                                                                         | 132  }
     54    }                                                                                             | 
     55    small {                                                                                       | 138  small {
           ^^^^^^ CI @ 55:2-8                                                                            |      ^^^^^^ CI @ 138:0-6
     56      font-size: 80%;                                                                             | 139    font-size: 80%;
             ^^^^^^^^^^^^^^ CJ @ 56:4-18                                                                 |        ^^^^^^^^^^^^^^ CJ @ 139:2-16
                                                                                                         | 140  }
     57    }                                                                                             | 
     58    sub, sup {                                                                                    | 146  sub,
           ^ CK @ 58:2                                                                                   |      ^ CK @ 146:0
     58    sub, sup {                                                                                    | 147  sup {
           ^^^^^^^^^ CL @ 58:2-11                                                                        |      ^^^^ CL @ 147:0-4
     59      font-size: 75%;                                                                             | 148    font-size: 75%;
             ^^^^^^^^^^^^^^ CM @ 59:4-18                                                                 |        ^^^^^^^^^^^^^^ CM @ 148:2-16
     60      line-height: 0;                                                                             | 149    line-height: 0;
             ^^^^^^^^^^^^^^ CN @ 60:4-18                                                                 |        ^^^^^^^^^^^^^^ CN @ 149:2-16
     61      position: relative;                                                                         | 150    position: relative;
             ^^^^^^^^^^^^^^^^^^ CO @ 61:4-22                                                             |        ^^^^^^^^^^^^^^^^^^ CO @ 150:2-20
     62      vertical-align: baseline;                                                                   | 151    vertical-align: baseline;
             ^^^^^^^^^^^^^^^^^^^^^^^^ CP @ 62:4-28                                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^ CP @ 151:2-26
                                                                                                         | 152  }
     63    }                                                                                             | 
     64    sub {                                                                                         | 154  sub {
           ^^^^ CQ @ 64:2-6                                                                              |      ^^^^ CQ @ 154:0-4
     65      bottom: -0.25em;                                                                            | 155    bottom: -0.25em;
             ^^^^^^^^^^^^^^^ CR @ 65:4-19                                                                |        ^^^^^^^^^^^^^^^ CR @ 155:2-17
                                                                                                         | 156  }
     66    }                                                                                             | 
     67    sup {                                                                                         | 158  sup {
           ^^^^ CS @ 67:2-6                                                                              |      ^^^^ CS @ 158:0-4
     68      top: -0.5em;                                                                                | 159    top: -0.5em;
             ^^^^^^^^^^^ CT @ 68:4-15                                                                    |        ^^^^^^^^^^^ CT @ 159:2-13
                                                                                                         | 160  }
     69    }                                                                                             | 
     70    table {                                                                                       | 168  table {
           ^^^^^^ CU @ 70:2-8                                                                            |      ^^^^^^ CU @ 168:0-6
     71      text-indent: 0;                                                                             | 169    text-indent: 0; /* 1 */
             ^^^^^^^^^^^^^^ CV @ 71:4-18                                                                 |        ^^^^^^^^^^^^^^ CV @ 169:2-16
     72      border-color: inherit;                                                                      | 170    border-color: inherit; /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^ CW @ 72:4-25                                                          |        ^^^^^^^^^^^^^^^^^^^^^ CW @ 170:2-23
     73      border-collapse: collapse;                                                                  | 171    border-collapse: collapse; /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^ CX @ 73:4-29                                                      |        ^^^^^^^^^^^^^^^^^^^^^^^^^ CX @ 171:2-27
                                                                                                         | 172  }
     74    }                                                                                             | 
     75    :-moz-focusring:where(:not(iframe)) {                                                         | 178  :-moz-focusring:where(:not(iframe)) {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CY @ 75:2-38                                             |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CY @ 178:0-36
     76      outline: auto;                                                                              | 179    outline: auto;
             ^^^^^^^^^^^^^ CZ @ 76:4-17                                                                  |        ^^^^^^^^^^^^^ CZ @ 179:2-15
                                                                                                         | 180  }
     77    }                                                                                             | 
     78    progress {                                                                                    | 186  progress {
           ^^^^^^^^^ DA @ 78:2-11                                                                        |      ^^^^^^^^^ DA @ 186:0-9
     79      vertical-align: baseline;                                                                   | 187    vertical-align: baseline;
             ^^^^^^^^^^^^^^^^^^^^^^^^ DB @ 79:4-28                                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^ DB @ 187:2-26
                                                                                                         | 188  }
     80    }                                                                                             | 
     81    summary {                                                                                     | 194  summary {
           ^^^^^^^^ DC @ 81:2-10                                                                         |      ^^^^^^^^ DC @ 194:0-8
     82      display: list-item;                                                                         | 195    display: list-item;
             ^^^^^^^^^^^^^^^^^^ DD @ 82:4-22                                                             |        ^^^^^^^^^^^^^^^^^^ DD @ 195:2-20
                                                                                                         | 196  }
     83    }                                                                                             | 
     84    ol, ul, menu {                                                                                | 202  ol,
           ^ DE @ 84:2                                                                                   |      ^ DE @ 202:0
     84    ol, ul, menu {                                                                                | 203  ul,
           ^ DF @ 84:2                                                                                   |      ^ DF @ 203:0
     84    ol, ul, menu {                                                                                | 204  menu {
           ^^^^^^^^^^^^^ DG @ 84:2-15                                                                    |      ^^^^^ DG @ 204:0-5
     85      list-style: none;                                                                           | 205    list-style: none;
             ^^^^^^^^^^^^^^^^ DH @ 85:4-20                                                               |        ^^^^^^^^^^^^^^^^ DH @ 205:2-18
                                                                                                         | 206  }
     86    }                                                                                             | 
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 214  img,
           ^ DI @ 87:2                                                                                   |      ^ DI @ 214:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 215  svg,
           ^ DJ @ 87:2                                                                                   |      ^ DJ @ 215:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 216  video,
           ^ DK @ 87:2                                                                                   |      ^ DK @ 216:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 217  canvas,
           ^ DL @ 87:2                                                                                   |      ^ DL @ 217:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 218  audio,
           ^ DM @ 87:2                                                                                   |      ^ DM @ 218:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 219  iframe,
           ^ DN @ 87:2                                                                                   |      ^ DN @ 219:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 220  embed,
           ^ DO @ 87:2                                                                                   |      ^ DO @ 220:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 221  object {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DP @ 87:2-56                           |      ^^^^^^^ DP @ 221:0-7
     88      display: block;                                                                             | 222    display: block; /* 1 */
             ^^^^^^^^^^^^^^ DQ @ 88:4-18                                                                 |        ^^^^^^^^^^^^^^ DQ @ 222:2-16
     89      vertical-align: middle;                                                                     | 223    vertical-align: middle; /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^^ DR @ 89:4-26                                                         |        ^^^^^^^^^^^^^^^^^^^^^^ DR @ 223:2-24
                                                                                                         | 224  }
     90    }                                                                                             | 
     91    img, video {                                                                                  | 230  img,
           ^ DS @ 91:2                                                                                   |      ^ DS @ 230:0
     91    img, video {                                                                                  | 231  video {
           ^^^^^^^^^^^ DT @ 91:2-13                                                                      |      ^^^^^^ DT @ 231:0-6
     92      max-width: 100%;                                                                            | 232    max-width: 100%;
             ^^^^^^^^^^^^^^^ DU @ 92:4-19                                                                |        ^^^^^^^^^^^^^^^ DU @ 232:2-17
     93      height: auto;                                                                               | 233    height: auto;
             ^^^^^^^^^^^^ DV @ 93:4-16                                                                   |        ^^^^^^^^^^^^ DV @ 233:2-14
                                                                                                         | 234  }
     94    }                                                                                             | 
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 243  button,
           ^ DW @ 95:2                                                                                   |      ^ DW @ 243:0
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 244  input,
           ^ DX @ 95:2                                                                                   |      ^ DX @ 244:0
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 245  select,
           ^ DY @ 95:2                                                                                   |      ^ DY @ 245:0
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 246  optgroup,
           ^ DZ @ 95:2                                                                                   |      ^ DZ @ 246:0
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 247  textarea,
           ^ EA @ 95:2                                                                                   |      ^ EA @ 247:0
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 248  ::file-selector-button {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EB @ 95:2-68               |      ^^^^^^^^^^^^^^^^^^^^^^^ EB @ 248:0-23
     96      font: inherit;                                                                              | 249    font: inherit; /* 1 */
             ^^^^^^^^^^^^^ EC @ 96:4-17                                                                  |        ^^^^^^^^^^^^^ EC @ 249:2-15
     97      font-feature-settings: inherit;                                                             | 250    font-feature-settings: inherit; /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ED @ 97:4-34                                                 |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ED @ 250:2-32
     98      font-variation-settings: inherit;                                                           | 251    font-variation-settings: inherit; /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EE @ 98:4-36                                               |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EE @ 251:2-34
     99      letter-spacing: inherit;                                                                    | 252    letter-spacing: inherit; /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^ EF @ 99:4-27                                                        |        ^^^^^^^^^^^^^^^^^^^^^^^ EF @ 252:2-25
    100      color: inherit;                                                                             | 253    color: inherit; /* 1 */
             ^^^^^^^^^^^^^^ EG @ 100:4-18                                                                |        ^^^^^^^^^^^^^^ EG @ 253:2-16
    101      border-radius: 0;                                                                           | 254    border-radius: 0; /* 2 */
             ^^^^^^^^^^^^^^^^ EH @ 101:4-20                                                              |        ^^^^^^^^^^^^^^^^ EH @ 254:2-18
    102      background-color: transparent;                                                              | 255    background-color: transparent; /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EI @ 102:4-33                                                 |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EI @ 255:2-31
    103      opacity: 1;                                                                                 | 256    opacity: 1; /* 4 */
             ^^^^^^^^^^ EJ @ 103:4-14                                                                    |        ^^^^^^^^^^ EJ @ 256:2-12
                                                                                                         | 257  }
    104    }                                                                                             | 
    105    :where(select:is([multiple], [size])) optgroup {                                              | 263  :where(select:is([multiple], [size])) optgroup {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EK @ 105:2-49                                 |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EK @ 263:0-47
    106      font-weight: bolder;                                                                        | 264    font-weight: bolder;
             ^^^^^^^^^^^^^^^^^^^ EL @ 106:4-23                                                           |        ^^^^^^^^^^^^^^^^^^^ EL @ 264:2-21
                                                                                                         | 265  }
    107    }                                                                                             | 
    108    :where(select:is([multiple], [size])) optgroup option {                                       | 271  :where(select:is([multiple], [size])) optgroup option {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EM @ 108:2-56                          |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EM @ 271:0-54
    109      padding-inline-start: 20px;                                                                 | 272    padding-inline-start: 20px;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^ EN @ 109:4-30                                                    |        ^^^^^^^^^^^^^^^^^^^^^^^^^^ EN @ 272:2-28
                                                                                                         | 273  }
    110    }                                                                                             | 
    111    ::file-selector-button {                                                                      | 279  ::file-selector-button {
           ^^^^^^^^^^^^^^^^^^^^^^^ EO @ 111:2-25                                                         |      ^^^^^^^^^^^^^^^^^^^^^^^ EO @ 279:0-23
    112      margin-inline-end: 4px;                                                                     | 280    margin-inline-end: 4px;
             ^^^^^^^^^^^^^^^^^^^^^^ EP @ 112:4-26                                                        |        ^^^^^^^^^^^^^^^^^^^^^^ EP @ 280:2-24
                                                                                                         | 281  }
    113    }                                                                                             | 
    114    ::placeholder {                                                                               | 287  ::placeholder {
           ^^^^^^^^^^^^^^ EQ @ 114:2-16                                                                  |      ^^^^^^^^^^^^^^ EQ @ 287:0-14
    115      opacity: 1;                                                                                 | 288    opacity: 1;
             ^^^^^^^^^^ ER @ 115:4-14                                                                    |        ^^^^^^^^^^ ER @ 288:2-12
                                                                                                         | 289  }
    116    }                                                                                             | 
    117    @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {   | 296  @supports (not (-webkit-appearance: -apple-pay-button)) /* Not Safari */ or
           ^ ES @ 117:2                                                                                  |      ^ ES @ 296:0
    117    @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {   | 297    (contain-intrinsic-size: 1px) /* Safari 17+ */ {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... ET @ 117:2-92 |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ET @ 297:0-49
    118      ::placeholder {                                                                             | 298    ::placeholder {
             ^^^^^^^^^^^^^^ EU @ 118:4-18                                                                |        ^^^^^^^^^^^^^^ EU @ 298:2-16
    119        color: currentcolor;                                                                      | 299      color: color-mix(in oklab, currentcolor 50%, transparent);
               ^^^^^^^^^^^^^^^^^^^ EV @ 119:6-25                                                         |          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EV @ 299:4-61
                                                                                                         | 300    }
                                                                                                         | 301  }
    120        @supports (color: color-mix(in lab, red, red)) {                                          | 
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EV @ 120:6-53                             | 
    121          color: color-mix(in oklab, currentcolor 50%, transparent);                              | 
                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EV @ 121:8-65                 | 
    122        }                                                                                         | 
    123      }                                                                                           | 
    124    }                                                                                             | 
    125    textarea {                                                                                    | 307  textarea {
           ^^^^^^^^^ EW @ 125:2-11                                                                       |      ^^^^^^^^^ EW @ 307:0-9
    126      resize: vertical;                                                                           | 308    resize: vertical;
             ^^^^^^^^^^^^^^^^ EX @ 126:4-20                                                              |        ^^^^^^^^^^^^^^^^ EX @ 308:2-18
                                                                                                         | 309  }
    127    }                                                                                             | 
    128    ::-webkit-search-decoration {                                                                 | 315  ::-webkit-search-decoration {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EY @ 128:2-30                                                    |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EY @ 315:0-28
    129      -webkit-appearance: none;                                                                   | 316    -webkit-appearance: none;
             ^^^^^^^^^^^^^^^^^^^^^^^^ EZ @ 129:4-28                                                      |        ^^^^^^^^^^^^^^^^^^^^^^^^ EZ @ 316:2-26
                                                                                                         | 317  }
    130    }                                                                                             | 
    131    ::-webkit-date-and-time-value {                                                               | 324  ::-webkit-date-and-time-value {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FA @ 131:2-32                                                  |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FA @ 324:0-30
    132      min-height: 1lh;                                                                            | 325    min-height: 1lh; /* 1 */
             ^^^^^^^^^^^^^^^ FB @ 132:4-19                                                               |        ^^^^^^^^^^^^^^^ FB @ 325:2-17
    133      text-align: inherit;                                                                        | 326    text-align: inherit; /* 2 */
             ^^^^^^^^^^^^^^^^^^^ FC @ 133:4-23                                                           |        ^^^^^^^^^^^^^^^^^^^ FC @ 326:2-21
                                                                                                         | 327  }
    134    }                                                                                             | 
    135    ::-webkit-datetime-edit {                                                                     | 333  ::-webkit-datetime-edit {
           ^^^^^^^^^^^^^^^^^^^^^^^^ FD @ 135:2-26                                                        |      ^^^^^^^^^^^^^^^^^^^^^^^^ FD @ 333:0-24
    136      display: inline-flex;                                                                       | 334    display: inline-flex;
             ^^^^^^^^^^^^^^^^^^^^ FE @ 136:4-24                                                          |        ^^^^^^^^^^^^^^^^^^^^ FE @ 334:2-22
                                                                                                         | 335  }
    137    }                                                                                             | 
    138    ::-webkit-datetime-edit-fields-wrapper {                                                      | 341  ::-webkit-datetime-edit-fields-wrapper {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FF @ 138:2-41                                         |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FF @ 341:0-39
    139      padding: 0;                                                                                 | 342    padding: 0;
             ^^^^^^^^^^ FG @ 139:4-14                                                                    |        ^^^^^^^^^^ FG @ 342:2-12
                                                                                                         | 343  }
    140    }                                                                                             | 
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 345  ::-webkit-datetime-edit,
           ^ FH @ 141:2                                                                                  |      ^ FH @ 345:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 346  ::-webkit-datetime-edit-year-field,
           ^ FI @ 141:2                                                                                  |      ^ FI @ 346:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 347  ::-webkit-datetime-edit-month-field,
           ^ FJ @ 141:2                                                                                  |      ^ FJ @ 347:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 348  ::-webkit-datetime-edit-day-field,
           ^ FK @ 141:2                                                                                  |      ^ FK @ 348:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 349  ::-webkit-datetime-edit-hour-field,
           ^ FL @ 141:2                                                                                  |      ^ FL @ 349:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 350  ::-webkit-datetime-edit-minute-field,
           ^ FM @ 141:2                                                                                  |      ^ FM @ 350:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 351  ::-webkit-datetime-edit-second-field,
           ^ FN @ 141:2                                                                                  |      ^ FN @ 351:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 352  ::-webkit-datetime-edit-millisecond-field,
           ^ FO @ 141:2                                                                                  |      ^ FO @ 352:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 353  ::-webkit-datetime-edit-meridiem-field {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... FP @ 141:2-329 |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FP @ 353:0-39
    142      padding-block: 0;                                                                           | 354    padding-block: 0;
             ^^^^^^^^^^^^^^^^ FQ @ 142:4-20                                                              |        ^^^^^^^^^^^^^^^^ FQ @ 354:2-18
                                                                                                         | 355  }
    143    }                                                                                             | 
    144    ::-webkit-calendar-picker-indicator {                                                         | 361  ::-webkit-calendar-picker-indicator {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FR @ 144:2-38                                            |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FR @ 361:0-36
    145      line-height: 1;                                                                             | 362    line-height: 1;
             ^^^^^^^^^^^^^^ FS @ 145:4-18                                                                |        ^^^^^^^^^^^^^^ FS @ 362:2-16
                                                                                                         | 363  }
    146    }                                                                                             | 
    147    :-moz-ui-invalid {                                                                            | 369  :-moz-ui-invalid {
           ^^^^^^^^^^^^^^^^^ FT @ 147:2-19                                                               |      ^^^^^^^^^^^^^^^^^ FT @ 369:0-17
    148      box-shadow: none;                                                                           | 370    box-shadow: none;
             ^^^^^^^^^^^^^^^^ FU @ 148:4-20                                                              |        ^^^^^^^^^^^^^^^^ FU @ 370:2-18
                                                                                                         | 371  }
    149    }                                                                                             | 
    150    button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-but... | 377  button,
           ^ FV @ 150:2                                                                                  |      ^ FV @ 377:0
    150    button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-but... | 378  input:where([type='button'], [type='reset'], [type='submit']),
           ^ FW @ 150:2                                                                                  |      ^ FW @ 378:0
    150    button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-but... | 379  ::file-selector-button {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... FX @ 150:2-96 |      ^^^^^^^^^^^^^^^^^^^^^^^ FX @ 379:0-23
    151      appearance: button;                                                                         | 380    appearance: button;
             ^^^^^^^^^^^^^^^^^^ FY @ 151:4-22                                                            |        ^^^^^^^^^^^^^^^^^^ FY @ 380:2-20
                                                                                                         | 381  }
    152    }                                                                                             | 
    153    ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {                                    | 387  ::-webkit-inner-spin-button,
           ^ FZ @ 153:2                                                                                  |      ^ FZ @ 387:0
    153    ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {                                    | 388  ::-webkit-outer-spin-button {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ GA @ 153:2-59                       |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ GA @ 388:0-28
    154      height: auto;                                                                               | 389    height: auto;
             ^^^^^^^^^^^^ GB @ 154:4-16                                                                  |        ^^^^^^^^^^^^ GB @ 389:2-14
                                                                                                         | 390  }
    155    }                                                                                             | 
    156    [hidden]:where(:not([hidden='until-found'])) {                                                | 396  [hidden]:where(:not([hidden='until-found'])) {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ GC @ 156:2-47                                   |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ GC @ 396:0-45
    157      display: none !important;                                                                   | 397    display: none !important;
             ^^^^^^^^^^^^^^^^^^^^^^^^ GD @ 157:4-28                                                      |        ^^^^^^^^^^^^^^^^^^^^^^^^ GD @ 397:2-26
                                                                                                         | 398  }
    158    }                                                                                             | 
    159  }                                                                                               | 
                                                                                                         |      --- index.css ---
    160  @layer utilities;                                                                               |   5  @import './utilities.css' layer(utilities);
         ^^^^^^^^^^^^^^^^ GE @ 160:0-16                                                                  |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ GE @ 5:0-42
                                                                                                         |      --- input.css ---
    161  .foo {                                                                                          |   3  .foo {
         ^^^^^ GF @ 161:0-5                                                                              |      ^^^^^ GF @ 3:0-5
    162    text-decoration-line: underline;                                                              |   4    @apply underline;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ GG @ 162:2-33                                                 |               ^^^^^^^^^ GG @ 4:9-18
                                                                                                         |   5  }
    163  }                                                                                               | 
    164                                                                                                  | 
    "
  `)
})

test('source maps are generated for utilities', async ({ expect }) => {
  let {
    sources,
    css: output,
    annotations,
  } = await run({
    input: css`
      @import './utilities.css';
      @plugin "./plugin.js";
      @utility custom {
        color: orange;
      }
    `,
    candidates: ['custom', 'custom-js', 'flex'],
    options: {
      loadModule: async (_, base) => ({
        path: '',
        base,
        module: createPlugin(({ addUtilities }) => {
          addUtilities({ '.custom-js': { color: 'blue' } })
        }),
      }),
    },
  })

  // All CSS should be mapped back to the original source file
  expect(sources).toEqual(['utilities.css', 'input.css'])
  expect(sources.length).toBe(2)

  // The output CSS should include annotations linking back to:
  expect(annotations).toMatchInlineSnapshot(`
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
        ^^^^^^^^ A @ 4:0-8         | 
                                   |    --- input.css ---
     5    color: orange;           | 4    color: orange;
          ^^^^^^^^^^^^^ B @ 5:2-15 |      ^^^^^^^^^^^^^ B @ 4:2-15
                                   | 5  }
     6  }                          | 
     7  .custom-js {               | 
        ^^^^^^^^^^^ A @ 7:0-11     | 
     8    color: blue;             | 
          ^^^^^^^^^^^ A @ 8:2-13   | 
     9  }                          | 
    10                             | 
    "
  `)

  expect(output).toMatchInlineSnapshot(`
    ".flex {
      display: flex;
    }
    .custom {
      color: orange;
    }
    .custom-js {
      color: blue;
    }
    "
  `)
})

test('utilities have source maps pointing to the utilities node', async ({ expect }) => {
  let { sources, annotations } = await run({
    input: `@tailwind utilities;`,
    candidates: [
      //
      'underline',
    ],
  })

  expect(sources).toEqual(['input.css'])

  expect(annotations).toMatchInlineSnapshot(`
    "
       output.css                                   |    input.css
                                                    | 
    1  .underline {                                 | 1  @tailwind utilities;
       ^^^^^^^^^^^ A @ 1:0-11                       |    ^^^^^^^^^^^^^^^^^^^ A @ 1:0-19
    2    text-decoration-line: underline;           | 
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ A @ 2:2-33 | 
    3  }                                            | 
    4                                               | 
    "
  `)
})

test('@apply generates source maps', async ({ expect }) => {
  let { sources, annotations } = await run({
    input: css`
      .foo {
        color: blue;
        @apply text-[#000] hover:text-[#f00];
        @apply underline;
        @apply --my-mixin-1 --my-mixin-2();
        color: red;
      }
    `,
  })

  expect(sources).toEqual(['input.css'])

  expect(annotations).toMatchInlineSnapshot(`
    "
        output.css                                       |    input.css
                                                         | 
     1  .foo {                                           | 1  .foo {
        ^^^^^ A @ 1:0-5                                  |    ^^^^^ A @ 1:0-5
     2    color: blue;                                   | 2    color: blue;
          ^^^^^^^^^^^ B @ 2:2-13                         |      ^^^^^^^^^^^ B @ 2:2-13
     3    color: #000;                                   | 3    @apply text-[#000] hover:text-[#f00];
          ^^^^^^^^^^^ C @ 3:2-13                         |             ^^^^^^^^^^^ C @ 3:9-20
     4    &:hover {                                      | 3    @apply text-[#000] hover:text-[#f00];
          ^^^^^^^^ D @ 4:2-10                            |                         ^^^^^^^^^^^^^^^^^ D @ 3:21-38
     5      @media (hover: hover) {                      | 
            ^^^^^^^^^^^^^^^^^^^^^^ D @ 5:4-26            | 
     6        color: #f00;                               | 
              ^^^^^^^^^^^ D @ 6:6-17                     | 
     7      }                                            | 
     8    }                                              | 
     9    text-decoration-line: underline;               | 4    @apply underline;
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ E @ 9:2-33     |             ^^^^^^^^^ E @ 4:9-18
    10    @apply --my-mixin-1 --my-mixin-2();            | 5    @apply --my-mixin-1 --my-mixin-2();
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ F @ 10:2-36 |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ F @ 5:2-36
    11    color: red;                                    | 6    color: red;
          ^^^^^^^^^^ G @ 11:2-12                         |      ^^^^^^^^^^ G @ 6:2-12
                                                         | 7  }
    12  }                                                | 
    13                                                   | 
    "
  `)
})

test('@variant generates source maps', async ({ expect }) => {
  let { sources, annotations } = await run({
    input: css`
      .foo {
        color: red;

        @variant data-a, data-b:data-c {
          color: green;

          @variant data-d, data-e:data-f {
            color: blue;
          }
        }
      }
    `,
  })

  expect(sources).toEqual(['input.css'])

  expect(annotations).toMatchInlineSnapshot(`
    "
        output.css                         |     input.css
                                           | 
     1  .foo {                             |  1  .foo {
        ^^^^^ A @ 1:0-5                    |     ^^^^^ A @ 1:0-5
     2    color: red;                      |  2    color: red;
          ^^^^^^^^^^ B @ 2:2-12            |       ^^^^^^^^^^ B @ 2:2-12
     3    &[data-a] {                      | 
                                           |  4    @variant data-a, data-b:data-c {
     4      color: green;                  |  5      color: green;
            ^^^^^^^^^^^^ C @ 4:4-16        |         ^^^^^^^^^^^^ C @ 5:4-16
     5      &[data-d] {                    | 
                                           |  7      @variant data-d, data-e:data-f {
     6        color: blue;                 |  8        color: blue;
              ^^^^^^^^^^^ D @ 6:6-17       |           ^^^^^^^^^^^ D @ 8:6-17
                                           |  9      }
                                           | 10    }
                                           | 11  }
     7      }                              | 
     8      &[data-e] {                    | 
     9        &[data-f] {                  | 
    10          color: blue;               | 
                ^^^^^^^^^^^ D @ 10:8-19    | 
    11        }                            | 
    12      }                              | 
    13    }                                | 
    14    &[data-b] {                      | 
    15      &[data-c] {                    | 
    16        color: green;                | 
              ^^^^^^^^^^^^ C @ 16:6-18     | 
    17        &[data-d] {                  | 
    18          color: blue;               | 
                ^^^^^^^^^^^ D @ 18:8-19    | 
    19        }                            | 
    20        &[data-e] {                  | 
    21          &[data-f] {                | 
    22            color: blue;             | 
                  ^^^^^^^^^^^ D @ 22:10-21 | 
    23          }                          | 
    24        }                            | 
    25      }                              | 
    26    }                                | 
    27  }                                  | 
    28                                     | 
    "
  `)
})

test('license comments preserve source locations', async ({ expect }) => {
  let { sources, annotations } = await run({
    input: `/*! some comment */`,
  })

  expect(sources).toEqual(['input.css'])

  expect(annotations).toMatchInlineSnapshot(`
    "
       output.css                     |    input.css
                                      | 
    1  /*! some comment */            | 1  /*! some comment */
       ^^^^^^^^^^^^^^^^^^^ A @ 1:0-19 |    ^^^^^^^^^^^^^^^^^^^ A @ 1:0-19
    "
  `)
})

test('license comments with new lines preserve source locations', async ({ expect }) => {
  let { sources, annotations } = await run({
    input: `/*! some \n comment */`,
  })

  expect(sources).toEqual(['input.css'])

  expect(annotations).toMatchInlineSnapshot(`
    "
       output.css                |    input.css
                                 | 
    1  /*! some                  | 1  /*! some 
       ^ A @ 1:0                 |    ^ A @ 1:0
    1  /*! some                  | 2   comment */
       ^^^^^^^^^ B @ 1:0-2:0     |    ^ B @ 2:0
    2   comment */               | 2   comment */
                  ^ C @ 2:11-3:0 |               ^ C @ 2:11
    "
  `)
})

test('Source locations for `addBase` point to the `@plugin` that generated them', async ({
  expect,
}) => {
  let { sources, annotations } = await run({
    input: css`
      @plugin "./plugin.js";
      @config "./config.js";
    `,
    options: {
      async loadModule(id, base) {
        if (id === './plugin.js') {
          return {
            module: createPlugin(({ addBase }) => {
              addBase({ body: { color: 'red' } })
            }),
            base,
            path: '',
          }
        }

        if (id === './config.js') {
          return {
            module: {
              plugins: [
                createPlugin(({ addBase }) => {
                  addBase({ body: { color: 'green' } })
                }),
              ],
            },
            base,
            path: '',
          }
        }

        throw new Error(`unknown module ${id}`)
      },
    },
  })

  expect(sources).toEqual(['input.css'])

  expect(annotations).toMatchInlineSnapshot(`
    "
       output.css                  |    input.css
                                   | 
    1  @layer base {               | 1  @plugin "./plugin.js";
       ^^^^^^^^^^^^ A @ 1:0-12     |    ^^^^^^^^^^^^^^^^^^^^^ A @ 1:0-21
    2    body {                    | 
         ^^^^^ A @ 2:2-7           | 
    3      color: red;             | 
           ^^^^^^^^^^ A @ 3:4-14   | 
    4      color: green;           | 2  @config "./config.js";
           ^^^^^^^^^^^^ B @ 4:4-16 |    ^^^^^^^^^^^^^^^^^^^^^ B @ 2:0-21
    5    }                         | 
    6  }                           | 
    7                              | 
    "
  `)
})
