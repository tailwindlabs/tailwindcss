import remapping from '@ampproject/remapping'
import dedent from 'dedent'
import MagicString from 'magic-string'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { SourceMapConsumer, SourceMapGenerator, type RawSourceMap } from 'source-map-js'
import { test } from 'vitest'
import { compile } from '..'
import createPlugin from '../plugin'
import { DefaultMap } from '../utils/default-map'
import type { DecodedSource, DecodedSourceMap } from './source-map'
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
  let annotations = formattedMappings(map)

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

/**
 * An string annotation that represents a source map
 *
 * It's not meant to be exhaustive just enough to
 * verify that the source map is working and that
 * lines are mapped back to the original source
 *
 * Including when using @apply with multiple classes
 */
function formattedMappings(map: RawSourceMap) {
  const smc = new SourceMapConsumer(map)
  const annotations: Record<
    number,
    {
      original: { start: [number, number]; end: [number, number] }
      generated: { start: [number, number]; end: [number, number] }
      source: string
    }
  > = {}

  smc.eachMapping((mapping) => {
    let annotation = (annotations[mapping.generatedLine] = annotations[mapping.generatedLine] || {
      ...mapping,

      original: {
        start: [mapping.originalLine, mapping.originalColumn],
        end: [mapping.originalLine, mapping.originalColumn],
      },

      generated: {
        start: [mapping.generatedLine, mapping.generatedColumn],
        end: [mapping.generatedLine, mapping.generatedColumn],
      },

      source: mapping.source,
    })

    annotation.generated.end[0] = mapping.generatedLine
    annotation.generated.end[1] = mapping.generatedColumn

    annotation.original.end[0] = mapping.originalLine!
    annotation.original.end[1] = mapping.originalColumn!
  })

  return Object.values(annotations).map((annotation) => {
    return `${annotation.source}: ${formatRange(annotation.generated)} <- ${formatRange(annotation.original)}`
  })
}

