import { DefaultMap } from '../utils/default-map'
import type { DecodedMapping, DecodedSource, DecodedSourceMap } from './source-map'

interface RangeMapping {
  id: number
  source: DecodedSource
  line: number
  start: number
  end: number | null
}

export function visualize(generated: string, map: DecodedSourceMap) {
  let outputSource: DecodedSource = {
    url: 'output.css',
    content: generated,
    ignore: false,
  }

  // Group mappings by source file
  let bySource = new DefaultMap<DecodedSource, DefaultMap<number, DecodedMapping[]>>(
    () => new DefaultMap<number, DecodedMapping[]>(() => []),
  )

  let mappingIds = new Map<DecodedMapping, number>()

  let nextId = 1
  for (let mapping of map.mappings) {
    let pos = mapping.originalPosition
    if (!pos) continue
    let source = pos.source
    if (!source) continue
    bySource.get(source).get(pos.line).push(mapping)
    mappingIds.set(mapping, nextId++)
  }

  for (let mapping of map.mappings) {
    let pos = mapping.generatedPosition
    if (!pos) continue
    bySource.get(outputSource).get(pos.line).push(mapping)
  }

  let maxIdSize = Math.ceil(Math.log10(Math.max(...mappingIds.values())))
  // `#number  `
  let gutterSize = 3 + maxIdSize

  let output = ''
  output += '\n'
  output += 'SOURCES\n'

  for (let source of bySource.keys()) {
    if (source === outputSource) continue
    output += '- '
    output += source.url ?? 'unknown'
    output += '\n'
  }

  output += '\n'
  output += 'VISUALIZATION\n'

  for (let [source, byLine] of bySource) {
    if (!source.content) continue

    output += ' '.repeat(gutterSize)
    output += `/* `
    if (source === outputSource) {
      output += `output`
    } else {
      output += `input: `
      output += source.url ?? 'unknown'
    }
    output += ` */\n`

    let lines = source.content.split('\n').entries()
    for (let [lineNum, line] of lines) {
      output += ' '.repeat(gutterSize)
      output += line
      output += '\n'

      let pairs: DecodedMapping[][] = []

      // Get all mappings for this line
      let lineMappings = byLine.get(lineNum + 1)

      // Group consecutive mappings into pairs
      for (let i = 0; i < lineMappings.length; i += 2) {
        let pair = [lineMappings[i]]
        if (i + 1 < lineMappings.length) {
          pair.push(lineMappings[i + 1])
        }

        pairs.push(pair)
      }

      for (let [start, end] of pairs) {
        let id = mappingIds.get(start)
        if (!id) continue

        let startPos = source === outputSource ? start.generatedPosition : start.originalPosition
        if (!startPos) continue

        let endPos = source === outputSource ? end?.generatedPosition : end?.originalPosition

        output += '#'
        output += `${Math.floor((id + 1) / 2)}`.padEnd(maxIdSize, ' ')
        output += '  '
        output += ' '.repeat(startPos.column)

        if (endPos) {
          output += '-'.repeat(Math.max(0, endPos.column - startPos.column))
        } else {
          output += '^'
        }

        output += '\n'
      }
    }
  }

  return output
}
