import flattenColorPalette from '../src/util/flattenColorPalette'

test('it flattens nested color objects', () => {
  expect(
    flattenColorPalette({
      purple: 'purple',
      white: {
        25: 'rgba(255,255,255,.25)',
        50: 'rgba(255,255,255,.5)',
        75: 'rgba(255,255,255,.75)',
        DEFAULT: '#fff',
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

test('it recursively flattens nested color objects', () => {
  expect(
    flattenColorPalette({
      brand: {
        primary: {
          default: 'rgb(100,0,0)',
          50: 'rgba(100,0,0,.5)',
        },
      },
      theme: {
        default: {
          background: {
            default: 'rgb(0,0,0)',
            50: 'rgba(0,0,0,.5)',
          },
        },
        'not-default': {
          background: {
            default: 'rgb(255,255,255)',
            50: 'rgba(255,255,255,.5)',
            'keep-going': {
              default: 'rgb(128,128,128)',
              50: 'rgba(128,128,128,.5)',
            },
          },
        },
      },
    })
  ).toEqual({
    'brand-primary': 'rgb(100,0,0)',
    'brand-primary-50': 'rgba(100,0,0,.5)',
    'theme-default-background': 'rgb(0,0,0)',
    'theme-default-background-50': 'rgba(0,0,0,.5)',
    'theme-not-default-background': 'rgb(255,255,255)',
    'theme-not-default-background-50': 'rgba(255,255,255,.5)',
    'theme-not-default-background-keep-going': 'rgb(128,128,128)',
    'theme-not-default-background-keep-going-50': 'rgba(128,128,128,.5)',
  })
})
