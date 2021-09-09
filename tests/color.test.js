import { parseColor, formatColor } from '../src/util/color'

describe('parseColor', () => {
  it.each`
    color                       | output
    ${'black'}                  | ${{ mode: 'rgb', color: ['0', '0', '0'], alpha: undefined }}
    ${'#0088cc'}                | ${{ mode: 'rgb', color: ['0', '136', '204'], alpha: undefined }}
    ${'#08c'}                   | ${{ mode: 'rgb', color: ['0', '136', '204'], alpha: undefined }}
    ${'#0088cc99'}              | ${{ mode: 'rgb', color: ['0', '136', '204'], alpha: '0.6' }}
    ${'#08c9'}                  | ${{ mode: 'rgb', color: ['0', '136', '204'], alpha: '0.6' }}
    ${'rgb(0, 30, 60)'}         | ${{ mode: 'rgb', color: ['0', '30', '60'], alpha: undefined }}
    ${'rgba(0, 30, 60, 0.5)'}   | ${{ mode: 'rgb', color: ['0', '30', '60'], alpha: '0.5' }}
    ${'rgb(0 30 60)'}           | ${{ mode: 'rgb', color: ['0', '30', '60'], alpha: undefined }}
    ${'rgb(0 30 60 / 0.5)'}     | ${{ mode: 'rgb', color: ['0', '30', '60'], alpha: '0.5' }}
    ${'hsl(0, 30%, 60%)'}       | ${{ mode: 'hsl', color: ['0', '30%', '60%'], alpha: undefined }}
    ${'hsla(0, 30%, 60%, 0.5)'} | ${{ mode: 'hsl', color: ['0', '30%', '60%'], alpha: '0.5' }}
    ${'hsl(0 30% 60%)'}         | ${{ mode: 'hsl', color: ['0', '30%', '60%'], alpha: undefined }}
    ${'hsl(0 30% 60% / 0.5)'}   | ${{ mode: 'hsl', color: ['0', '30%', '60%'], alpha: '0.5' }}
    ${'transparent'}            | ${{ mode: 'rgb', color: ['0', '0', '0'], alpha: '0' }}
  `('should parse "$color" to the correct value', ({ color, output }) => {
    expect(parseColor(color)).toEqual(output)
  })

  it.each`
    color
    ${'var(--my-color)'}
    ${'currentColor'}
    ${'inherit'}
    ${'initial'}
    ${'revert'}
    ${'unset'}
  `('should return `null` for unparseable color "$color"', ({ color }) => {
    expect(parseColor(color)).toBe(null)
  })
})

describe('formatColor', () => {
  it.each`
    color                                                              | output
    ${{ mode: 'rgb', color: ['0', '0', '0'], alpha: undefined }}       | ${'rgb(0 0 0)'}
    ${{ mode: 'rgb', color: ['0', '136', '204'], alpha: undefined }}   | ${'rgb(0 136 204)'}
    ${{ mode: 'rgb', color: ['0', '136', '204'], alpha: '0.6' }}       | ${'rgb(0 136 204 / 0.6)'}
    ${{ mode: 'hsl', color: ['0', '0%', '0%'], alpha: undefined }}     | ${'hsl(0 0% 0%)'}
    ${{ mode: 'hsl', color: ['0', '136%', '204%'], alpha: undefined }} | ${'hsl(0 136% 204%)'}
    ${{ mode: 'hsl', color: ['0', '136%', '204%'], alpha: '0.6' }}     | ${'hsl(0 136% 204% / 0.6)'}
  `('should format the color pieces into a proper "$output"', ({ color, output }) => {
    expect(formatColor(color)).toEqual(output)
  })
})
