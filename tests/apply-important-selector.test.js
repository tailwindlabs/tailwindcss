import { applyImportantSelector } from '../src/util/applyImportantSelector'

it.each`
  before                                                        | after
  ${'.foo'}                                                     | ${'#app :is(.foo)'}
  ${'.foo .bar'}                                                | ${'#app :is(.foo .bar)'}
  ${'.foo:hover'}                                               | ${'#app :is(.foo:hover)'}
  ${'.foo .bar:hover'}                                          | ${'#app :is(.foo .bar:hover)'}
  ${'.foo::before'}                                             | ${'#app :is(.foo)::before'}
  ${'.foo::before'}                                             | ${'#app :is(.foo)::before'}
  ${'.foo::file-selector-button'}                               | ${'#app :is(.foo)::file-selector-button'}
  ${'.foo::-webkit-progress-bar'}                               | ${'#app :is(.foo)::-webkit-progress-bar'}
  ${'.foo:hover::before'}                                       | ${'#app :is(.foo:hover)::before'}
  ${':is(:where(.dark) :is(:where([dir="rtl"]) .foo::before))'} | ${'#app :is(:where(.dark) :is(:where([dir="rtl"]) .foo))::before'}
  ${':is(:where(.dark) .foo) .bar'}                             | ${'#app :is(:is(:where(.dark) .foo) .bar)'}
  ${':is(.foo) :is(.bar)'}                                      | ${'#app :is(:is(.foo) :is(.bar))'}
  ${':is(.foo)::before'}                                        | ${'#app :is(.foo)::before'}
  ${'.foo:before'}                                              | ${'#app :is(.foo):before'}
  ${'.foo::some-unknown-pseudo'}                                | ${'#app :is(.foo)::some-unknown-pseudo'}
  ${'.foo::some-unknown-pseudo:hover'}                          | ${'#app :is(.foo)::some-unknown-pseudo:hover'}
  ${'.foo:focus::some-unknown-pseudo:hover'}                    | ${'#app :is(.foo:focus)::some-unknown-pseudo:hover'}
  ${'.foo:hover::some-unknown-pseudo:focus'}                    | ${'#app :is(.foo:hover)::some-unknown-pseudo:focus'}
`('should generate "$after" from "$before"', ({ before, after }) => {
  expect(applyImportantSelector(before, '#app')).toEqual(after)
})
