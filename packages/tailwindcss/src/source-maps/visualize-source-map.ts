import { SourceMapConsumer, type RawSourceMap } from 'source-map-js'

import { DefaultMap } from '../utils/default-map'

const COLUMN_WIDTH = 100
const CONTEXT_LINES = 3

type Range = { start: [number, number]; end: [number, number] }

interface Annotation {
  original: Range
  generated: Range | null
  source: string
}

interface MappedAnnotation extends Annotation {
  generated: Range
}

interface SourceMapPoint {
  original: [number, number]
  generated: [number, number]
  source: string
}

interface SourceVisualization {
  before: string[]
  line: string
  marker: string
  after: string[]
}

export interface SourceMapVisualizationRange {
  original: Range & { source: string }
  generated: Range | null
}

/**
 * Render source map mappings as a side-by-side view of generated and original code.
 *
 * For raw source maps this renders the generated segments implied by mapping points,
 * so duplicate points and unmapped generated lines are visible in snapshots.
 */
export function visualizeSourceMap(map: RawSourceMap, css: string) {
  let smc = new SourceMapConsumer(map)
  let sourceContents = buildSourceContents(map.sources, map.sourcesContent ?? [])
  let points: SourceMapPoint[] = []

  smc.eachMapping((mapping) => {
    if (
      mapping.source === null ||
      mapping.originalLine === null ||
      mapping.originalColumn === null
    ) {
      return
    }

    points.push({
      original: [mapping.originalLine, mapping.originalColumn],
      generated: [mapping.generatedLine, mapping.generatedColumn],
      source: mapping.source,
    })
  })

  return renderVisualization(sourceContents, buildAnnotationsFromSourceMapPoints(points), css)
}

export function visualizeSourceMapRanges(
  sources: Record<string, string>,
  generated: string,
  ranges: SourceMapVisualizationRange[],
) {
  let sourceContents = buildSourceContents(Object.keys(sources), Object.values(sources))
  let annotations: Annotation[] = []

  for (let range of ranges) {
    annotations.push({
      generated: range.generated,
      original: range.original,
      source: range.original.source,
    })
  }

  return renderVisualization(sourceContents, annotations, generated)
}

function buildSourceContents(sources: string[], contents: (string | null)[]) {
  let result = new Map<string, string[]>()

  for (let i = 0; i < sources.length; i++) {
    let content = contents[i]

    if (content === undefined || content === null) continue

    result.set(sources[i], content.split('\n'))
  }

  return result
}

function buildAnnotationsFromSourceMapPoints(points: SourceMapPoint[]) {
  let annotations: Annotation[] = []
  let current: MappedAnnotation | null = null

  function finish(next: SourceMapPoint | null) {
    if (current === null) return

    if (samePosition(current.generated.start, current.generated.end)) {
      if (next === null) {
        current.generated.end = [current.generated.start[0] + 1, 0]
      } else if (next.generated[0] > current.generated.start[0]) {
        current.generated.end = [current.generated.start[0] + 1, 0]

        if (
          next.source === current.source &&
          next.generated[0] === current.generated.start[0] + 1 &&
          next.generated[1] === 0 &&
          next.original[0] === current.original.start[0] + 1 &&
          next.original[1] === 0
        ) {
          current.original.end = next.original
        }
      }
    }

    annotations.push(current)
    current = null
  }

  for (let point of points) {
    if (
      current !== null &&
      current.source === point.source &&
      current.generated.start[0] === point.generated[0] &&
      point.generated[1] > current.generated.end[1] &&
      comparePosition(current.original.start, point.original) <= 0
    ) {
      current.generated.end = point.generated
      current.original.end = point.original
      continue
    }

    finish(point)

    current = {
      original: {
        start: point.original,
        end: point.original,
      },
      generated: {
        start: point.generated,
        end: point.generated,
      },
      source: point.source,
    }
  }

  finish(null)

  return annotations
}

