import { normalizeScreens } from '../src/util/normalizeScreens'

it('should normalize an array of string values', () => {
  let screens = ['768px', '1200px']

  expect(normalizeScreens(screens)).toEqual([
    { name: '768px', values: [{ min: '768px', max: undefined }] },
    { name: '1200px', values: [{ min: '1200px', max: undefined }] },
  ])
})

it('should normalize an object with string values', () => {
  let screens = {
    a: '768px',
    b: '1200px',
  }

  expect(normalizeScreens(screens)).toEqual([
    { name: 'a', values: [{ min: '768px', max: undefined }] },
    { name: 'b', values: [{ min: '1200px', max: undefined }] },
  ])
})

it('should normalize an object with object values', () => {
  let screens = {
    a: { min: '768px' },
    b: { max: '1200px' },
  }

  expect(normalizeScreens(screens)).toEqual([
    { name: 'a', values: [{ min: '768px', max: undefined }] },
    { name: 'b', values: [{ min: undefined, max: '1200px' }] },
  ])
})

it('should normalize an object with multiple object values', () => {
  let screens = {
    a: [{ min: '768px' }, { max: '1200px' }],
  }

  expect(normalizeScreens(screens)).toEqual([
    {
      name: 'a',
      values: [
        { max: undefined, min: '768px', raw: undefined },
        { max: '1200px', min: undefined, raw: undefined },
      ],
    },
  ])
})

it('should normalize an object with object values (min-width normalized to width)', () => {
  let screens = {
    a: { 'min-width': '768px' },
    b: { max: '1200px' },
  }

  expect(normalizeScreens(screens)).toEqual([
    { name: 'a', values: [{ min: '768px', max: undefined }] },
    { name: 'b', values: [{ min: undefined, max: '1200px' }] },
  ])
})
