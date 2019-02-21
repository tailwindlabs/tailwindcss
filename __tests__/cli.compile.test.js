import path from 'path'

import autoprefixer from 'autoprefixer'

import tailwind from '../src'
import compile from '../src/cli/compile'

describe('cli compile', () => {
  const inputFile = path.resolve(__dirname, 'fixtures/tailwind-input.css')
  const outputFile = 'output.css'
  const plugins = [tailwind(), autoprefixer]

  it('compiles CSS file', () => {
    return compile({ inputFile, outputFile, plugins }).then(result => {
      expect(result.css).toContain('.example')
      expect(result.css).toContain('-ms-input-placeholder')
    })
  })
})
