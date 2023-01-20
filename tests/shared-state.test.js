import { resolveDebug } from '../src/lib/sharedState'
import { crosscheck, run, html, css, defaults } from './util/run'

crosscheck(({ stable, oxide }) => {
  it.each`
    value                     | expected
    ${'true'}                 | ${true}
    ${'1'}                    | ${true}
    ${'false'}                | ${false}
    ${'0'}                    | ${false}
    ${'*'}                    | ${true}
    ${'tailwindcss'}          | ${true}
    ${'tailwindcss:*'}        | ${true}
    ${'other,tailwindcss'}    | ${true}
    ${'other,tailwindcss:*'}  | ${true}
    ${'other,-tailwindcss'}   | ${false}
    ${'other,-tailwindcss:*'} | ${false}
    ${'-tailwindcss'}         | ${false}
    ${'-tailwindcss:*'}       | ${false}
  `('should resolve the debug ($value) flag correctly ($expected)', ({ value, expected }) => {
    expect(resolveDebug(value)).toBe(expected)
  })
})
