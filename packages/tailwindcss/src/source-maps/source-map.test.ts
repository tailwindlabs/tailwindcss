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
      4      --font-sans: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'... |   2    --font-sans:
             ^ D @ 4:4                                                                                   |        ^ D @ 2:2
      4      --font-sans: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'... |   3      ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI S...
             ^ E @ 4:4                                                                                   |      ^ E @ 3:0
      4      --font-sans: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'... |   4      'Noto Color Emoji';
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... F @ 4:4-5:0 |      ^ F @ 4:0
      5      'Noto Color Emoji';                                                                         |   4      'Noto Color Emoji';
                               ^ G @ 5:22-6:0                                                            |                            ^ G @ 4:22
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
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  33    font-family: --theme(
             ^ AC @ 23:4                                                                                 |        ^ AC @ 33:2
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  34      --default-font-family,
             ^ AD @ 23:4                                                                                 |      ^ AD @ 34:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  35      ui-sans-serif,
             ^ AE @ 23:4                                                                                 |      ^ AE @ 35:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  36      system-ui,
             ^ AF @ 23:4                                                                                 |      ^ AF @ 36:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  37      sans-serif,
             ^ AG @ 23:4                                                                                 |      ^ AG @ 37:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  38      'Apple Color Emoji',
             ^ AH @ 23:4                                                                                 |      ^ AH @ 38:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  39      'Segoe UI Emoji',
             ^ AI @ 23:4                                                                                 |      ^ AI @ 39:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  40      'Segoe UI Symbol',
             ^ AJ @ 23:4                                                                                 |      ^ AJ @ 40:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  41      'Noto Color Emoji'
             ^ AK @ 23:4                                                                                 |      ^ AK @ 41:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  42    ); /* 4 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... AL @ 23:4-159 |      ^^^ AL @ 42:0-3
     24      font-feature-settings: var(--default-font-feature-settings, normal);                        |  43    font-feature-settings: --theme(--default-font-feature-settings, normal); /* 5 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AM @ 24:4-71            |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AM @ 43:2-73
     25      font-variation-settings: var(--default-font-variation-settings, normal);                    |  44    font-variation-settings: --theme(--default-font-variation-settings, normal); /* 6 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AN @ 25:4-75        |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AN @ 44:2-77
     26      -webkit-tap-highlight-color: transparent;                                                   |  45    -webkit-tap-highlight-color: transparent; /* 7 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AO @ 26:4-44                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AO @ 45:2-42
                                                                                                         |  46  }
     27    }                                                                                             | 
     28    hr {                                                                                          |  54  hr {
           ^^^ AP @ 28:2-5                                                                               |      ^^^ AP @ 54:0-3
     29      height: 0;                                                                                  |  55    height: 0; /* 1 */
             ^^^^^^^^^ AQ @ 29:4-13                                                                      |        ^^^^^^^^^ AQ @ 55:2-11
     30      color: inherit;                                                                             |  56    color: inherit; /* 2 */
             ^^^^^^^^^^^^^^ AR @ 30:4-18                                                                 |        ^^^^^^^^^^^^^^ AR @ 56:2-16
     31      border-top-width: 1px;                                                                      |  57    border-top-width: 1px; /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^ AS @ 31:4-25                                                          |        ^^^^^^^^^^^^^^^^^^^^^ AS @ 57:2-23
                                                                                                         |  58  }
     32    }                                                                                             | 
     33    abbr:where([title]) {                                                                         |  64  abbr:where([title]) {
           ^^^^^^^^^^^^^^^^^^^^ AT @ 33:2-22                                                             |      ^^^^^^^^^^^^^^^^^^^^ AT @ 64:0-20
     34      -webkit-text-decoration: underline dotted;                                                  |  65    -webkit-text-decoration: underline dotted;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AU @ 34:4-45                                      |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AU @ 65:2-43
     35      text-decoration: underline dotted;                                                          |  66    text-decoration: underline dotted;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AV @ 35:4-37                                              |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AV @ 66:2-35
                                                                                                         |  67  }
     36    }                                                                                             | 
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  73  h1,
           ^ AW @ 37:2                                                                                   |      ^ AW @ 73:0
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  74  h2,
           ^ AX @ 37:2                                                                                   |      ^ AX @ 74:0
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  75  h3,
           ^ AY @ 37:2                                                                                   |      ^ AY @ 75:0
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  76  h4,
           ^ AZ @ 37:2                                                                                   |      ^ AZ @ 76:0
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  77  h5,
           ^ BA @ 37:2                                                                                   |      ^ BA @ 77:0
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  78  h6 {
           ^^^^^^^^^^^^^^^^^^^^^^^ BB @ 37:2-25                                                          |      ^^^ BB @ 78:0-3
     38      font-size: inherit;                                                                         |  79    font-size: inherit;
             ^^^^^^^^^^^^^^^^^^ BC @ 38:4-22                                                             |        ^^^^^^^^^^^^^^^^^^ BC @ 79:2-20
     39      font-weight: inherit;                                                                       |  80    font-weight: inherit;
             ^^^^^^^^^^^^^^^^^^^^ BD @ 39:4-24                                                           |        ^^^^^^^^^^^^^^^^^^^^ BD @ 80:2-22
                                                                                                         |  81  }
     40    }                                                                                             | 
     41    a {                                                                                           |  87  a {
           ^^ BE @ 41:2-4                                                                                |      ^^ BE @ 87:0-2
     42      color: inherit;                                                                             |  88    color: inherit;
             ^^^^^^^^^^^^^^ BF @ 42:4-18                                                                 |        ^^^^^^^^^^^^^^ BF @ 88:2-16
     43      -webkit-text-decoration: inherit;                                                           |  89    -webkit-text-decoration: inherit;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BG @ 43:4-36                                               |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BG @ 89:2-34
     44      text-decoration: inherit;                                                                   |  90    text-decoration: inherit;
             ^^^^^^^^^^^^^^^^^^^^^^^^ BH @ 44:4-28                                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^ BH @ 90:2-26
                                                                                                         |  91  }
     45    }                                                                                             | 
     46    b, strong {                                                                                   |  97  b,
           ^ BI @ 46:2                                                                                   |      ^ BI @ 97:0
     46    b, strong {                                                                                   |  98  strong {
           ^^^^^^^^^^ BJ @ 46:2-12                                                                       |      ^^^^^^^ BJ @ 98:0-7
     47      font-weight: bolder;                                                                        |  99    font-weight: bolder;
             ^^^^^^^^^^^^^^^^^^^ BK @ 47:4-23                                                            |        ^^^^^^^^^^^^^^^^^^^ BK @ 99:2-21
                                                                                                         | 100  }
     48    }                                                                                             | 
     49    code, kbd, samp, pre {                                                                        | 109  code,
           ^ BL @ 49:2                                                                                   |      ^ BL @ 109:0
     49    code, kbd, samp, pre {                                                                        | 110  kbd,
           ^ BM @ 49:2                                                                                   |      ^ BM @ 110:0
     49    code, kbd, samp, pre {                                                                        | 111  samp,
           ^ BN @ 49:2                                                                                   |      ^ BN @ 111:0
     49    code, kbd, samp, pre {                                                                        | 112  pre {
           ^^^^^^^^^^^^^^^^^^^^^ BO @ 49:2-23                                                            |      ^^^^ BO @ 112:0-4
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 113    font-family: --theme(
             ^ BP @ 50:4                                                                                 |        ^ BP @ 113:2
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 114      --default-mono-font-family,
             ^ BQ @ 50:4                                                                                 |      ^ BQ @ 114:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 115      ui-monospace,
             ^ BR @ 50:4                                                                                 |      ^ BR @ 115:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 116      SFMono-Regular,
             ^ BS @ 50:4                                                                                 |      ^ BS @ 116:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 117      Menlo,
             ^ BT @ 50:4                                                                                 |      ^ BT @ 117:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 118      Monaco,
             ^ BU @ 50:4                                                                                 |      ^ BU @ 118:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 119      Consolas,
             ^ BV @ 50:4                                                                                 |      ^ BV @ 119:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 120      'Liberation Mono',
             ^ BW @ 50:4                                                                                 |      ^ BW @ 120:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 121      'Courier New',
             ^ BX @ 50:4                                                                                 |      ^ BX @ 121:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 122      monospace
             ^ BY @ 50:4                                                                                 |      ^ BY @ 122:0
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 123    ); /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... BZ @ 50:4-148 |      ^^^ BZ @ 123:0-3
     51      font-feature-settings: var(--default-mono-font-feature-settings, normal);                   | 124    font-feature-settings: --theme(--default-mono-font-feature-settings, normal); /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CA @ 51:4-76       |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CA @ 124:2-78
     52      font-variation-settings: var(--default-mono-font-variation-settings, normal);               | 125    font-variation-settings: --theme(--default-mono-font-variation-settings, normal); /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CB @ 52:4-80   |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... CB @ 125:2-82
     53      font-size: 1em;                                                                             | 126    font-size: 1em; /* 4 */
             ^^^^^^^^^^^^^^ CC @ 53:4-18                                                                 |        ^^^^^^^^^^^^^^ CC @ 126:2-16
                                                                                                         | 127  }
     54    }                                                                                             | 
     55    small {                                                                                       | 133  small {
           ^^^^^^ CD @ 55:2-8                                                                            |      ^^^^^^ CD @ 133:0-6
     56      font-size: 80%;                                                                             | 134    font-size: 80%;
             ^^^^^^^^^^^^^^ CE @ 56:4-18                                                                 |        ^^^^^^^^^^^^^^ CE @ 134:2-16
                                                                                                         | 135  }
     57    }                                                                                             | 
     58    sub, sup {                                                                                    | 141  sub,
           ^ CF @ 58:2                                                                                   |      ^ CF @ 141:0
     58    sub, sup {                                                                                    | 142  sup {
           ^^^^^^^^^ CG @ 58:2-11                                                                        |      ^^^^ CG @ 142:0-4
     59      font-size: 75%;                                                                             | 143    font-size: 75%;
             ^^^^^^^^^^^^^^ CH @ 59:4-18                                                                 |        ^^^^^^^^^^^^^^ CH @ 143:2-16
     60      line-height: 0;                                                                             | 144    line-height: 0;
             ^^^^^^^^^^^^^^ CI @ 60:4-18                                                                 |        ^^^^^^^^^^^^^^ CI @ 144:2-16
     61      position: relative;                                                                         | 145    position: relative;
             ^^^^^^^^^^^^^^^^^^ CJ @ 61:4-22                                                             |        ^^^^^^^^^^^^^^^^^^ CJ @ 145:2-20
     62      vertical-align: baseline;                                                                   | 146    vertical-align: baseline;
             ^^^^^^^^^^^^^^^^^^^^^^^^ CK @ 62:4-28                                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^ CK @ 146:2-26
                                                                                                         | 147  }
     63    }                                                                                             | 
     64    sub {                                                                                         | 149  sub {
           ^^^^ CL @ 64:2-6                                                                              |      ^^^^ CL @ 149:0-4
     65      bottom: -0.25em;                                                                            | 150    bottom: -0.25em;
             ^^^^^^^^^^^^^^^ CM @ 65:4-19                                                                |        ^^^^^^^^^^^^^^^ CM @ 150:2-17
                                                                                                         | 151  }
     66    }                                                                                             | 
     67    sup {                                                                                         | 153  sup {
           ^^^^ CN @ 67:2-6                                                                              |      ^^^^ CN @ 153:0-4
     68      top: -0.5em;                                                                                | 154    top: -0.5em;
             ^^^^^^^^^^^ CO @ 68:4-15                                                                    |        ^^^^^^^^^^^ CO @ 154:2-13
                                                                                                         | 155  }
     69    }                                                                                             | 
     70    table {                                                                                       | 163  table {
           ^^^^^^ CP @ 70:2-8                                                                            |      ^^^^^^ CP @ 163:0-6
     71      text-indent: 0;                                                                             | 164    text-indent: 0; /* 1 */
             ^^^^^^^^^^^^^^ CQ @ 71:4-18                                                                 |        ^^^^^^^^^^^^^^ CQ @ 164:2-16
     72      border-color: inherit;                                                                      | 165    border-color: inherit; /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^ CR @ 72:4-25                                                          |        ^^^^^^^^^^^^^^^^^^^^^ CR @ 165:2-23
     73      border-collapse: collapse;                                                                  | 166    border-collapse: collapse; /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^ CS @ 73:4-29                                                      |        ^^^^^^^^^^^^^^^^^^^^^^^^^ CS @ 166:2-27
                                                                                                         | 167  }
     74    }                                                                                             | 
     75    :-moz-focusring {                                                                             | 173  :-moz-focusring {
           ^^^^^^^^^^^^^^^^ CT @ 75:2-18                                                                 |      ^^^^^^^^^^^^^^^^ CT @ 173:0-16
     76      outline: auto;                                                                              | 174    outline: auto;
             ^^^^^^^^^^^^^ CU @ 76:4-17                                                                  |        ^^^^^^^^^^^^^ CU @ 174:2-15
                                                                                                         | 175  }
     77    }                                                                                             | 
     78    progress {                                                                                    | 181  progress {
           ^^^^^^^^^ CV @ 78:2-11                                                                        |      ^^^^^^^^^ CV @ 181:0-9
     79      vertical-align: baseline;                                                                   | 182    vertical-align: baseline;
             ^^^^^^^^^^^^^^^^^^^^^^^^ CW @ 79:4-28                                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^ CW @ 182:2-26
                                                                                                         | 183  }
     80    }                                                                                             | 
     81    summary {                                                                                     | 189  summary {
           ^^^^^^^^ CX @ 81:2-10                                                                         |      ^^^^^^^^ CX @ 189:0-8
     82      display: list-item;                                                                         | 190    display: list-item;
             ^^^^^^^^^^^^^^^^^^ CY @ 82:4-22                                                             |        ^^^^^^^^^^^^^^^^^^ CY @ 190:2-20
                                                                                                         | 191  }
     83    }                                                                                             | 
     84    ol, ul, menu {                                                                                | 197  ol,
           ^ CZ @ 84:2                                                                                   |      ^ CZ @ 197:0
     84    ol, ul, menu {                                                                                | 198  ul,
           ^ DA @ 84:2                                                                                   |      ^ DA @ 198:0
     84    ol, ul, menu {                                                                                | 199  menu {
           ^^^^^^^^^^^^^ DB @ 84:2-15                                                                    |      ^^^^^ DB @ 199:0-5
     85      list-style: none;                                                                           | 200    list-style: none;
             ^^^^^^^^^^^^^^^^ DC @ 85:4-20                                                               |        ^^^^^^^^^^^^^^^^ DC @ 200:2-18
                                                                                                         | 201  }
     86    }                                                                                             | 
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 209  img,
           ^ DD @ 87:2                                                                                   |      ^ DD @ 209:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 210  svg,
           ^ DE @ 87:2                                                                                   |      ^ DE @ 210:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 211  video,
           ^ DF @ 87:2                                                                                   |      ^ DF @ 211:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 212  canvas,
           ^ DG @ 87:2                                                                                   |      ^ DG @ 212:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 213  audio,
           ^ DH @ 87:2                                                                                   |      ^ DH @ 213:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 214  iframe,
           ^ DI @ 87:2                                                                                   |      ^ DI @ 214:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 215  embed,
           ^ DJ @ 87:2                                                                                   |      ^ DJ @ 215:0
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 216  object {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DK @ 87:2-56                           |      ^^^^^^^ DK @ 216:0-7
     88      display: block;                                                                             | 217    display: block; /* 1 */
             ^^^^^^^^^^^^^^ DL @ 88:4-18                                                                 |        ^^^^^^^^^^^^^^ DL @ 217:2-16
     89      vertical-align: middle;                                                                     | 218    vertical-align: middle; /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^^ DM @ 89:4-26                                                         |        ^^^^^^^^^^^^^^^^^^^^^^ DM @ 218:2-24
                                                                                                         | 219  }
     90    }                                                                                             | 
     91    img, video {                                                                                  | 225  img,
           ^ DN @ 91:2                                                                                   |      ^ DN @ 225:0
     91    img, video {                                                                                  | 226  video {
           ^^^^^^^^^^^ DO @ 91:2-13                                                                      |      ^^^^^^ DO @ 226:0-6
     92      max-width: 100%;                                                                            | 227    max-width: 100%;
             ^^^^^^^^^^^^^^^ DP @ 92:4-19                                                                |        ^^^^^^^^^^^^^^^ DP @ 227:2-17
     93      height: auto;                                                                               | 228    height: auto;
             ^^^^^^^^^^^^ DQ @ 93:4-16                                                                   |        ^^^^^^^^^^^^ DQ @ 228:2-14
                                                                                                         | 229  }
     94    }                                                                                             | 
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 238  button,
           ^ DR @ 95:2                                                                                   |      ^ DR @ 238:0
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 239  input,
           ^ DS @ 95:2                                                                                   |      ^ DS @ 239:0
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 240  select,
           ^ DT @ 95:2                                                                                   |      ^ DT @ 240:0
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 241  optgroup,
           ^ DU @ 95:2                                                                                   |      ^ DU @ 241:0
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 242  textarea,
           ^ DV @ 95:2                                                                                   |      ^ DV @ 242:0
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 243  ::file-selector-button {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DW @ 95:2-68               |      ^^^^^^^^^^^^^^^^^^^^^^^ DW @ 243:0-23
     96      font: inherit;                                                                              | 244    font: inherit; /* 1 */
             ^^^^^^^^^^^^^ DX @ 96:4-17                                                                  |        ^^^^^^^^^^^^^ DX @ 244:2-15
     97      font-feature-settings: inherit;                                                             | 245    font-feature-settings: inherit; /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DY @ 97:4-34                                                 |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DY @ 245:2-32
     98      font-variation-settings: inherit;                                                           | 246    font-variation-settings: inherit; /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DZ @ 98:4-36                                               |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DZ @ 246:2-34
     99      letter-spacing: inherit;                                                                    | 247    letter-spacing: inherit; /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^ EA @ 99:4-27                                                        |        ^^^^^^^^^^^^^^^^^^^^^^^ EA @ 247:2-25
    100      color: inherit;                                                                             | 248    color: inherit; /* 1 */
             ^^^^^^^^^^^^^^ EB @ 100:4-18                                                                |        ^^^^^^^^^^^^^^ EB @ 248:2-16
    101      border-radius: 0;                                                                           | 249    border-radius: 0; /* 2 */
             ^^^^^^^^^^^^^^^^ EC @ 101:4-20                                                              |        ^^^^^^^^^^^^^^^^ EC @ 249:2-18
    102      background-color: transparent;                                                              | 250    background-color: transparent; /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ED @ 102:4-33                                                 |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ED @ 250:2-31
    103      opacity: 1;                                                                                 | 251    opacity: 1; /* 4 */
             ^^^^^^^^^^ EE @ 103:4-14                                                                    |        ^^^^^^^^^^ EE @ 251:2-12
                                                                                                         | 252  }
    104    }                                                                                             | 
    105    :where(select:is([multiple], [size])) optgroup {                                              | 258  :where(select:is([multiple], [size])) optgroup {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EF @ 105:2-49                                 |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EF @ 258:0-47
    106      font-weight: bolder;                                                                        | 259    font-weight: bolder;
             ^^^^^^^^^^^^^^^^^^^ EG @ 106:4-23                                                           |        ^^^^^^^^^^^^^^^^^^^ EG @ 259:2-21
                                                                                                         | 260  }
    107    }                                                                                             | 
    108    :where(select:is([multiple], [size])) optgroup option {                                       | 266  :where(select:is([multiple], [size])) optgroup option {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EH @ 108:2-56                          |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EH @ 266:0-54
    109      padding-inline-start: 20px;                                                                 | 267    padding-inline-start: 20px;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^ EI @ 109:4-30                                                    |        ^^^^^^^^^^^^^^^^^^^^^^^^^^ EI @ 267:2-28
                                                                                                         | 268  }
    110    }                                                                                             | 
    111    ::file-selector-button {                                                                      | 274  ::file-selector-button {
           ^^^^^^^^^^^^^^^^^^^^^^^ EJ @ 111:2-25                                                         |      ^^^^^^^^^^^^^^^^^^^^^^^ EJ @ 274:0-23
    112      margin-inline-end: 4px;                                                                     | 275    margin-inline-end: 4px;
             ^^^^^^^^^^^^^^^^^^^^^^ EK @ 112:4-26                                                        |        ^^^^^^^^^^^^^^^^^^^^^^ EK @ 275:2-24
                                                                                                         | 276  }
    113    }                                                                                             | 
    114    ::placeholder {                                                                               | 282  ::placeholder {
           ^^^^^^^^^^^^^^ EL @ 114:2-16                                                                  |      ^^^^^^^^^^^^^^ EL @ 282:0-14
    115      opacity: 1;                                                                                 | 283    opacity: 1;
             ^^^^^^^^^^ EM @ 115:4-14                                                                    |        ^^^^^^^^^^ EM @ 283:2-12
                                                                                                         | 284  }
    116    }                                                                                             | 
    117    @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {   | 291  @supports (not (-webkit-appearance: -apple-pay-button)) /* Not Safari */ or
           ^ EN @ 117:2                                                                                  |      ^ EN @ 291:0
    117    @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {   | 292    (contain-intrinsic-size: 1px) /* Safari 17+ */ {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... EO @ 117:2-92 |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EO @ 292:0-49
    118      ::placeholder {                                                                             | 293    ::placeholder {
             ^^^^^^^^^^^^^^ EP @ 118:4-18                                                                |        ^^^^^^^^^^^^^^ EP @ 293:2-16
    119        color: currentcolor;                                                                      | 294      color: color-mix(in oklab, currentcolor 50%, transparent);
               ^^^^^^^^^^^^^^^^^^^ EQ @ 119:6-25                                                         |          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EQ @ 294:4-61
                                                                                                         | 295    }
                                                                                                         | 296  }
    120        @supports (color: color-mix(in lab, red, red)) {                                          | 
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EQ @ 120:6-53                             | 
    121          color: color-mix(in oklab, currentcolor 50%, transparent);                              | 
                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EQ @ 121:8-65                 | 
    122        }                                                                                         | 
    123      }                                                                                           | 
    124    }                                                                                             | 
    125    textarea {                                                                                    | 302  textarea {
           ^^^^^^^^^ ER @ 125:2-11                                                                       |      ^^^^^^^^^ ER @ 302:0-9
    126      resize: vertical;                                                                           | 303    resize: vertical;
             ^^^^^^^^^^^^^^^^ ES @ 126:4-20                                                              |        ^^^^^^^^^^^^^^^^ ES @ 303:2-18
                                                                                                         | 304  }
    127    }                                                                                             | 
    128    ::-webkit-search-decoration {                                                                 | 310  ::-webkit-search-decoration {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ET @ 128:2-30                                                    |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ET @ 310:0-28
    129      -webkit-appearance: none;                                                                   | 311    -webkit-appearance: none;
             ^^^^^^^^^^^^^^^^^^^^^^^^ EU @ 129:4-28                                                      |        ^^^^^^^^^^^^^^^^^^^^^^^^ EU @ 311:2-26
                                                                                                         | 312  }
    130    }                                                                                             | 
    131    ::-webkit-date-and-time-value {                                                               | 319  ::-webkit-date-and-time-value {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EV @ 131:2-32                                                  |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ EV @ 319:0-30
    132      min-height: 1lh;                                                                            | 320    min-height: 1lh; /* 1 */
             ^^^^^^^^^^^^^^^ EW @ 132:4-19                                                               |        ^^^^^^^^^^^^^^^ EW @ 320:2-17
    133      text-align: inherit;                                                                        | 321    text-align: inherit; /* 2 */
             ^^^^^^^^^^^^^^^^^^^ EX @ 133:4-23                                                           |        ^^^^^^^^^^^^^^^^^^^ EX @ 321:2-21
                                                                                                         | 322  }
    134    }                                                                                             | 
    135    ::-webkit-datetime-edit {                                                                     | 328  ::-webkit-datetime-edit {
           ^^^^^^^^^^^^^^^^^^^^^^^^ EY @ 135:2-26                                                        |      ^^^^^^^^^^^^^^^^^^^^^^^^ EY @ 328:0-24
    136      display: inline-flex;                                                                       | 329    display: inline-flex;
             ^^^^^^^^^^^^^^^^^^^^ EZ @ 136:4-24                                                          |        ^^^^^^^^^^^^^^^^^^^^ EZ @ 329:2-22
                                                                                                         | 330  }
    137    }                                                                                             | 
    138    ::-webkit-datetime-edit-fields-wrapper {                                                      | 336  ::-webkit-datetime-edit-fields-wrapper {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FA @ 138:2-41                                         |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FA @ 336:0-39
    139      padding: 0;                                                                                 | 337    padding: 0;
             ^^^^^^^^^^ FB @ 139:4-14                                                                    |        ^^^^^^^^^^ FB @ 337:2-12
                                                                                                         | 338  }
    140    }                                                                                             | 
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 340  ::-webkit-datetime-edit,
           ^ FC @ 141:2                                                                                  |      ^ FC @ 340:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 341  ::-webkit-datetime-edit-year-field,
           ^ FD @ 141:2                                                                                  |      ^ FD @ 341:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 342  ::-webkit-datetime-edit-month-field,
           ^ FE @ 141:2                                                                                  |      ^ FE @ 342:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 343  ::-webkit-datetime-edit-day-field,
           ^ FF @ 141:2                                                                                  |      ^ FF @ 343:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 344  ::-webkit-datetime-edit-hour-field,
           ^ FG @ 141:2                                                                                  |      ^ FG @ 344:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 345  ::-webkit-datetime-edit-minute-field,
           ^ FH @ 141:2                                                                                  |      ^ FH @ 345:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 346  ::-webkit-datetime-edit-second-field,
           ^ FI @ 141:2                                                                                  |      ^ FI @ 346:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 347  ::-webkit-datetime-edit-millisecond-field,
           ^ FJ @ 141:2                                                                                  |      ^ FJ @ 347:0
    141    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 348  ::-webkit-datetime-edit-meridiem-field {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... FK @ 141:2-329 |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FK @ 348:0-39
    142      padding-block: 0;                                                                           | 349    padding-block: 0;
             ^^^^^^^^^^^^^^^^ FL @ 142:4-20                                                              |        ^^^^^^^^^^^^^^^^ FL @ 349:2-18
                                                                                                         | 350  }
    143    }                                                                                             | 
    144    ::-webkit-calendar-picker-indicator {                                                         | 356  ::-webkit-calendar-picker-indicator {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FM @ 144:2-38                                            |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FM @ 356:0-36
    145      line-height: 1;                                                                             | 357    line-height: 1;
             ^^^^^^^^^^^^^^ FN @ 145:4-18                                                                |        ^^^^^^^^^^^^^^ FN @ 357:2-16
                                                                                                         | 358  }
    146    }                                                                                             | 
    147    :-moz-ui-invalid {                                                                            | 364  :-moz-ui-invalid {
           ^^^^^^^^^^^^^^^^^ FO @ 147:2-19                                                               |      ^^^^^^^^^^^^^^^^^ FO @ 364:0-17
    148      box-shadow: none;                                                                           | 365    box-shadow: none;
             ^^^^^^^^^^^^^^^^ FP @ 148:4-20                                                              |        ^^^^^^^^^^^^^^^^ FP @ 365:2-18
                                                                                                         | 366  }
    149    }                                                                                             | 
    150    button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-but... | 372  button,
           ^ FQ @ 150:2                                                                                  |      ^ FQ @ 372:0
    150    button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-but... | 373  input:where([type='button'], [type='reset'], [type='submit']),
           ^ FR @ 150:2                                                                                  |      ^ FR @ 373:0
    150    button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-but... | 374  ::file-selector-button {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... FS @ 150:2-96 |      ^^^^^^^^^^^^^^^^^^^^^^^ FS @ 374:0-23
    151      appearance: button;                                                                         | 375    appearance: button;
             ^^^^^^^^^^^^^^^^^^ FT @ 151:4-22                                                            |        ^^^^^^^^^^^^^^^^^^ FT @ 375:2-20
                                                                                                         | 376  }
    152    }                                                                                             | 
    153    ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {                                    | 382  ::-webkit-inner-spin-button,
           ^ FU @ 153:2                                                                                  |      ^ FU @ 382:0
    153    ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {                                    | 383  ::-webkit-outer-spin-button {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FV @ 153:2-59                       |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FV @ 383:0-28
    154      height: auto;                                                                               | 384    height: auto;
             ^^^^^^^^^^^^ FW @ 154:4-16                                                                  |        ^^^^^^^^^^^^ FW @ 384:2-14
                                                                                                         | 385  }
    155    }                                                                                             | 
    156    [hidden]:where(:not([hidden='until-found'])) {                                                | 391  [hidden]:where(:not([hidden='until-found'])) {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FX @ 156:2-47                                   |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FX @ 391:0-45
    157      display: none !important;                                                                   | 392    display: none !important;
             ^^^^^^^^^^^^^^^^^^^^^^^^ FY @ 157:4-28                                                      |        ^^^^^^^^^^^^^^^^^^^^^^^^ FY @ 392:2-26
                                                                                                         | 393  }
    158    }                                                                                             | 
    159  }                                                                                               | 
                                                                                                         |      --- index.css ---
    160  @layer utilities;                                                                               |   5  @import './utilities.css' layer(utilities);
         ^^^^^^^^^^^^^^^^ FZ @ 160:0-16                                                                  |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ FZ @ 5:0-42
                                                                                                         |      --- input.css ---
    161  .foo {                                                                                          |   3  .foo {
         ^^^^^ GA @ 161:0-5                                                                              |      ^^^^^ GA @ 3:0-5
    162    text-decoration-line: underline;                                                              |   4    @apply underline;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ GB @ 162:2-33                                                 |               ^^^^^^^^^ GB @ 4:9-18
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
     4    }                         | 
     5  }                           | 
     6  @layer base {               | 2  @config "./config.js";
        ^^^^^^^^^^^^ B @ 6:0-12     |    ^^^^^^^^^^^^^^^^^^^^^ B @ 2:0-21
     7    body {                    | 
          ^^^^^ B @ 7:2-7           | 
     8      color: green;           | 
            ^^^^^^^^^^^^ B @ 8:4-16 | 
     9    }                         | 
    10  }                           | 
    11                              | 
    "
  `)
})
