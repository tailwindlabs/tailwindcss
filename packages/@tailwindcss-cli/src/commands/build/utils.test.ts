import { describe, expect, it } from 'vitest'
import { getRebuildStrategy } from './utils'

describe('getRebuildStrategy', () => {
  it('rebuilds fully when a differently cased input file changes on Windows', () => {
    let input = 'C:\\Project\\src\\input.css'
    let changed = 'c:\\project\\src\\Input.css'

    expect(getRebuildStrategy([changed], [input], 'win32')).toEqual({ kind: 'full' })
  })

  it('stays incremental for a differently cased path on case-sensitive platforms', () => {
    expect(getRebuildStrategy(['/src/Input.css'], ['/src/input.css'], 'linux')).toEqual({
      kind: 'incremental',
      changedFiles: [{ file: '/src/Input.css', extension: 'css' }],
    })
  })

  it('stays incremental on Windows for a file that is not a rebuild path', () => {
    expect(getRebuildStrategy(['C:\\src\\index.html'], ['C:\\src\\input.css'], 'win32')).toEqual({
      kind: 'incremental',
      changedFiles: [{ file: 'C:\\src\\index.html', extension: 'html' }],
    })
  })
})