function formatRange(range: { start: [number, number]; end: [number, number] }) {
  if (range.start[0] === range.end[0]) {
    // This range is on the same line
    // and the columns are the same
    if (range.start[1] === range.end[1]) {
      return `${range.start[0]}:${range.start[1]}`
    }

    // This range is on the same line
    // but the columns are different
    return `${range.start[0]}:${range.start[1]}-${range.end[1]}`
  }

  // This range spans multiple lines
  return `${range.start[0]}:${range.start[1]}-${range.end[0]}:${range.end[1]}`
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
  expect(annotations).toEqual([
    'index.css: 1:0-41 <- 1:0-41',
    'index.css: 2:0-13 <- 3:0-34',
    'theme.css: 3:2-15 <- 1:0-15',
    'theme.css: 4:4 <- 2:2-4:0',
    'theme.css: 5:22 <- 4:22',
    'theme.css: 6:4 <- 6:2-8:0',
    'theme.css: 7:13 <- 8:13',
    'theme.css: 8:4-43 <- 446:2-54',
    'theme.css: 9:4-48 <- 449:2-59',
    'index.css: 12:0-12 <- 4:0-37',
    'preflight.css: 13:2-59 <- 7:0-11:23',
    'preflight.css: 14:4-26 <- 12:2-24',
    'preflight.css: 15:4-13 <- 13:2-11',
    'preflight.css: 16:4-14 <- 14:2-12',
    'preflight.css: 17:4-19 <- 15:2-17',
    'preflight.css: 19:2-14 <- 28:0-29:6',
    'preflight.css: 20:4-20 <- 30:2-18',
    'preflight.css: 21:4-34 <- 31:2-32',
    'preflight.css: 22:4-15 <- 32:2-13',
    'preflight.css: 23:4-159 <- 33:2-42:3',
    'preflight.css: 24:4-71 <- 43:2-73',
    'preflight.css: 25:4-75 <- 44:2-77',
    'preflight.css: 26:4-44 <- 45:2-42',
    'preflight.css: 28:2-5 <- 54:0-3',
    'preflight.css: 29:4-13 <- 55:2-11',
    'preflight.css: 30:4-18 <- 56:2-16',
    'preflight.css: 31:4-25 <- 57:2-23',
    'preflight.css: 33:2-22 <- 64:0-20',
    'preflight.css: 34:4-45 <- 65:2-43',
    'preflight.css: 35:4-37 <- 66:2-35',
    'preflight.css: 37:2-25 <- 73:0-78:3',
    'preflight.css: 38:4-22 <- 79:2-20',
    'preflight.css: 39:4-24 <- 80:2-22',
    'preflight.css: 41:2-4 <- 87:0-2',
    'preflight.css: 42:4-18 <- 88:2-16',
    'preflight.css: 43:4-36 <- 89:2-34',
    'preflight.css: 44:4-28 <- 90:2-26',
    'preflight.css: 46:2-12 <- 97:0-98:7',
    'preflight.css: 47:4-23 <- 99:2-21',
    'preflight.css: 49:2-23 <- 109:0-112:4',
    'preflight.css: 50:4-148 <- 113:2-123:3',
    'preflight.css: 51:4-76 <- 124:2-78',
    'preflight.css: 52:4-80 <- 125:2-82',
    'preflight.css: 53:4-18 <- 126:2-16',
    'preflight.css: 55:2-8 <- 133:0-6',
    'preflight.css: 56:4-18 <- 134:2-16',
    'preflight.css: 58:2-11 <- 141:0-142:4',
    'preflight.css: 59:4-18 <- 143:2-16',
    'preflight.css: 60:4-18 <- 144:2-16',
    'preflight.css: 61:4-22 <- 145:2-20',
    'preflight.css: 62:4-28 <- 146:2-26',
    'preflight.css: 64:2-6 <- 149:0-4',
    'preflight.css: 65:4-19 <- 150:2-17',
    'preflight.css: 67:2-6 <- 153:0-4',
    'preflight.css: 68:4-15 <- 154:2-13',
    'preflight.css: 70:2-8 <- 163:0-6',
    'preflight.css: 71:4-18 <- 164:2-16',
    'preflight.css: 72:4-25 <- 165:2-23',
    'preflight.css: 73:4-29 <- 166:2-27',
    'preflight.css: 75:2-18 <- 173:0-16',
    'preflight.css: 76:4-17 <- 174:2-15',
    'preflight.css: 78:2-11 <- 181:0-9',
    'preflight.css: 79:4-28 <- 182:2-26',
    'preflight.css: 81:2-10 <- 189:0-8',
    'preflight.css: 82:4-22 <- 190:2-20',
    'preflight.css: 84:2-15 <- 197:0-199:5',
    'preflight.css: 85:4-20 <- 200:2-18',
    'preflight.css: 87:2-56 <- 209:0-216:7',
    'preflight.css: 88:4-18 <- 217:2-16',
    'preflight.css: 89:4-26 <- 218:2-24',
    'preflight.css: 91:2-13 <- 225:0-226:6',
    'preflight.css: 92:4-19 <- 227:2-17',
    'preflight.css: 93:4-16 <- 228:2-14',
    'preflight.css: 95:2-68 <- 238:0-243:23',
    'preflight.css: 96:4-17 <- 244:2-15',
    'preflight.css: 97:4-34 <- 245:2-32',
    'preflight.css: 98:4-36 <- 246:2-34',
    'preflight.css: 99:4-27 <- 247:2-25',
    'preflight.css: 100:4-18 <- 248:2-16',
    'preflight.css: 101:4-20 <- 249:2-18',
    'preflight.css: 102:4-33 <- 250:2-31',
    'preflight.css: 103:4-14 <- 251:2-12',
    'preflight.css: 105:2-49 <- 258:0-47',
    'preflight.css: 106:4-23 <- 259:2-21',
    'preflight.css: 108:2-56 <- 266:0-54',
    'preflight.css: 109:4-30 <- 267:2-28',
    'preflight.css: 111:2-25 <- 274:0-23',
    'preflight.css: 112:4-26 <- 275:2-24',
    'preflight.css: 114:2-16 <- 282:0-14',
    'preflight.css: 115:4-14 <- 283:2-12',
    'preflight.css: 117:2-92 <- 291:0-292:49',
    'preflight.css: 118:4-18 <- 293:2-16',
    'preflight.css: 119:6-25 <- 294:4-61',
    'preflight.css: 120:6-53 <- 294:4-61',
    'preflight.css: 121:8-65 <- 294:4-61',
    'preflight.css: 125:2-11 <- 302:0-9',
    'preflight.css: 126:4-20 <- 303:2-18',
    'preflight.css: 128:2-30 <- 310:0-28',
    'preflight.css: 129:4-28 <- 311:2-26',
    'preflight.css: 131:2-32 <- 319:0-30',
    'preflight.css: 132:4-19 <- 320:2-17',
    'preflight.css: 133:4-23 <- 321:2-21',
    'preflight.css: 135:2-26 <- 328:0-24',
    'preflight.css: 136:4-24 <- 329:2-22',
    'preflight.css: 138:2-41 <- 336:0-39',
    'preflight.css: 139:4-14 <- 337:2-12',
    'preflight.css: 141:2-329 <- 340:0-348:39',
    'preflight.css: 142:4-20 <- 349:2-18',
    'preflight.css: 144:2-38 <- 356:0-36',
    'preflight.css: 145:4-18 <- 357:2-16',
    'preflight.css: 147:2-19 <- 364:0-17',
    'preflight.css: 148:4-20 <- 365:2-18',
    'preflight.css: 150:2-96 <- 372:0-374:23',
    'preflight.css: 151:4-22 <- 375:2-20',
    'preflight.css: 153:2-59 <- 382:0-383:28',
    'preflight.css: 154:4-16 <- 384:2-14',
    'preflight.css: 156:2-47 <- 391:0-45',
    'preflight.css: 157:4-28 <- 392:2-26',
    'index.css: 160:0-16 <- 5:0-42',
    'input.css: 161:0-5 <- 3:0-5',
    'input.css: 162:2-33 <- 4:9-18',
  ])
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
  expect(annotations).toEqual([
    // @tailwind utilities
    'utilities.css: 1:0-6 <- 1:0-19',
    'utilities.css: 2:2-15 <- 1:0-19',
    'utilities.css: 4:0-8 <- 1:0-19',
    // color: orange
    'input.css: 5:2-15 <- 4:2-15',
    // @tailwind utilities
    'utilities.css: 7:0-11 <- 1:0-19',
    'utilities.css: 8:2-13 <- 1:0-19',
  ])

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

  expect(annotations).toEqual([
    //
    'input.css: 1:0-11 <- 1:0-19',
    'input.css: 2:2-33 <- 1:0-19',
  ])
})

