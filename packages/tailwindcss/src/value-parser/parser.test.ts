import { expect, it } from 'vitest'
import { parse } from './parser'

it('should parse a value', () => {
  expect(parse('123px')).toEqual([{ kind: 'word', value: '123px' }])
})

it('should parse a string value', () => {
  expect(parse("'hello world'")).toEqual([{ kind: 'word', value: "'hello world'" }])
})

it('should parse a list', () => {
  expect(parse('hello world')).toEqual([
    { kind: 'word', value: 'hello' },
    { kind: 'separator', value: ' ' },
    { kind: 'word', value: 'world' },
  ])
})

it('should parse a string containing parentheses', () => {
  expect(parse("'hello ( world )'")).toEqual([{ kind: 'word', value: "'hello ( world )'" }])
})

it('should parse a function with no arguments', () => {
  expect(parse('theme()')).toEqual([{ kind: 'function', value: 'theme', nodes: [] }])
})

it('should parse a function with a single argument', () => {
  expect(parse('theme(foo)')).toEqual([
    { kind: 'function', value: 'theme', nodes: [{ kind: 'word', value: 'foo' }] },
  ])
})

it('should parse a function with a single string argument', () => {
  expect(parse("theme('foo')")).toEqual([
    { kind: 'function', value: 'theme', nodes: [{ kind: 'word', value: "'foo'" }] },
  ])
})

it('should parse a function with multiple arguments', () => {
  expect(parse('theme(foo, bar)')).toEqual([
    {
      kind: 'function',
      value: 'theme',
      nodes: [
        { kind: 'word', value: 'foo' },
        { kind: 'separator', value: ', ' },
        { kind: 'word', value: 'bar' },
      ],
    },
  ])
})

it('should parse a function with nested arguments', () => {
  expect(parse('theme(foo, theme(bar))')).toEqual([
    {
      kind: 'function',
      value: 'theme',
      nodes: [
        { kind: 'word', value: 'foo' },
        { kind: 'separator', value: ', ' },
        { kind: 'function', value: 'theme', nodes: [{ kind: 'word', value: 'bar' }] },
      ],
    },
  ])
})

it('should handle calculations', () => {
  expect(parse('calc((1 + 2) * 3)')).toEqual([
    {
      kind: 'function',
      value: 'calc',
      nodes: [
        {
          kind: 'function',
          value: '',
          nodes: [
            { kind: 'word', value: '1' },
            { kind: 'separator', value: ' ' },
            { kind: 'word', value: '+' },
            { kind: 'separator', value: ' ' },
            { kind: 'word', value: '2' },
          ],
        },
        { kind: 'separator', value: ' ' },
        { kind: 'word', value: '*' },
        { kind: 'separator', value: ' ' },
        { kind: 'word', value: '3' },
      ],
    },
  ])
})

it('should handle media query params with functions', () => {
  expect(parse('(min-width: 600px) and (max-width:theme(colors.red.500))')).toEqual([
    {
      kind: 'function',
      value: '',
      nodes: [
        { kind: 'word', value: 'min-width' },
        { kind: 'separator', value: ': ' },
        { kind: 'word', value: '600px' },
      ],
    },
    { kind: 'separator', value: ' ' },
    { kind: 'word', value: 'and' },
    { kind: 'separator', value: ' ' },
    {
      kind: 'function',
      value: '',
      nodes: [
        { kind: 'word', value: 'max-width' },
        { kind: 'separator', value: ':' },
        { kind: 'function', value: 'theme', nodes: [{ kind: 'word', value: 'colors.red.500' }] },
      ],
    },
  ])
})
