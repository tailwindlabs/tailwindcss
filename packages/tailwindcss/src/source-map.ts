import { SourceMapConsumer, SourceMapGenerator, type RawSourceMap } from 'source-map-js'
import { walk, type AstNode } from './ast'

export function toSourceMap(original: SourceMapConsumer, ast: AstNode[]): RawSourceMap {
  let map = SourceMapGenerator.fromSourceMap(original)

  walk(ast, (node) => {
    let { source, destination } = node

    if (!source || !destination) return

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

    if (start.line !== null && start.column !== null) {
      map.addMapping({
        source: start.source,
        original: start,
        generated: { line: destination.start.line, column: destination.start.column },
      })
    }

    if (end.line !== null && end.column !== null) {
      map.addMapping({
        source: end.source,
        original: end,
        generated: { line: destination.end.line, column: destination.end.column },
      })
    }
  })

  return JSON.parse(map.toString()) as RawSourceMap
}
