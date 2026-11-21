import { describe, expect, test } from 'vitest'
import { topologicalSort } from './topological-sort'

describe('topologicalSort', () => {
  test('sorts dependencies before dependents', () => {
    let graph = new Map<string, Set<string>>([
      ['a', new Set(['b'])],
      ['b', new Set(['c'])],
      ['c', new Set()],
    ])

    let cycles: [string[], string][] = []
    let sorted = topologicalSort(graph, {
      onCircularDependency(path, start) {
        cycles.push([[...path], start])
      },
    })

    expect(sorted).toEqual(['c', 'b', 'a'])
    expect(cycles).toEqual([])
  })

  test('does not infinitely recurse when onCircularDependency does not throw', () => {
    let graph = new Map<string, Set<string>>([
      ['a', new Set(['b'])],
      ['b', new Set(['a'])],
    ])

    let cycles: [string[], string][] = []
    let sorted = topologicalSort(graph, {
      onCircularDependency(path, start) {
        cycles.push([[...path], start])
      },
    })

    expect(cycles).toEqual([[['a', 'b'], 'a']])
    expect(sorted).toEqual(['b', 'a'])
  })
})
