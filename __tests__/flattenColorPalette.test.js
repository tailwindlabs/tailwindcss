import flattenColorPalette from '../src/util/flattenColorPalette'

test('it flattens nested color objects', () => {
  expect(
    flattenColorPalette({
      purple: 'purple',
      white: {
        25: 'rgba(255,255,255,.25)',
        50: 'rgba(255,255,255,.5)',
        75: 'rgba(255,255,255,.75)',
        default: '#fff',
      },
      red: {
        1: 'rgb(33,0,0)',
        2: 'rgb(67,0,0)',
        3: 'rgb(100,0,0)',
      },
      green: {
        1: 'rgb(0,33,0)',
        2: 'rgb(0,67,0)',
        3: 'rgb(0,100,0)',
      },
      blue: {
        1: 'rgb(0,0,33)',
        2: 'rgb(0,0,67)',
        3: 'rgb(0,0,100)',
      },
    })
  ).toEqual({
    purple: 'purple',
    'white-25': 'rgba(255,255,255,.25)',
    'white-50': 'rgba(255,255,255,.5)',
    'white-75': 'rgba(255,255,255,.75)',
    white: '#fff',
    'red-1': 'rgb(33,0,0)',
    'red-2': 'rgb(67,0,0)',
    'red-3': 'rgb(100,0,0)',
    'green-1': 'rgb(0,33,0)',
    'green-2': 'rgb(0,67,0)',
    'green-3': 'rgb(0,100,0)',
    'blue-1': 'rgb(0,0,33)',
    'blue-2': 'rgb(0,0,67)',
    'blue-3': 'rgb(0,0,100)',
  })
})
