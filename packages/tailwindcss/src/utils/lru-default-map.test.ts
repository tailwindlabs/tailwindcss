import { expect, it, vi } from 'vitest'
import { LRUDefaultMap } from './lru-default-map'

it('should generate default values like a DefaultMap', () => {
  let map = new LRUDefaultMap(2, (key: string) => key.toUpperCase())

  expect(map.get('a')).toBe('A')
  expect(map.get('b')).toBe('B')
})

it('should only call the factory once for a key that is cached', () => {
  let factory = vi.fn((key: string) => key.toUpperCase())
  let map = new LRUDefaultMap(2, factory)

  map.get('a')
  map.get('a')
  map.get('a')

  expect(factory).toHaveBeenCalledTimes(1)
})

it('should evict the least recently used key when the limit is exceeded', () => {
  let map = new LRUDefaultMap(2, (key: string) => key)

  map.get('a')
  map.get('b')
  map.get('c')

  expect([...map.keys()]).toEqual(['b', 'c'])
})

it('should keep a key that was used recently', () => {
  let map = new LRUDefaultMap(2, (key: string) => key)

  map.get('a')
  map.get('b')
  map.get('a') // `b` is now the least recently used
  map.get('c')

  expect([...map.keys()]).toEqual(['a', 'c'])
})

it('should call the factory again for a key that was evicted', () => {
  let factory = vi.fn((key: string) => key)
  let map = new LRUDefaultMap(1, factory)

  map.get('a')
  map.get('b') // evicts `a`
  map.get('a')

  expect(factory).toHaveBeenCalledTimes(3)
})

it('should never hold more than the limit', () => {
  let map = new LRUDefaultMap(3, (key: number) => key)

  for (let i = 0; i < 100; i++) map.get(i % 7)

  expect(map.size).toBeLessThanOrEqual(3)
})

it('should evict the least recently used key when keys are added with `set`', () => {
  let map = new LRUDefaultMap(2, (key: string) => key)

  map.set('a', 'a')
  map.set('b', 'b')
  map.set('c', 'c')

  expect([...map.keys()]).toEqual(['b', 'c'])
})