test('@apply generates source maps', async ({ expect }) => {
  let { sources, annotations } = await run({
    input: css`
      .foo {
        color: blue;
        @apply text-[#000] hover:text-[#f00];
        @apply underline;
        color: red;
      }
    `,
  })

  expect(sources).toEqual(['input.css'])

  expect(annotations).toEqual([
    'input.css: 1:0-5 <- 1:0-5',
    'input.css: 2:2-13 <- 2:2-13',
    'input.css: 3:2-13 <- 3:9-20',
    'input.css: 4:2-10 <- 3:21-38',
    'input.css: 5:4-26 <- 3:21-38',
    'input.css: 6:6-17 <- 3:21-38',
    'input.css: 9:2-33 <- 4:9-18',
    'input.css: 10:2-12 <- 5:2-12',
  ])
})

test('license comments preserve source locations', async ({ expect }) => {
  let { sources, annotations } = await run({
    input: `/*! some comment */`,
  })

  expect(sources).toEqual(['input.css'])

  expect(annotations).toEqual([
    //
    'input.css: 1:0-19 <- 1:0-19',
  ])
})

test('license comments with new lines preserve source locations', async ({ expect }) => {
  let { sources, annotations, css } = await run({
    input: `/*! some \n comment */`,
  })

  expect(sources).toEqual(['input.css'])

  expect(annotations).toEqual([
    //
    'input.css: 1:0 <- 1:0-2:0',
    'input.css: 2:11 <- 2:11',
  ])
})

test('Source locations for `addBase` point to the `@plugin` that generated them', async ({
  expect,
}) => {
  let { sources, annotations } = await run({
    input: dedent`
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

  expect(annotations).toEqual([
    //
    'input.css: 1:0-12 <- 1:0-21',
    'input.css: 2:2-7 <- 1:0-21',
    'input.css: 3:4-14 <- 1:0-21',
    'input.css: 6:0-12 <- 2:0-21',
    'input.css: 7:2-7 <- 2:0-21',
    'input.css: 8:4-16 <- 2:0-21',
  ])
})
