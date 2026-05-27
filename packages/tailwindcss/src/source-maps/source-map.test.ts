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
      3    :root, :host {                                                                                |   2    --font-sans:
           ^ C @ 3:2                                                                                     |        ^ C @ 2:2
      3    :root, :host {                                                                                |   3      ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI S...
           ^ D @ 3:2                                                                                     |      ^ D @ 3:0
      3    :root, :host {                                                                                |   4      'Noto Color Emoji';
           ^^^^^^^^^^^^^ E @ 3:2-15                                                                      |      ^^^^^^^^^^^^^^^^^^^^^^ E @ 4:0-22
      4      --font-sans: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'... | 
             ^ C @ 4:4                                                                                   | 
      4      --font-sans: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'... | 
             ^ D @ 4:4                                                                                   | 
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
     13    *, ::after, ::before, ::backdrop, ::file-selector-button {                                    |  12    box-sizing: border-box; /* 1 */
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ O @ 13:2-59                         |        ^^^^^^^^^^^^^^^^^^^^^^ O @ 12:2-24
     14      box-sizing: border-box;                                                                     | 
             ^^^^^^^^^^^^^^^^^^^^^^ O @ 14:4-26                                                          | 
     15      margin: 0;                                                                                  |  13    margin: 0; /* 2 */
             ^^^^^^^^^ P @ 15:4-13                                                                       |        ^^^^^^^^^ P @ 13:2-11
     16      padding: 0;                                                                                 |  14    padding: 0; /* 2 */
             ^^^^^^^^^^ Q @ 16:4-14                                                                      |        ^^^^^^^^^^ Q @ 14:2-12
     17      border: 0 solid;                                                                            |  15    border: 0 solid; /* 3 */
             ^^^^^^^^^^^^^^^ R @ 17:4-19                                                                 |        ^^^^^^^^^^^^^^^ R @ 15:2-17
                                                                                                         |  16  }
     18    }                                                                                             | 
     19    html, :host {                                                                                 |  30    line-height: 1.5; /* 1 */
           ^^^^^^^^^^^^ S @ 19:2-14                                                                      |        ^^^^^^^^^^^^^^^^ S @ 30:2-18
     20      line-height: 1.5;                                                                           | 
             ^^^^^^^^^^^^^^^^ S @ 20:4-20                                                                | 
     21      -webkit-text-size-adjust: 100%;                                                             |  31    -webkit-text-size-adjust: 100%; /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ T @ 21:4-34                                                  |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ T @ 31:2-32
     22      tab-size: 4;                                                                                |  32    tab-size: 4; /* 3 */
             ^^^^^^^^^^^ U @ 22:4-15                                                                     |        ^^^^^^^^^^^ U @ 32:2-13
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  33    font-family: --theme(
             ^ V @ 23:4                                                                                  |        ^ V @ 33:2
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  34      --default-font-family,
             ^ W @ 23:4                                                                                  |      ^ W @ 34:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  35      ui-sans-serif,
             ^ X @ 23:4                                                                                  |      ^ X @ 35:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  36      system-ui,
             ^ Y @ 23:4                                                                                  |      ^ Y @ 36:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  37      sans-serif,
             ^ Z @ 23:4                                                                                  |      ^ Z @ 37:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  38      'Apple Color Emoji',
             ^ AA @ 23:4                                                                                 |      ^ AA @ 38:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  39      'Segoe UI Emoji',
             ^ AB @ 23:4                                                                                 |      ^ AB @ 39:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  40      'Segoe UI Symbol',
             ^ AC @ 23:4                                                                                 |      ^ AC @ 40:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  41      'Noto Color Emoji'
             ^ AD @ 23:4                                                                                 |      ^ AD @ 41:0
     23      font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Col... |  42    ); /* 4 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... AE @ 23:4-159 |      ^^^ AE @ 42:0-3
     24      font-feature-settings: var(--default-font-feature-settings, normal);                        |  43    font-feature-settings: --theme(--default-font-feature-settings, normal); /* 5 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AF @ 24:4-71            |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AF @ 43:2-73
     25      font-variation-settings: var(--default-font-variation-settings, normal);                    |  44    font-variation-settings: --theme(--default-font-variation-settings, normal); /* 6 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AG @ 25:4-75        |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AG @ 44:2-77
     26      -webkit-tap-highlight-color: transparent;                                                   |  45    -webkit-tap-highlight-color: transparent; /* 7 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AH @ 26:4-44                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AH @ 45:2-42
                                                                                                         |  46  }
     27    }                                                                                             | 
     28    hr {                                                                                          |  55    height: 0; /* 1 */
           ^^^ AI @ 28:2-5                                                                               |        ^^^^^^^^^ AI @ 55:2-11
     29      height: 0;                                                                                  | 
             ^^^^^^^^^ AI @ 29:4-13                                                                      | 
     30      color: inherit;                                                                             |  56    color: inherit; /* 2 */
             ^^^^^^^^^^^^^^ AJ @ 30:4-18                                                                 |        ^^^^^^^^^^^^^^ AJ @ 56:2-16
     31      border-top-width: 1px;                                                                      |  57    border-top-width: 1px; /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^ AK @ 31:4-25                                                          |        ^^^^^^^^^^^^^^^^^^^^^ AK @ 57:2-23
                                                                                                         |  58  }
     32    }                                                                                             | 
     33    abbr:where([title]) {                                                                         |  65    -webkit-text-decoration: underline dotted;
           ^^^^^^^^^^^^^^^^^^^^ AL @ 33:2-22                                                             |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AL @ 65:2-43
     34      -webkit-text-decoration: underline dotted;                                                  | 
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AL @ 34:4-45                                      | 
     35      text-decoration: underline dotted;                                                          |  66    text-decoration: underline dotted;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AM @ 35:4-37                                              |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AM @ 66:2-35
                                                                                                         |  67  }
     36    }                                                                                             | 
     37    h1, h2, h3, h4, h5, h6 {                                                                      |  79    font-size: inherit;
           ^^^^^^^^^^^^^^^^^^^^^^^ AN @ 37:2-25                                                          |        ^^^^^^^^^^^^^^^^^^ AN @ 79:2-20
     38      font-size: inherit;                                                                         | 
             ^^^^^^^^^^^^^^^^^^ AN @ 38:4-22                                                             | 
     39      font-weight: inherit;                                                                       |  80    font-weight: inherit;
             ^^^^^^^^^^^^^^^^^^^^ AO @ 39:4-24                                                           |        ^^^^^^^^^^^^^^^^^^^^ AO @ 80:2-22
                                                                                                         |  81  }
     40    }                                                                                             | 
     41    a {                                                                                           |  88    color: inherit;
           ^^ AP @ 41:2-4                                                                                |        ^^^^^^^^^^^^^^ AP @ 88:2-16
     42      color: inherit;                                                                             | 
             ^^^^^^^^^^^^^^ AP @ 42:4-18                                                                 | 
     43      -webkit-text-decoration: inherit;                                                           |  89    -webkit-text-decoration: inherit;
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AQ @ 43:4-36                                               |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ AQ @ 89:2-34
     44      text-decoration: inherit;                                                                   |  90    text-decoration: inherit;
             ^^^^^^^^^^^^^^^^^^^^^^^^ AR @ 44:4-28                                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^ AR @ 90:2-26
                                                                                                         |  91  }
     45    }                                                                                             | 
     46    b, strong {                                                                                   |  99    font-weight: bolder;
           ^^^^^^^^^^ AS @ 46:2-12                                                                       |        ^^^^^^^^^^^^^^^^^^^ AS @ 99:2-21
                                                                                                         | 100  }
     47      font-weight: bolder;                                                                        | 
             ^^^^^^^^^^^^^^^^^^^ AS @ 47:4-23                                                            | 
     48    }                                                                                             | 
     49    code, kbd, samp, pre {                                                                        | 113    font-family: --theme(
           ^ AT @ 49:2                                                                                   |        ^ AT @ 113:2
     49    code, kbd, samp, pre {                                                                        | 114      --default-mono-font-family,
           ^ AU @ 49:2                                                                                   |      ^ AU @ 114:0
     49    code, kbd, samp, pre {                                                                        | 115      ui-monospace,
           ^ AV @ 49:2                                                                                   |      ^ AV @ 115:0
     49    code, kbd, samp, pre {                                                                        | 116      SFMono-Regular,
           ^ AW @ 49:2                                                                                   |      ^ AW @ 116:0
     49    code, kbd, samp, pre {                                                                        | 117      Menlo,
           ^ AX @ 49:2                                                                                   |      ^ AX @ 117:0
     49    code, kbd, samp, pre {                                                                        | 118      Monaco,
           ^ AY @ 49:2                                                                                   |      ^ AY @ 118:0
     49    code, kbd, samp, pre {                                                                        | 119      Consolas,
           ^ AZ @ 49:2                                                                                   |      ^ AZ @ 119:0
     49    code, kbd, samp, pre {                                                                        | 120      'Liberation Mono',
           ^ BA @ 49:2                                                                                   |      ^ BA @ 120:0
     49    code, kbd, samp, pre {                                                                        | 121      'Courier New',
           ^ BB @ 49:2                                                                                   |      ^ BB @ 121:0
     49    code, kbd, samp, pre {                                                                        | 122      monospace
           ^ BC @ 49:2                                                                                   |      ^ BC @ 122:0
     49    code, kbd, samp, pre {                                                                        | 123    ); /* 1 */
           ^^^^^^^^^^^^^^^^^^^^^ BD @ 49:2-23                                                            |      ^^^ BD @ 123:0-3
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^ AT @ 50:4                                                                                 | 
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^ AU @ 50:4                                                                                 | 
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^ AV @ 50:4                                                                                 | 
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^ AW @ 50:4                                                                                 | 
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^ AX @ 50:4                                                                                 | 
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^ AY @ 50:4                                                                                 | 
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^ AZ @ 50:4                                                                                 | 
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^ BA @ 50:4                                                                                 | 
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^ BB @ 50:4                                                                                 | 
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^ BC @ 50:4                                                                                 | 
     50      font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco... | 
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... BD @ 50:4-148 | 
     51      font-feature-settings: var(--default-mono-font-feature-settings, normal);                   | 124    font-feature-settings: --theme(--default-mono-font-feature-settings, normal); /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BE @ 51:4-76       |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BE @ 124:2-78
     52      font-variation-settings: var(--default-mono-font-variation-settings, normal);               | 125    font-variation-settings: --theme(--default-mono-font-variation-settings, normal); /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BF @ 52:4-80   |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... BF @ 125:2-82
     53      font-size: 1em;                                                                             | 126    font-size: 1em; /* 4 */
             ^^^^^^^^^^^^^^ BG @ 53:4-18                                                                 |        ^^^^^^^^^^^^^^ BG @ 126:2-16
                                                                                                         | 127  }
     54    }                                                                                             | 
     55    small {                                                                                       | 134    font-size: 80%;
           ^^^^^^ BH @ 55:2-8                                                                            |        ^^^^^^^^^^^^^^ BH @ 134:2-16
                                                                                                         | 135  }
     56      font-size: 80%;                                                                             | 
             ^^^^^^^^^^^^^^ BH @ 56:4-18                                                                 | 
     57    }                                                                                             | 
     58    sub, sup {                                                                                    | 143    font-size: 75%;
           ^^^^^^^^^ BI @ 58:2-11                                                                        |        ^^^^^^^^^^^^^^ BI @ 143:2-16
     59      font-size: 75%;                                                                             | 
             ^^^^^^^^^^^^^^ BI @ 59:4-18                                                                 | 
     60      line-height: 0;                                                                             | 144    line-height: 0;
             ^^^^^^^^^^^^^^ BJ @ 60:4-18                                                                 |        ^^^^^^^^^^^^^^ BJ @ 144:2-16
     61      position: relative;                                                                         | 145    position: relative;
             ^^^^^^^^^^^^^^^^^^ BK @ 61:4-22                                                             |        ^^^^^^^^^^^^^^^^^^ BK @ 145:2-20
     62      vertical-align: baseline;                                                                   | 146    vertical-align: baseline;
             ^^^^^^^^^^^^^^^^^^^^^^^^ BL @ 62:4-28                                                       |        ^^^^^^^^^^^^^^^^^^^^^^^^ BL @ 146:2-26
                                                                                                         | 147  }
     63    }                                                                                             | 
                                                                                                         | 149  sub {
     64    sub {                                                                                         | 150    bottom: -0.25em;
           ^^^^ BM @ 64:2-6                                                                              |        ^^^^^^^^^^^^^^^ BM @ 150:2-17
                                                                                                         | 151  }
     65      bottom: -0.25em;                                                                            | 
             ^^^^^^^^^^^^^^^ BM @ 65:4-19                                                                | 
     66    }                                                                                             | 
                                                                                                         | 153  sup {
     67    sup {                                                                                         | 154    top: -0.5em;
           ^^^^ BN @ 67:2-6                                                                              |        ^^^^^^^^^^^ BN @ 154:2-13
                                                                                                         | 155  }
     68      top: -0.5em;                                                                                | 
             ^^^^^^^^^^^ BN @ 68:4-15                                                                    | 
     69    }                                                                                             | 
     70    table {                                                                                       | 164    text-indent: 0; /* 1 */
           ^^^^^^ BO @ 70:2-8                                                                            |        ^^^^^^^^^^^^^^ BO @ 164:2-16
     71      text-indent: 0;                                                                             | 
             ^^^^^^^^^^^^^^ BO @ 71:4-18                                                                 | 
     72      border-color: inherit;                                                                      | 165    border-color: inherit; /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^ BP @ 72:4-25                                                          |        ^^^^^^^^^^^^^^^^^^^^^ BP @ 165:2-23
     73      border-collapse: collapse;                                                                  | 166    border-collapse: collapse; /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^ BQ @ 73:4-29                                                      |        ^^^^^^^^^^^^^^^^^^^^^^^^^ BQ @ 166:2-27
                                                                                                         | 167  }
     74    }                                                                                             | 
     75    :-moz-focusring {                                                                             | 174    outline: auto;
           ^^^^^^^^^^^^^^^^ BR @ 75:2-18                                                                 |        ^^^^^^^^^^^^^ BR @ 174:2-15
                                                                                                         | 175  }
     76      outline: auto;                                                                              | 
             ^^^^^^^^^^^^^ BR @ 76:4-17                                                                  | 
     77    }                                                                                             | 
     78    progress {                                                                                    | 182    vertical-align: baseline;
           ^^^^^^^^^ BS @ 78:2-11                                                                        |        ^^^^^^^^^^^^^^^^^^^^^^^^ BS @ 182:2-26
                                                                                                         | 183  }
     79      vertical-align: baseline;                                                                   | 
             ^^^^^^^^^^^^^^^^^^^^^^^^ BS @ 79:4-28                                                       | 
     80    }                                                                                             | 
     81    summary {                                                                                     | 190    display: list-item;
           ^^^^^^^^ BT @ 81:2-10                                                                         |        ^^^^^^^^^^^^^^^^^^ BT @ 190:2-20
                                                                                                         | 191  }
     82      display: list-item;                                                                         | 
             ^^^^^^^^^^^^^^^^^^ BT @ 82:4-22                                                             | 
     83    }                                                                                             | 
     84    ol, ul, menu {                                                                                | 200    list-style: none;
           ^^^^^^^^^^^^^ BU @ 84:2-15                                                                    |        ^^^^^^^^^^^^^^^^ BU @ 200:2-18
                                                                                                         | 201  }
     85      list-style: none;                                                                           | 
             ^^^^^^^^^^^^^^^^ BU @ 85:4-20                                                               | 
     86    }                                                                                             | 
     87    img, svg, video, canvas, audio, iframe, embed, object {                                       | 217    display: block; /* 1 */
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BV @ 87:2-56                           |        ^^^^^^^^^^^^^^ BV @ 217:2-16
     88      display: block;                                                                             | 
             ^^^^^^^^^^^^^^ BV @ 88:4-18                                                                 | 
     89      vertical-align: middle;                                                                     | 218    vertical-align: middle; /* 2 */
             ^^^^^^^^^^^^^^^^^^^^^^ BW @ 89:4-26                                                         |        ^^^^^^^^^^^^^^^^^^^^^^ BW @ 218:2-24
                                                                                                         | 219  }
     90    }                                                                                             | 
     91    img, video {                                                                                  | 227    max-width: 100%;
           ^^^^^^^^^^^ BX @ 91:2-13                                                                      |        ^^^^^^^^^^^^^^^ BX @ 227:2-17
     92      max-width: 100%;                                                                            | 
             ^^^^^^^^^^^^^^^ BX @ 92:4-19                                                                | 
     93      height: auto;                                                                               | 228    height: auto;
             ^^^^^^^^^^^^ BY @ 93:4-16                                                                   |        ^^^^^^^^^^^^ BY @ 228:2-14
                                                                                                         | 229  }
     94    }                                                                                             | 
     95    button, input, select, optgroup, textarea, ::file-selector-button {                           | 244    font: inherit; /* 1 */
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ BZ @ 95:2-68               |        ^^^^^^^^^^^^^ BZ @ 244:2-15
     96      font: inherit;                                                                              | 
             ^^^^^^^^^^^^^ BZ @ 96:4-17                                                                  | 
     97      font-feature-settings: inherit;                                                             | 245    font-feature-settings: inherit; /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CA @ 97:4-34                                                 |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CA @ 245:2-32
     98      font-variation-settings: inherit;                                                           | 246    font-variation-settings: inherit; /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CB @ 98:4-36                                               |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CB @ 246:2-34
     99      letter-spacing: inherit;                                                                    | 247    letter-spacing: inherit; /* 1 */
             ^^^^^^^^^^^^^^^^^^^^^^^ CC @ 99:4-27                                                        |        ^^^^^^^^^^^^^^^^^^^^^^^ CC @ 247:2-25
    100      color: inherit;                                                                             | 248    color: inherit; /* 1 */
             ^^^^^^^^^^^^^^ CD @ 100:4-18                                                                |        ^^^^^^^^^^^^^^ CD @ 248:2-16
    101      border-radius: 0;                                                                           | 249    border-radius: 0; /* 2 */
             ^^^^^^^^^^^^^^^^ CE @ 101:4-20                                                              |        ^^^^^^^^^^^^^^^^ CE @ 249:2-18
    102      background-color: transparent;                                                              | 250    background-color: transparent; /* 3 */
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CF @ 102:4-33                                                 |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CF @ 250:2-31
    103      opacity: 1;                                                                                 | 251    opacity: 1; /* 4 */
             ^^^^^^^^^^ CG @ 103:4-14                                                                    |        ^^^^^^^^^^ CG @ 251:2-12
                                                                                                         | 252  }
    104    }                                                                                             | 
    105    :where(select:is([multiple], [size])) optgroup {                                              | 259    font-weight: bolder;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CH @ 105:2-49                                 |        ^^^^^^^^^^^^^^^^^^^ CH @ 259:2-21
                                                                                                         | 260  }
    106      font-weight: bolder;                                                                        | 
             ^^^^^^^^^^^^^^^^^^^ CH @ 106:4-23                                                           | 
    107    }                                                                                             | 
    108    :where(select:is([multiple], [size])) optgroup option {                                       | 267    padding-inline-start: 20px;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CI @ 108:2-56                          |        ^^^^^^^^^^^^^^^^^^^^^^^^^^ CI @ 267:2-28
                                                                                                         | 268  }
    109      padding-inline-start: 20px;                                                                 | 
             ^^^^^^^^^^^^^^^^^^^^^^^^^^ CI @ 109:4-30                                                    | 
    110    }                                                                                             | 
    111    ::file-selector-button {                                                                      | 275    margin-inline-end: 4px;
           ^^^^^^^^^^^^^^^^^^^^^^^ CJ @ 111:2-25                                                         |        ^^^^^^^^^^^^^^^^^^^^^^ CJ @ 275:2-24
                                                                                                         | 276  }
    112      margin-inline-end: 4px;                                                                     | 
             ^^^^^^^^^^^^^^^^^^^^^^ CJ @ 112:4-26                                                        | 
    113    }                                                                                             | 
    114    ::placeholder {                                                                               | 283    opacity: 1;
           ^^^^^^^^^^^^^^ CK @ 114:2-16                                                                  |        ^^^^^^^^^^ CK @ 283:2-12
                                                                                                         | 284  }
    115      opacity: 1;                                                                                 | 
             ^^^^^^^^^^ CK @ 115:4-14                                                                    | 
    116    }                                                                                             | 
    117    @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {   | 291  @supports (not (-webkit-appearance: -apple-pay-button)) /* Not Safari */ or
           ^ CL @ 117:2                                                                                  |      ^ CL @ 291:0
    117    @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {   | 292    (contain-intrinsic-size: 1px) /* Safari 17+ */ {
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... CM @ 117:2-92 |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CM @ 292:0-49
                                                                                                         | 293    ::placeholder {
    118      ::placeholder {                                                                             | 294      color: color-mix(in oklab, currentcolor 50%, transparent);
             ^^^^^^^^^^^^^^ CN @ 118:4-18                                                                |          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CN @ 294:4-61
                                                                                                         | 295    }
                                                                                                         | 296  }
    119        color: currentcolor;                                                                      | 
               ^^^^^^^^^^^^^^^^^^^ CN @ 119:6-25                                                         | 
    120      }                                                                                           | 
    121      @supports (color: color-mix(in lab, red, red)) {                                            | 
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CN @ 121:4-51                               | 
    122        ::placeholder {                                                                           | 
               ^^^^^^^^^^^^^^ CN @ 122:6-20                                                              | 
    123          color: color-mix(in oklab, currentcolor 50%, transparent);                              | 
                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CN @ 123:8-65                 | 
    124        }                                                                                         | 
    125      }                                                                                           | 
    126    }                                                                                             | 
    127    textarea {                                                                                    | 303    resize: vertical;
           ^^^^^^^^^ CO @ 127:2-11                                                                       |        ^^^^^^^^^^^^^^^^ CO @ 303:2-18
                                                                                                         | 304  }
    128      resize: vertical;                                                                           | 
             ^^^^^^^^^^^^^^^^ CO @ 128:4-20                                                              | 
    129    }                                                                                             | 
    130    ::-webkit-search-decoration {                                                                 | 311    -webkit-appearance: none;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CP @ 130:2-30                                                    |        ^^^^^^^^^^^^^^^^^^^^^^^^ CP @ 311:2-26
                                                                                                         | 312  }
    131      -webkit-appearance: none;                                                                   | 
             ^^^^^^^^^^^^^^^^^^^^^^^^ CP @ 131:4-28                                                      | 
    132    }                                                                                             | 
    133    ::-webkit-date-and-time-value {                                                               | 320    min-height: 1lh; /* 1 */
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CQ @ 133:2-32                                                  |        ^^^^^^^^^^^^^^^ CQ @ 320:2-17
    134      min-height: 1lh;                                                                            | 
             ^^^^^^^^^^^^^^^ CQ @ 134:4-19                                                               | 
    135      text-align: inherit;                                                                        | 321    text-align: inherit; /* 2 */
             ^^^^^^^^^^^^^^^^^^^ CR @ 135:4-23                                                           |        ^^^^^^^^^^^^^^^^^^^ CR @ 321:2-21
                                                                                                         | 322  }
    136    }                                                                                             | 
    137    ::-webkit-datetime-edit {                                                                     | 329    display: inline-flex;
           ^^^^^^^^^^^^^^^^^^^^^^^^ CS @ 137:2-26                                                        |        ^^^^^^^^^^^^^^^^^^^^ CS @ 329:2-22
                                                                                                         | 330  }
    138      display: inline-flex;                                                                       | 
             ^^^^^^^^^^^^^^^^^^^^ CS @ 138:4-24                                                          | 
    139    }                                                                                             | 
    140    ::-webkit-datetime-edit-fields-wrapper {                                                      | 337    padding: 0;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CT @ 140:2-41                                         |        ^^^^^^^^^^ CT @ 337:2-12
                                                                                                         | 338  }
    141      padding: 0;                                                                                 | 
             ^^^^^^^^^^ CT @ 141:4-14                                                                    | 
    142    }                                                                                             | 
    143    ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month... | 349    padding-block: 0;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... CU @ 143:2-329 |        ^^^^^^^^^^^^^^^^ CU @ 349:2-18
                                                                                                         | 350  }
    144      padding-block: 0;                                                                           | 
             ^^^^^^^^^^^^^^^^ CU @ 144:4-20                                                              | 
    145    }                                                                                             | 
    146    ::-webkit-calendar-picker-indicator {                                                         | 357    line-height: 1;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CV @ 146:2-38                                            |        ^^^^^^^^^^^^^^ CV @ 357:2-16
                                                                                                         | 358  }
    147      line-height: 1;                                                                             | 
             ^^^^^^^^^^^^^^ CV @ 147:4-18                                                                | 
    148    }                                                                                             | 
    149    :-moz-ui-invalid {                                                                            | 365    box-shadow: none;
           ^^^^^^^^^^^^^^^^^ CW @ 149:2-19                                                               |        ^^^^^^^^^^^^^^^^ CW @ 365:2-18
                                                                                                         | 366  }
    150      box-shadow: none;                                                                           | 
             ^^^^^^^^^^^^^^^^ CW @ 150:4-20                                                              | 
    151    }                                                                                             | 
    152    button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-but... | 375    appearance: button;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^... CX @ 152:2-96 |        ^^^^^^^^^^^^^^^^^^ CX @ 375:2-20
                                                                                                         | 376  }
    153      appearance: button;                                                                         | 
             ^^^^^^^^^^^^^^^^^^ CX @ 153:4-22                                                            | 
    154    }                                                                                             | 
    155    ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {                                    | 384    height: auto;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CY @ 155:2-59                       |        ^^^^^^^^^^^^ CY @ 384:2-14
                                                                                                         | 385  }
    156      height: auto;                                                                               | 
             ^^^^^^^^^^^^ CY @ 156:4-16                                                                  | 
    157    }                                                                                             | 
    158    [hidden]:where(:not([hidden='until-found'])) {                                                | 392    display: none !important;
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ CZ @ 158:2-47                                   |        ^^^^^^^^^^^^^^^^^^^^^^^^ CZ @ 392:2-26
                                                                                                         | 393  }
    159      display: none !important;                                                                   | 
             ^^^^^^^^^^^^^^^^^^^^^^^^ CZ @ 159:4-28                                                      | 
    160    }                                                                                             | 
    161  }                                                                                               | 
                                                                                                         |      --- index.css ---
    162  @layer utilities;                                                                               |   5  @import './utilities.css' layer(utilities);
         ^^^^^^^^^^^^^^^^ DA @ 162:0-16                                                                  |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DA @ 5:0-42
                                                                                                         |      --- input.css ---
    163  .foo {                                                                                          |   4    @apply underline;
         ^^^^^ DB @ 163:0-5                                                                              |               ^^^^^^^^^ DB @ 4:9-18
                                                                                                         |   5  }
    164    text-decoration-line: underline;                                                              | 
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DB @ 164:2-33                                                 | 
    165  }                                                                                               | 
    166                                                                                                  | 
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
                                   |    --- input.css ---
     4  .custom {                  | 4    color: orange;
        ^^^^^^^^ B @ 4:0-8         |      ^^^^^^^^^^^^^ B @ 4:2-15
                                   | 5  }
     5    color: orange;           | 
          ^^^^^^^^^^^^^ B @ 5:2-15 | 
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
     1  .foo {                                           | 2    color: blue;
        ^^^^^ A @ 1:0-5                                  |      ^^^^^^^^^^^ A @ 2:2-13
     2    color: blue;                                   | 
          ^^^^^^^^^^^ A @ 2:2-13                         | 
     3    color: #000;                                   | 3    @apply text-[#000] hover:text-[#f00];
          ^^^^^^^^^^^ B @ 3:2-13                         |             ^^^^^^^^^^^ B @ 3:9-20
     4  }                                                | 
     5  @media (hover: hover) {                          | 3    @apply text-[#000] hover:text-[#f00];
        ^^^^^^^^^^^^^^^^^^^^^^ C @ 5:0-22                |                         ^^^^^^^^^^^^^^^^^ C @ 3:21-38
     6    .foo:hover {                                   | 
          ^^^^^^^^^^^ C @ 6:2-13                         | 
     7      color: #f00;                                 | 
            ^^^^^^^^^^^ C @ 7:4-15                       | 
     8    }                                              | 
     9  }                                                | 
    10  .foo {                                           | 4    @apply underline;
        ^^^^^ D @ 10:0-5                                 |             ^^^^^^^^^ D @ 4:9-18
    11    text-decoration-line: underline;               | 
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ D @ 11:2-33    | 
    12    @apply --my-mixin-1 --my-mixin-2();            | 5    @apply --my-mixin-1 --my-mixin-2();
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ E @ 12:2-36 |      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ E @ 5:2-36
    13    color: red;                                    | 6    color: red;
          ^^^^^^^^^^ F @ 13:2-12                         |      ^^^^^^^^^^ F @ 6:2-12
                                                         | 7  }
    14  }                                                | 
    15                                                   | 
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
        output.css                                                       |     input.css
                                                                         | 
     1  .foo {                                                           |  2    color: red;
        ^^^^^ A @ 1:0-5                                                  |       ^^^^^^^^^^ A @ 2:2-12
     2    color: red;                                                    | 
          ^^^^^^^^^^ A @ 2:2-12                                          | 
     3  }                                                                | 
                                                                         |  4    @variant data-a, data-b:data-c {
     4  .foo[data-a] {                                                   |  5      color: green;
        ^^^^^^^^^^^^^ B @ 4:0-13                                         |         ^^^^^^^^^^^^ B @ 5:4-16
     5    color: green;                                                  | 
          ^^^^^^^^^^^^ B @ 5:2-14                                        | 
     6  }                                                                | 
                                                                         |  7      @variant data-d, data-e:data-f {
     7  :is(.foo[data-a])[data-d] {                                      |  8        color: blue;
        ^^^^^^^^^^^^^^^^^^^^^^^^^^ C @ 7:0-26                            |           ^^^^^^^^^^^ C @ 8:6-17
                                                                         |  9      }
                                                                         | 10    }
                                                                         | 11  }
     8    color: blue;                                                   | 
          ^^^^^^^^^^^ C @ 8:2-13                                         | 
     9  }                                                                | 
    10  :is(:is(.foo[data-a])[data-e])[data-f] {                         | 
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ C @ 10:0-39              | 
    11    color: blue;                                                   | 
          ^^^^^^^^^^^ C @ 11:2-13                                        | 
    12  }                                                                | 
    13  :is(.foo[data-b])[data-c] {                                      | 
        ^^^^^^^^^^^^^^^^^^^^^^^^^^ B @ 13:0-26                           | 
    14    color: green;                                                  | 
          ^^^^^^^^^^^^ B @ 14:2-14                                       | 
    15  }                                                                | 
    16  :is(:is(.foo[data-b])[data-c])[data-d] {                         | 
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ C @ 16:0-39              | 
    17    color: blue;                                                   | 
          ^^^^^^^^^^^ C @ 17:2-13                                        | 
    18  }                                                                | 
    19  :is(:is(:is(.foo[data-b])[data-c])[data-e])[data-f] {            | 
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ C @ 19:0-52 | 
    20    color: blue;                                                   | 
          ^^^^^^^^^^^ C @ 20:2-13                                        | 
    21  }                                                                | 
    22                                                                   | 
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
