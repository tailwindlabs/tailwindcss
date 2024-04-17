import { SourceMapGenerator, type RawSourceMap } from 'source-map-js'
import { walk, type AstNode } from './ast'

/**
 * Build a source map from the given AST.
 *
 *
 * Our AST is built from a flat CSS string so we only ever have a single source
 *
 * Rather than take an input source map we require the use of other tools that
 * can combine source maps. This simmplifies the implementation and allows us to
 * focus on generating mappings for the AST without having to worry about
 * referencing a previous source map.
 *
 * Additionally, other tools might expect a source map to be "local" to the
 * passed in source rather than be combined as they handle that themselves.
 **/
export function toSourceMap(source: string, ast: AstNode[]): RawSourceMap {
  let map = new SourceMapGenerator()
  map.setSourceContent('input.css', source)

  walk(ast, (node) => {
    let { source, destination } = node

    if (!source || !destination) return

    map.addMapping({
      source: 'input.css',
      original: { line: source.start.line, column: source.start.column },
      generated: { line: destination.start.line, column: destination.start.column },
    })

    map.addMapping({
      source: 'input.css',
      original: { line: source.end.line, column: source.end.column },
      generated: { line: destination.end.line, column: destination.end.column },
    })
  })

  return JSON.parse(map.toString()) as RawSourceMap
}
