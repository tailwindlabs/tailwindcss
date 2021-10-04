import { elementSelectorParser } from '../src/lib/resolveDefaultsAtRules'

it.each`
  before                                                                 | after
  ${'*'}                                                                 | ${'*'}
  ${'* > *'}                                                             | ${'* > *'}
  ${'.foo'}                                                              | ${'.foo'}
  ${'.foo:hover'}                                                        | ${'.foo'}
  ${'.foo:focus:hover'}                                                  | ${'.foo'}
  ${'li:first-child'}                                                    | ${'li'}
  ${'li:before'}                                                         | ${'li:before'}
  ${'li::before'}                                                        | ${'li::before'}
  ${'#app .foo'}                                                         | ${'.foo'}
  ${'#app'}                                                              | ${'[id=app]'}
  ${'#app.other'}                                                        | ${'.other'}
  ${'input[type="text"]'}                                                | ${'[type="text"]'}
  ${'input[type="text"].foo'}                                            | ${'.foo'}
  ${'.group .group\\:foo'}                                               | ${'.group\\:foo'}
  ${'.group:hover .group-hover\\:foo'}                                   | ${'.group-hover\\:foo'}
  ${'.owl > * + *'}                                                      | ${'.owl > * + *'}
  ${'.owl > :not([hidden]) + :not([hidden])'}                            | ${'.owl > :not([hidden]) + :not([hidden])'}
  ${'.group:hover .group-hover\\:owl > :not([hidden]) + :not([hidden])'} | ${'.group-hover\\:owl > :not([hidden]) + :not([hidden])'}
  ${'.peer:first-child ~ .peer-first\\:shadow-md'}                       | ${'.peer-first\\:shadow-md'}
`('should generate "$after" from "$before"', ({ before, after }) => {
  expect(elementSelectorParser.transformSync(before).join(', ')).toEqual(after)
})
