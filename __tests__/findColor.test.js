import postcss from 'postcss'
import findColor from '../src/util/findColor'

/**
 * Tests
 */
it('finds a color in an object', () => {
  let color = findColor({red: '#FF0000', blue: '#0000FF'}, 'red')
  expect(color).toEqual(`#FF0000`)
})
