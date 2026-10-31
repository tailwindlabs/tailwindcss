import { describe, expect, it } from 'vitest'
import { pathsEqual } from './paths-equal'

describe('pathsEqual', () => {
  it('returns true for identical paths', () => {
    expect(pathsEqual('/foo/bar/baz.css', '/foo/bar/baz.css')).toBe(true)
  })

  it('returns false for completely different paths', () => {
    expect(pathsEqual('/foo/bar.css', '/foo/baz.css')).toBe(false)
  })

  it('ignores case on Windows', () => {
    expect(pathsEqual('C:\\src\\Input.css', 'C:\\src\\input.css', 'win32')).toBe(true)
  })

  it('still compares different paths on Windows', () => {
    expect(pathsEqual('C:\\src\\input.css', 'C:\\src\\other.css', 'win32')).toBe(false)
  })

  it('respects case on other platforms', () => {
    expect(pathsEqual('/src/Input.css', '/src/input.css', 'linux')).toBe(false)
    expect(pathsEqual('/src/Input.css', '/src/input.css', 'darwin')).toBe(false)
  })
})
