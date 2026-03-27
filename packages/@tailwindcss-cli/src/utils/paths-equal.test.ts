import { describe, expect, it, vi } from 'vitest'

vi.mock('./paths-equal', async () => {
  const actual = await vi.importActual<typeof import('./paths-equal')>('./paths-equal')
  return actual
})

// We test the logic directly rather than mocking process.platform,
// because the function captures IS_WINDOWS at module load time.
// Instead we test the underlying behavior: on the current platform,
// paths with matching case should always be equal, and we verify
// the case-insensitive logic separately.

describe('pathsEqual', () => {
  it('returns true for identical paths', async () => {
    const { pathsEqual } = await import('./paths-equal')
    expect(pathsEqual('/foo/bar/baz.css', '/foo/bar/baz.css')).toBe(true)
  })

  it('returns false for completely different paths', async () => {
    const { pathsEqual } = await import('./paths-equal')
    expect(pathsEqual('/foo/bar.css', '/foo/baz.css')).toBe(false)
  })

  if (process.platform === 'win32') {
    it('returns true for paths differing only in case on Windows', async () => {
      const { pathsEqual } = await import('./paths-equal')
      expect(pathsEqual('C:\\src\\Input.css', 'C:\\src\\input.css')).toBe(true)
    })
  } else {
    it('returns false for paths differing in case on non-Windows', async () => {
      const { pathsEqual } = await import('./paths-equal')
      expect(pathsEqual('/src/Input.css', '/src/input.css')).toBe(false)
    })
  }
})
