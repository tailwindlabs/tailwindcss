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

    if (!source.length || !destination.length) return
    if (source.length !== destination.length) {
      throw new Error('Source and destination ranges must be the same length')
    }

    for (let i = 0; i < source.length; ++i) {
      let src = source[i]
      let dst = destination[i]

      map.addMapping({
        source: 'input.css',
        original: { line: src.start.line, column: src.start.column },
        generated: { line: dst.start.line, column: dst.start.column },
      })

      map.addMapping({
        source: 'input.css',
        original: { line: src.end.line, column: src.end.column },
        generated: { line: dst.end.line, column: dst.end.column },
      })
    }
  })

  return JSON.parse(map.toString()) as RawSourceMap
}
