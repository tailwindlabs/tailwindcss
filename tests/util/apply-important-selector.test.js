import { applyImportantSelector } from '../../src/util/applyImportantSelector'

it.each`
  before                                                        | after
  ${'.foo'}                                                     | ${'#app .foo'}
  ${'.foo .bar'}                                                | ${'#app :is(.foo .bar)'}
  ${'.foo:hover'}                                               | ${'#app .foo:hover'}
  ${'.foo .bar:hover'}                                          | ${'#app :is(.foo .bar:hover)'}
  ${'.foo::before'}                                             | ${'#app .foo::before'}
  ${'.foo::file-selector-button'}                               | ${'#app .foo::file-selector-button'}
  ${'.foo::-webkit-progress-bar'}                               | ${'#app .foo::-webkit-progress-bar'}
  ${'.foo:hover::before'}                                       | ${'#app .foo:hover::before'}
  ${':is(:where(.dark) :is(:where([dir="rtl"]) .foo::before))'} | ${'#app :is(:where(.dark) :is(:where([dir="rtl"]) .foo))::before'}
  ${':is(:where(.dark) .foo) .bar'}                             | ${'#app :is(:is(:where(.dark) .foo) .bar)'}
  ${':is(.foo) :is(.bar)'}                                      | ${'#app :is(:is(.foo) :is(.bar))'}
  ${':is(.foo)::before'}                                        | ${'#app :is(.foo)::before'}
  ${'.foo:before'}                                              | ${'#app .foo:before'}
  ${'.foo::some-uknown-pseudo'}                                 | ${'#app .foo::some-uknown-pseudo'}
  ${'.foo::some-uknown-pseudo:hover'}                           | ${'#app .foo::some-uknown-pseudo:hover'}
  ${'.foo:focus::some-uknown-pseudo:hover'}                     | ${'#app .foo:focus::some-uknown-pseudo:hover'}
  ${'.foo:hover::some-uknown-pseudo:focus'}                     | ${'#app .foo:hover::some-uknown-pseudo:focus'}
`('should generate "$after" from "$before"', ({ before, after }) => {
  expect(applyImportantSelector(before, '#app')).toEqual(after)
})
