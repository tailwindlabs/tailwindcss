import { describe, expect, it } from 'vitest'
import { add, div, mul, mulDiv, normalize, round, sub } from './decimal'

describe('normalize', () => {
  it.each([
    ['0', '0'],
    ['4.35', '4.35'],
    ['-0.1', '-0.1'],
    ['.5', '0.5'],
    ['+.5', '0.5'],
    ['007', '7'],
    ['100', '100'],
    ['0.0000001', '0.0000001'],
    ['1000000000000000', '1000000000000000'],

    // trailing zeros are removed
    ['1.50', '1.5'],
    ['0.000', '0'],

    // zero is never negative
    ['-0', '0'],
    ['+0', '0'],
    ['-0.0', '0'],
  ])('should normalize `%s` into `%s`', (input, expected) => {
    expect(normalize(input)).toBe(expected)
  })

  it.each([
    [''],
    ['1.'],
    ['.'],
    ['-'],
    ['1e-7'],
    ['1rem'],
    ['1.2.3'],
    ['Infinity'],
    ['NaN'],

    //not a safe integer
    ['9007199254740993'],
    ['0.12345678901234567'],
    ['9'.repeat(400)],
  ])('should not normalize `%s`', (input) => {
    expect(normalize(input)).toBe(null)
  })
})

describe('add', () => {
  it.each([
    ['0.1', '0.2', '0.3'],
    ['0.7', '0.1', '0.8'],
    ['100.1', '-100', '0.1'],
    ['.5', '+.5', '1'],
    ['-0', '0', '0'],
    ['0.0000001', '0.0000001', '0.0000002'],
  ])('should add `%s` and `%s` into `%s`', (a, b, expected) => {
    expect(add(a, b)).toBe(expected)
  })

  it('should not add when the result is not a safe integer', () => {
    expect(add('9007199254740991', '1')).toBe(null)
  })
})

describe('sub', () => {
  it.each([
    ['0.3', '0.1', '0.2'],
    ['4.35', '4', '0.35'],
    ['100.1', '100', '0.1'],
    ['1', '1', '0'],
    ['1', '2.5', '-1.5'],
  ])('should subtract `%s` and `%s` into `%s`', (a, b, expected) => {
    expect(sub(a, b)).toBe(expected)
  })

  it('should not subtract when the result is not a safe integer', () => {
    expect(sub('-9007199254740991', '1')).toBe(null)
  })
})

describe('mul', () => {
  it.each([
    ['4.35', '100', '435'],
    ['0.1', '14', '1.4'],
    ['0.1', '0.2', '0.02'],
    ['1.1', '1.1', '1.21'],
    ['-1', '0', '0'],
    ['25.4', '480', '12192'],

    // no exponent notation
    ['0.0001', '0.001', '0.0000001'],
  ])('should multiply `%s` and `%s` into `%s`', (a, b, expected) => {
    expect(mul(a, b)).toBe(expected)
  })

  it('should not multiply when the result is not a safe integer', () => {
    expect(mul('1000000000000', '1000000000')).toBe(null)
  })
})

describe('div', () => {
  it.each([
    ['0.3', '0.1', '3'],
    ['0.7', '0.1', '7'],
    ['0.6', '3', '0.2'],
    ['0.69', '3', '0.23'],
    ['19.2', '3', '6.4'],
    ['29', '100', '0.29'],
    ['5', '2', '2.5'],
    ['-1', '4', '-0.25'],
    ['-6', '-3', '2'],
    ['0', '5', '0'],
    ['-0', '5', '0'],
  ])('should divide `%s` by `%s` into `%s`', (a, b, expected) => {
    expect(div(a, b, 2)).toBe(expected)
  })

  it.each([
    // more than 2 decimals
    ['1', '8'],
    ['10', '3'],
    ['100', '3.5'],

    // dividing by zero
    ['1', '0'],
    ['1', '-0.0'],
  ])('should not divide `%s` by `%s` with at most 2 decimals', (a, b) => {
    expect(div(a, b, 2)).toBe(null)
  })

  it('should respect `maxDecimals`', () => {
    expect(div('1', '8', 2)).toBe(null)
    expect(div('1', '8', 3)).toBe('0.125')
    expect(div('5', '2', 0)).toBe(null)
  })
})

describe('round', () => {
  it.each([
    [4800 / 127, '37.7952755906'],
    [-4800 / 127, '-37.7952755906'],
    [180 / Math.PI, '57.2957795131'],
    [(3.141592653589793 * 180) / Math.PI, '180'],
    [0.1 + 0.2, '0.3'],
  ])('should round `%s` into `%s`', (input, expected) => {
    expect(round(input)).toBe(expected)
  })

  it.each([
    [Infinity],
    [-Infinity],
    [NaN],

    // would need more than 16 digits after rounding to 10 decimals
    [1000000],
  ])('should not round `%s`', (input) => {
    expect(round(input)).toBe(null)
  })
})

describe('mulDiv', () => {
  it.each([
    ['1', '4800', 127, '37.7952755906'],
    ['10', '480', 127, '37.7952755906'],
    ['40', '120', 127, '37.7952755906'],
    ['25.4', '480', 127, '96'],
    ['0.3', '4', 3, '0.4'],
  ])('should compute `%s * %s / %s` as `%s`', (value, numerator, denominator, expected) => {
    expect(mulDiv(value, numerator, denominator)).toBe(expected)
  })

  it.each([
    //not a plain decimal
    ['1e-7', '4800', 127],

    // multiplication is not a safe integer
    ['9007199254740991', '2', 1],

    // result is too large to round to 10 decimals
    ['1000000', '4', 3],
  ])('should not compute `%s * %s / %s`', (value, numerator, denominator) => {
    expect(mulDiv(value, numerator, denominator)).toBe(null)
  })
})
