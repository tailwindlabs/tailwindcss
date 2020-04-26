import withAlphaVariable from '../src/util/withAlphaVariable'

test('it adds the right custom property', () => {
  expect(
    withAlphaVariable({ color: '#ff0000', property: 'color', variable: '--text-opacity' })
  ).toEqual({
    '--text-opacity': '1',
    color: ['#ff0000', 'rgba(255, 0, 0, var(--text-opacity))'],
  })
})

test('it ignores colors that cannot be parsed', () => {
  expect(
    withAlphaVariable({
      color: 'currentColor',
      property: 'background-color',
      variable: '--bg-opacity',
    })
  ).toEqual({
    'background-color': 'currentColor',
  })
})

test('it ignores colors that already have an alpha channel', () => {
  expect(
    withAlphaVariable({
      color: '#ff0000ff',
      property: 'background-color',
      variable: '--bg-opacity',
    })
  ).toEqual({
    'background-color': '#ff0000ff',
  })
  expect(
    withAlphaVariable({
      color: '#ff000080',
      property: 'background-color',
      variable: '--bg-opacity',
    })
  ).toEqual({
    'background-color': '#ff000080',
  })
  expect(
    withAlphaVariable({
      color: '#f00a',
      property: 'background-color',
      variable: '--bg-opacity',
    })
  ).toEqual({
    'background-color': '#f00a',
  })
  expect(
    withAlphaVariable({
      color: '#f00f',
      property: 'background-color',
      variable: '--bg-opacity',
    })
  ).toEqual({
    'background-color': '#f00f',
  })
  expect(
    withAlphaVariable({
      color: 'rgba(255, 255, 255, 1)',
      property: 'background-color',
      variable: '--bg-opacity',
    })
  ).toEqual({
    'background-color': 'rgba(255, 255, 255, 1)',
  })
  expect(
    withAlphaVariable({
      color: 'rgba(255, 255, 255, 0.5)',
      property: 'background-color',
      variable: '--bg-opacity',
    })
  ).toEqual({
    'background-color': 'rgba(255, 255, 255, 0.5)',
  })
  expect(
    withAlphaVariable({
      color: 'hsla(240, 100%, 50%, 1)',
      property: 'background-color',
      variable: '--bg-opacity',
    })
  ).toEqual({
    'background-color': 'hsla(240, 100%, 50%, 1)',
  })
  expect(
    withAlphaVariable({
      color: 'hsla(240, 100%, 50%, 0.5)',
      property: 'background-color',
      variable: '--bg-opacity',
    })
  ).toEqual({
    'background-color': 'hsla(240, 100%, 50%, 0.5)',
  })
})
