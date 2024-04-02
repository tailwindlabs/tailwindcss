import { SourceMapConsumer, SourceMapGenerator, type RawSourceMap } from 'source-map-js'
import { walk, type AstNode } from './ast'

export function toSourceMap(original: SourceMapConsumer, ast: AstNode[]): RawSourceMap {
  let map = new SourceMapGenerator()

  walk(ast, (node) => {
    for (let mapping of node.mappings) {
      let { source, destination } = mapping
      if (!source || !destination) continue

      let start = original.originalPositionFor({
        line: source.start.line,
        column: source.start.column,
        bias: SourceMapConsumer.GREATEST_LOWER_BOUND,
      })

      let end = original.originalPositionFor({
        line: source.end.line,
        column: source.end.column,
        bias: SourceMapConsumer.LEAST_UPPER_BOUND,
      })

      map.addMapping({
        generated: { line: destination.start.line, column: destination.start.column },
        original: start,
        source: start.source,
      })

      map.addMapping({
        generated: { line: destination.end.line, column: destination.end.column },
        original: end,
        source: end.source,
      })
    }
  })

  return JSON.parse(map.toString()) as RawSourceMap
}
