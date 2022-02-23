import { SourceMapConsumer } from 'source-map-js'

/**
 * Parse the source maps from a PostCSS result
 *
 * @param {import('postcss').Result} result
 */
export function parseSourceMaps(result) {
  const map = result.map.toJSON()

  return {
    sources: map.sources,
    annotations: annotatedMappings(map),
  }
}

/**
 * An string annotation that represents a source map
 *
 * It's not meant to be exhaustive just enough to
 * verify that the source map is working and that
 * lines are mapped back to the original source
 *
 * Including when using @apply with multiple classes
 *
 * @param {import('source-map-js').RawSourceMap} map
 */
function annotatedMappings(map) {
  const smc = new SourceMapConsumer(map)
  const annotations = {}

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
    })

    annotation.generated.end[0] = mapping.generatedLine
    annotation.generated.end[1] = mapping.generatedColumn

    annotation.original.end[0] = mapping.originalLine
    annotation.original.end[1] = mapping.originalColumn
  })

  return Object.values(annotations).map((annotation) => {
    return `${formatRange(annotation.original)} -> ${formatRange(annotation.generated)}`
  })
}

/**
 * @param {object} range
 * @param {[number, number]} range.start
 * @param {[number, number]} range.end
 */
function formatRange(range) {
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
