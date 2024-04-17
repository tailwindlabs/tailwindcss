import type { AstNode } from './ast'

export type Location = {
  line: number
  column: number
}

export type Range = {
  start: Location
  end: Location
}

export class TrackLocations {
  sources: Map<AstNode, Range[]> = new Map()
  destinations: Map<AstNode, Range[]> = new Map()

  src(node: AstNode, range: Range) {
    let ranges = this.sources.get(node) ?? []
    this.sources.set(node, ranges)
    ranges.push(range)
  }

  dst(node: AstNode, range: Range) {
    let ranges = this.destinations.get(node) ?? []
    this.destinations.set(node, ranges)
    ranges.push(range)
  }
}
