import { SourceMapConsumer, SourceMapGenerator, type RawSourceMap } from 'source-map-js'
import { walk, type AstNode } from './ast'

export function toSourceMap(originalMap: SourceMapConsumer, ast: AstNode[]): RawSourceMap {
  let map = new SourceMapGenerator()

  walk(ast, (node) => {
    let source = node.source
    if (source === undefined) return
    if (node.destination === undefined) return

    let original = originalMap!.originalPositionFor({
      line: source.line,
      column: source.column,
    })

    if (!original?.source) return

    map.addMapping({
      generated: { line: node.destination.line, column: node.destination.column },
      original,
      source: original.source,
    })
  })

  return JSON.parse(map.toString()) as RawSourceMap
}