function renderVisualization(
  sourceContents: Map<string, string[]>,
  annotationsList: Annotation[],
  generated: string,
) {
  let generatedLines = generated.split('\n')
  let nextLabelIdx = 0
  let labelsBySource = new DefaultMap<string, string>(() => annotationLabel(nextLabelIdx++))
  let labels = annotationsList.map((annotation) => {
    return labelsBySource.get(sourceKey(annotation.source, annotation.original))
  })
  let generatedLineWidth = String(generatedLines.length).length
  let sourceLineWidth = Math.max(
    1,
    ...Array.from(sourceContents.values(), (lines) => String(lines.length).length),
  )
  let leftWidth = Math.min(
    100,
    Math.max(
      withLineNumber(generatedLineWidth, 'output.css').length,
      ...annotationsList.map((annotation, idx) => {
        let label = labels[idx]

        if (annotation.generated === null) {
          return withoutLineNumber(generatedLineWidth, `unmapped ${label}`).length
        }

        let line = withLineNumber(
          generatedLineWidth,
          generatedLines[annotation.generated.start[0] - 1] ?? '',
          annotation.generated.start[0],
        )
        let marker = withoutLineNumber(
          generatedLineWidth,
          visualizeRange(
            annotation.generated,
            label,
            generatedLines[annotation.generated.start[0] - 1] ?? '',
          ),
        )
        let after = visualizeGeneratedRangeContinuation(
          generatedLines,
          generatedLineWidth,
          annotation.generated,
          label,
        )

        return Math.max(line.length, marker.length, ...after.map((line) => line.length))
      }),
    ),
  )
  let sources = new Set(annotationsList.map((annotation) => annotation.source))
  let sourceHeader = sources.size === 1 ? (annotationsList[0]?.source ?? 'original') : 'original'
  let result: string[] = []

  function add(left: string, right: string) {
    result.push(sideBySide(left, right, leftWidth))
  }

  add(
    withLineNumber(generatedLineWidth, 'output.css'),
    withLineNumber(sourceLineWidth, sourceHeader),
  )
  add(withoutLineNumber(generatedLineWidth, ''), withoutLineNumber(sourceLineWidth, ''))

  let lastLine = 0
  let lastSourceLine = new Map<string, number>()
  let lastSource: string | null = null
  let renderedSources = new Set<string>()

  for (let idx = 0; idx < annotationsList.length; idx++) {
    let annotation = annotationsList[idx]
    let label = labels[idx]

    if (annotation.generated === null) {
      let source = visualizeSource(
        sourceContents,
        lastSourceLine,
        renderedSources,
        sourceLineWidth,
        annotation.source,
        annotation.original,
        label,
      )

      if (sources.size > 1 && source.line !== '' && annotation.source !== lastSource) {
        add(
          withoutLineNumber(generatedLineWidth, ''),
          withoutLineNumber(sourceLineWidth, `--- ${annotation.source} ---`),
        )
        lastSource = annotation.source
      }

      for (let line of source.before) {
        add(withoutLineNumber(generatedLineWidth, ''), line)
      }

      add(withoutLineNumber(generatedLineWidth, `unmapped ${label}`), source.line)
      add(withoutLineNumber(generatedLineWidth, ''), source.marker)

      for (let line of source.after) {
        add(withoutLineNumber(generatedLineWidth, ''), line)
      }

      continue
    }

    let lineNumber = annotation.generated.start[0]

    for (let i = lastLine + 1; i < lineNumber; i++) {
      add(
        withLineNumber(generatedLineWidth, generatedLines[i - 1] ?? '', i),
        withoutLineNumber(sourceLineWidth, ''),
      )
    }

    let endLine = coveredEndLine(annotation.generated)
    let generatedAfter = visualizeGeneratedRangeContinuation(
      generatedLines,
      generatedLineWidth,
      annotation.generated,
      label,
    )
    let source = visualizeSource(
      sourceContents,
      lastSourceLine,
      renderedSources,
      sourceLineWidth,
      annotation.source,
      annotation.original,
      label,
    )

    if (sources.size > 1 && source.line !== '' && annotation.source !== lastSource) {
      add(
        withoutLineNumber(generatedLineWidth, ''),
        withoutLineNumber(sourceLineWidth, `--- ${annotation.source} ---`),
      )
      lastSource = annotation.source
    }

    for (let line of source.before) {
      add(withoutLineNumber(generatedLineWidth, ''), line)
    }

    add(
      withLineNumber(generatedLineWidth, generatedLines[lineNumber - 1] ?? '', lineNumber),
      source.line,
    )
    add(
      withoutLineNumber(
        generatedLineWidth,
        visualizeRange(annotation.generated, label, generatedLines[lineNumber - 1] ?? ''),
      ),
      source.marker,
    )

    for (let i = 0; i < Math.max(generatedAfter.length, source.after.length); i++) {
      add(generatedAfter[i] ?? withoutLineNumber(generatedLineWidth, ''), source.after[i] ?? '')
    }

    lastLine = endLine
  }

  for (let i = lastLine + 1; i <= generatedLines.length; i++) {
    add(
      withLineNumber(generatedLineWidth, generatedLines[i - 1] ?? '', i),
      withoutLineNumber(sourceLineWidth, ''),
    )
  }

  return `\n${result.join('\n')}\n`
}

function sideBySide(left: string, right: string, leftWidth: number) {
  return `${fitColumn(left, leftWidth)} | ${fitColumn(right, COLUMN_WIDTH, false)}`
}

function withLineNumber(width: number, value: string, line?: number) {
  return `${line === undefined ? ' '.repeat(width) : String(line).padStart(width)}  ${value}`
}

function withoutLineNumber(width: number, value: string) {
  if (value === '') return ''

  return `${' '.repeat(width)}  ${value}`
}

function fitColumn(value: string, width: number, pad = true) {
  if (value.length <= width) {
    return pad ? value.padEnd(width) : value
  }

  let markerIdx = value.indexOf(' @ ')

  if (markerIdx !== -1) {
    let labelIdx = value.lastIndexOf(' ', markerIdx - 1) + 1
    let suffix = value.slice(labelIdx)
    let prefixWidth = width - suffix.length - 4

    if (prefixWidth > 0) {
      let result = `${value.slice(0, prefixWidth)}... ${suffix}`

      return pad ? result.padEnd(width) : result
    }
  }

  return `${value.slice(0, width - 3)}...`
}

