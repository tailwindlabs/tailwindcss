import { toPath } from '../src/util/toPath'

it('should keep an array as an array', () => {
  let input = ['a', 'b', '0', 'c']

  expect(toPath(input)).toBe(input)
})

it.each`
  input             | output
  ${'a.b.c'}        | ${['a', 'b', 'c']}
  ${'a[0].b.c'}     | ${['a', '0', 'b', 'c']}
  ${'.a'}           | ${['a']}
  ${'[].a'}         | ${['a']}
  ${'a[1.5][b][c]'} | ${['a', '1.5', 'b', 'c']}
`('should convert "$input" to "$output"', ({ input, output }) => {
  expect(toPath(input)).toEqual(output)
})
