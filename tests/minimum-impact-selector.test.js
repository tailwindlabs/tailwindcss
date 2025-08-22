import { elementSelectorParser } from '../src/lib/resolveDefaultsAtRules'

it.each`
  before                                                                 | after
  ${'*'}                                                                 | ${'*'}
  ${'*:hover'}                                                           | ${'*'}
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
  ${'.owl > * + *'}                                                      | ${'.owl > *'}
  ${'.owl > :not([hidden]) + :not([hidden])'}                            | ${'.owl > *'}
  ${'.group:hover .group-hover\\:owl > :not([hidden]) + :not([hidden])'} | ${'.group-hover\\:owl > *'}
  ${'.peer:first-child ~ .peer-first\\:shadow-md'}                       | ${'.peer-first\\:shadow-md'}
  ${'.whats ~ .next > span:hover'}                                       | ${'span'}
  ${'.foo .bar ~ .baz > .next > span > article:hover'}                   | ${'article'}
`('should generate "$after" from "$before"', ({ before, after }) => {
  expect(elementSelectorParser.transformSync(before).join(', ')).toEqual(after)
})
