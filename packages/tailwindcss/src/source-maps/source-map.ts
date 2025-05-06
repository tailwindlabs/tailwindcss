import { walk, type AstNode } from '../ast'
import { DefaultMap } from '../utils/default-map'
import { createLineTable, type LineTable, type Position } from './line-table'
import type { Source } from './source'

// https://tc39.es/ecma426/#sec-original-position-record-type
export interface OriginalPosition extends Position {
  source: DecodedSource
}

/**
 * A "decoded" sourcemap
 *
 * @see https://tc39.es/ecma426/#decoded-source-map-record
 */
export interface DecodedSourceMap {
  file: string | null
  sources: DecodedSource[]
  mappings: DecodedMapping[]
}

/**
 * A "decoded" source
 *
 * @see https://tc39.es/ecma426/#decoded-source-record
 */
export interface DecodedSource {
  url: string | null
  content: string | null
  ignore: boolean
}

/**
 * A "decoded" mapping
 *
 * @see https://tc39.es/ecma426/#decoded-mapping-record
 */
export interface DecodedMapping {
  // https://tc39.es/ecma426/#sec-original-position-record-type
  originalPosition: OriginalPosition | null

  // https://tc39.es/ecma426/#sec-position-record-type
  generatedPosition: Position

  name: string | null
}

/**
 * Build a source map from the given AST.
 *
 * Our AST is build from flat CSS strings but there are many because we handle
 * `@import`. This means that different nodes can have a different source.
 *
 * Instead of taking an input source map, we take the input CSS string we were
 * originally given, as well as the source text for any imported files, and
 * use that to generate a source map.
 *
 * We then require the use of other tools that can translate one or more
 * "input" source maps into a final output source map. For example,
 * `@ampproject/remapping` can be used to handle this.
 *
 * This also ensures that tools that expect "local" source maps are able to
 * consume the source map we generate.
 *
 * The source map type we generate may be a bit different from "raw" source maps
 * that the `source-map-js` package uses. It's a "decoded" source map that is
 * represented by an object graph. It's identical to "decoded" source map from
 * the ECMA-426 spec for source maps.
 *
 * Note that the spec itself is still evolving which means our implementation
 * may need to evolve to match it.
 *
 * This can easily be converted to a "raw" source map by any tool that needs to.
 **/
export function createSourceMap({ ast }: { ast: AstNode[] }) {
  // Compute line tables for both the original and generated source lazily so we
  // don't have to do it during parsing or printing.
  let lineTables = new DefaultMap<Source, LineTable>((src) => createLineTable(src.code))
  let sourceTable = new DefaultMap<Source, DecodedSource>((src) => ({
    url: src.file,
    content: src.code,
    ignore: false,
  }))

  // Convert each mapping to a set of positions
  let map: DecodedSourceMap = {
    file: null,
    sources: [],
    mappings: [],
  }

  // Get all the indexes from the mappings
  walk(ast, (node: AstNode) => {
    if (!node.src || !node.dst) return

    let originalSource = sourceTable.get(node.src[0])
    if (!originalSource.content) return

    let originalTable = lineTables.get(node.src[0])
    let generatedTable = lineTables.get(node.dst[0])

    let originalSlice = originalSource.content.slice(node.src[1], node.src[2])

    // Source maps only encode single locations — not multi-line ranges
    // So to properly emulate this we'll scan the original text for multiple
    // lines and create mappings for each of those lines that point to the
    // destination node (whether it spans multiple lines or not)
    //
    // This is not 100% accurate if both the source and destination preserve
    // their newlines but this only happens in the case of custom properties
    //
    // This is _good enough_
    let offset = 0
    for (let line of originalSlice.split('\n')) {
      if (line.trim() !== '') {
        let originalStart = originalTable.find(node.src[1] + offset)
        let generatedStart = generatedTable.find(node.dst[1])

        map.mappings.push({
          name: null,
          originalPosition: {
            source: originalSource,
            ...originalStart,
          },
          generatedPosition: generatedStart,
        })
      }

      offset += line.length
      offset += 1
    }

    let originalEnd = originalTable.find(node.src[2])
    let generatedEnd = generatedTable.find(node.dst[2])

    map.mappings.push({
      name: null,
      originalPosition: {
        source: originalSource,
        ...originalEnd,
      },
      generatedPosition: generatedEnd,
    })
  })

  // Populate
  for (let source of lineTables.keys()) {
    map.sources.push(sourceTable.get(source))
  }

  // Sort the mappings in ascending order
  map.mappings.sort((a, b) => {
    return (
      a.generatedPosition.line - b.generatedPosition.line ||
      a.generatedPosition.column - b.generatedPosition.column ||
      (a.originalPosition?.line ?? 0) - (b.originalPosition?.line ?? 0) ||
      (a.originalPosition?.column ?? 0) - (b.originalPosition?.column ?? 0)
    )
  })

  return map
}

export function createTranslationMap({
  original,
  generated,
}: {
  original: string
  generated: string
}) {
  // Compute line tables for both the original and generated source lazily so we
  // don't have to do it during parsing or printing.
  let originalTable = createLineTable(original)
  let generatedTable = createLineTable(generated)

  type Translation = [
    originalStart: Position,
    originalEnd: Position,
    generatedStart: Position | null,
    generatedEnd: Position | null,
  ]

  return (node: AstNode) => {
    if (!node.src) return []

    let translations: Translation[] = []

    translations.push([
      originalTable.find(node.src[1]),
      originalTable.find(node.src[2]),
      node.dst ? generatedTable.find(node.dst[1]) : null,
      node.dst ? generatedTable.find(node.dst[2]) : null,
    ])

    return translations
  }
}
