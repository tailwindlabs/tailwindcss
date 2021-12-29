import { resolveDebug } from '../src/lib/sharedState'

it.each`
  value                     | expected
  ${'true'}                 | ${true}
  ${'1'}                    | ${true}
  ${'false'}                | ${false}
  ${'0'}                    | ${false}
  ${'*'}                    | ${true}
  ${'tailwind'}             | ${true}
  ${'tailwind:*'}           | ${true}
  ${'tailwindcss'}          | ${true}
  ${'tailwindcss:*'}        | ${true}
  ${'other,tailwind'}       | ${true}
  ${'other,tailwind:*'}     | ${true}
  ${'other,tailwindcss'}    | ${true}
  ${'other,tailwindcss:*'}  | ${true}
  ${'other,-tailwind'}      | ${false}
  ${'other,-tailwind:*'}    | ${false}
  ${'other,-tailwindcss'}   | ${false}
  ${'other,-tailwindcss:*'} | ${false}
  ${'-tailwind'}            | ${false}
  ${'-tailwind:*'}          | ${false}
  ${'-tailwindcss'}         | ${false}
  ${'-tailwindcss:*'}       | ${false}
`('should resolve the debug ($value) flag correctly ($expected)', ({ value, expected }) => {
  expect(resolveDebug(value)).toBe(expected)
})