function annotationLabel(idx: number) {
  let label = ''

  for (let current = idx; current >= 0; current = Math.floor(current / 26) - 1) {
    label = String.fromCharCode(65 + (current % 26)) + label
  }

  return label
}

function visualizeRange(range: Range, label: string, line?: string) {
  let start = range.start[1]
  let width = (() => {
    if (line !== undefined && range.start[0] !== range.end[0]) {
      return Math.max(1, line.length - start)
    }

    return Math.max(1, range.end[1] - start)
  })()
  return `${' '.repeat(start)}${'^'.repeat(width)} ${label} @ ${formatRange(range)}`
}

function visualizeSource(
  sourceContents: Map<string, string[]>,
  lastSourceLine: Map<string, number>,
  renderedSources: Set<string>,
  sourceLineWidth: number,
  source: string,
  range: Range,
  label: string,
): SourceVisualization {
  let lines = sourceContents.get(source)

  if (lines === undefined) return { before: [], line: '', marker: '', after: [] }

  let startLine = range.start[0]
  let line = lines[startLine - 1]

  if (line === undefined) return { before: [], line: '', marker: '', after: [] }

  let before: string[] = []
  let lastLine = lastSourceLine.get(source) ?? 0

  if (lastLine > 0 && startLine > lastLine && startLine - lastLine <= CONTEXT_LINES + 1) {
    for (let i = lastLine + 1; i < startLine; i++) {
      let line = lines[i - 1] ?? ''

      if (line.trim() === '') continue

      before.push(withLineNumber(sourceLineWidth, line, i))
    }
  }

  let key = sourceKey(source, range)

  if (renderedSources.has(key)) {
    lastSourceLine.set(source, Math.max(lastLine, startLine))

    return { before: [], line: '', marker: '', after: [] }
  }

  renderedSources.add(key)

  let endLine = coveredEndLine(range)
  let after = visualizeSourceRangeContinuation(lines, sourceLineWidth, range, label)

  if (startLine > lastLine) {
    for (let i = endLine + 1; i <= Math.min(endLine + CONTEXT_LINES, lines.length); i++) {
      let line = lines[i - 1]

      if (line?.trim() !== '}') break

      after.push(withLineNumber(sourceLineWidth, line, i))
      endLine = i
    }
  }

  lastSourceLine.set(source, Math.max(lastLine, endLine))

  return {
    before,
    line: withLineNumber(sourceLineWidth, line, startLine),
    marker: withoutLineNumber(sourceLineWidth, visualizeRange(range, label, line)),
    after,
  }
}

function visualizeSourceRangeContinuation(
  lines: string[],
  sourceLineWidth: number,
  range: Range,
  label: string,
) {
  let result: string[] = []

  for (let i = range.start[0] + 1; i <= coveredEndLine(range); i++) {
    let line = lines[i - 1] ?? ''

    result.push(withLineNumber(sourceLineWidth, line, i))
    result.push(
      withoutLineNumber(sourceLineWidth, visualizeContinuationRange(range, label, line, i)),
    )
  }

  return result
}

function visualizeGeneratedRangeContinuation(
  lines: string[],
  generatedLineWidth: number,
  range: Range,
  label: string,
) {
  let result: string[] = []

  for (let i = range.start[0] + 1; i <= coveredEndLine(range); i++) {
    let line = lines[i - 1] ?? ''

    result.push(withLineNumber(generatedLineWidth, line, i))
    result.push(
      withoutLineNumber(generatedLineWidth, visualizeContinuationRange(range, label, line, i)),
    )
  }

  return result
}

function coveredEndLine(range: Range) {
  if (range.start[0] !== range.end[0] && range.end[1] === 0) {
    return range.end[0] - 1
  }

  return range.end[0]
}

function visualizeContinuationRange(range: Range, label: string, line: string, lineNumber: number) {
  let start = lineNumber === range.start[0] ? range.start[1] : 0
  let end = lineNumber === range.end[0] ? range.end[1] : line.length
  let width = Math.max(1, end - start)

  return `${' '.repeat(start)}${'^'.repeat(width)} ${label}`
}

function sourceKey(source: string, range: Range) {
  return `${source}:${range.start[0]}:${range.start[1]}:${range.end[0]}:${range.end[1]}`
}

function samePosition(a: [number, number], b: [number, number]) {
  return a[0] === b[0] && a[1] === b[1]
}

function comparePosition(a: [number, number], b: [number, number]) {
  return a[0] - b[0] || a[1] - b[1]
}

function formatRange(range: Range): string {
  if (range.start[0] === range.end[0]) {
    if (range.start[1] === range.end[1]) {
      return `${range.start[0]}:${range.start[1]}`
    }

    return `${range.start[0]}:${range.start[1]}-${range.end[1]}`
  }

  return `${range.start[0]}:${range.start[1]}-${range.end[0]}:${range.end[1]}`
}
