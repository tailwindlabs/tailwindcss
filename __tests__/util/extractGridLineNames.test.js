import extractGridLineNames from '../../src/util/extractGridLineNames'

test('passing nothing gives you an empty list', () => {
  expect(extractGridLineNames()).toEqual([])
})

test('no names in the gridTemplate definition gives an empty list', () => {
  const gridTemplateRows = {
    layout: '1fr 1fr 1fr',
  }

  expect(extractGridLineNames(gridTemplateRows)).toEqual([])
})

test('lists the named grid lines', () => {
  const gridTemplateRows = {
    layout: '1fr [left] 1fr [right] 1fr',
  }

  expect(extractGridLineNames(gridTemplateRows)).toEqual(['left', 'right'])
})

test('grid lines with the same name are indexed', () => {
  const gridTemplateRows = {
    layout: '1fr [column] 1fr [column] 1fr',
  }

  expect(extractGridLineNames(gridTemplateRows)).toEqual(['column-1', 'column-2'])
})

test('multiple names on the same grid line are valid', () => {
  const gridTemplateRows = {
    layout: '1fr [left middle] 1fr [right] 1fr',
  }

  expect(extractGridLineNames(gridTemplateRows)).toEqual(['left', 'middle', 'right'])
})

test('spaces between multiple names are not important', () => {
  const gridTemplateRows = {
    layout: '1fr [left     middle] 1fr [right] 1fr',
  }

  expect(extractGridLineNames(gridTemplateRows)).toEqual(['left', 'middle', 'right'])
})

test('multiple gridTemplates can use the same grid line names', () => {
  const gridTemplateRows = {
    layout: '1fr [left] 1fr [right] 1fr',
    other: '[left] 1fr [right] 1fr',
    multi: '1fr [column] 1fr [column] 1fr',
  }

  expect(extractGridLineNames(gridTemplateRows)).toEqual(['left', 'right', 'column-1', 'column-2'])
})
