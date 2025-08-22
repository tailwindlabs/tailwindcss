import { finalizeSelector } from '../src/util/formatVariantSelector'

it('should be possible to add a simple variant to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'hover:text-center'

  let formats = [{ format: '&:hover', respectPrefix: true }]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual('.hover\\:text-center:hover')
})

it('should be possible to add a multiple simple variants to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'focus:hover:text-center'

  let formats = [
    { format: '&:hover', respectPrefix: true },
    { format: '&:focus', respectPrefix: true },
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.focus\\:hover\\:text-center:hover:focus'
  )
})

it('should be possible to add a simple variant to a selector containing escaped parts', () => {
  let selector = '.bg-\\[rgba\\(0\\,0\\,0\\)\\]'
  let candidate = 'hover:bg-[rgba(0,0,0)]'

  let formats = [{ format: '&:hover', respectPrefix: true }]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.hover\\:bg-\\[rgba\\(0\\2c 0\\2c 0\\)\\]:hover'
  )
})

it('should be possible to add a simple variant to a selector containing escaped parts (escape is slightly different)', () => {
  let selector = '.bg-\\[rgba\\(0\\2c 0\\2c 0\\)\\]'
  let candidate = 'hover:bg-[rgba(0,0,0)]'

  let formats = [{ format: '&:hover', respectPrefix: true }]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.hover\\:bg-\\[rgba\\(0\\2c 0\\2c 0\\)\\]:hover'
  )
})

it('should be possible to add a simple variant to a more complex selector', () => {
  let selector = '.space-x-4 > :not([hidden]) ~ :not([hidden])'
  let candidate = 'hover:space-x-4'

  let formats = [{ format: '&:hover', respectPrefix: true }]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.hover\\:space-x-4:hover > :not([hidden]) ~ :not([hidden])'
  )
})

it('should be possible to add multiple simple variants to a more complex selector', () => {
  let selector = '.space-x-4 > :not([hidden]) ~ :not([hidden])'
  let candidate = 'disabled:focus:hover:space-x-4'

  let formats = [
    { format: '&:hover', respectPrefix: true },
    { format: '&:focus', respectPrefix: true },
    { format: '&:disabled', respectPrefix: true },
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.disabled\\:focus\\:hover\\:space-x-4:hover:focus:disabled > :not([hidden]) ~ :not([hidden])'
  )
})

it('should be possible to add a single merge variant to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'group-hover:text-center'

  let formats = [{ format: ':merge(.group):hover &', respectPrefix: true }]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.group:hover .group-hover\\:text-center'
  )
})

it('should be possible to add multiple merge variants to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'group-focus:group-hover:text-center'

  let formats = [
    { format: ':merge(.group):hover &', respectPrefix: true },
    { format: ':merge(.group):focus &', respectPrefix: true },
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.group:focus:hover .group-focus\\:group-hover\\:text-center'
  )
})

it('should be possible to add a single merge variant to a more complex selector', () => {
  let selector = '.space-x-4 ~ :not([hidden]) ~ :not([hidden])'
  let candidate = 'group-hover:space-x-4'

  let formats = [{ format: ':merge(.group):hover &', respectPrefix: true }]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.group:hover .group-hover\\:space-x-4 ~ :not([hidden]) ~ :not([hidden])'
  )
})

it('should be possible to add multiple merge variants to a more complex selector', () => {
  let selector = '.space-x-4 ~ :not([hidden]) ~ :not([hidden])'
  let candidate = 'group-focus:group-hover:space-x-4'

  let formats = [
    { format: ':merge(.group):hover &', respectPrefix: true },
    { format: ':merge(.group):focus &', respectPrefix: true },
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.group:focus:hover .group-focus\\:group-hover\\:space-x-4 ~ :not([hidden]) ~ :not([hidden])'
  )
})

it('should be possible to add multiple unique merge variants to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'peer-focus:group-hover:text-center'

  let formats = [
    { format: ':merge(.group):hover &', respectPrefix: true },
    { format: ':merge(.peer):focus ~ &' },
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.peer:focus ~ .group:hover .peer-focus\\:group-hover\\:text-center'
  )
})

it('should be possible to add multiple unique merge variants to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'group-hover:peer-focus:text-center'

  let formats = [
    { format: ':merge(.peer):focus ~ &', respectPrefix: true },
    { format: ':merge(.group):hover &', respectPrefix: true },
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.group:hover .peer:focus ~ .group-hover\\:peer-focus\\:text-center'
  )
})

it('should be possible to use multiple :merge() calls with different "arguments"', () => {
  let selector = '.foo'
  let candidate = 'peer-focus:group-focus:peer-hover:group-hover:foo'

  let formats = [
    { format: ':merge(.group):hover &', respectPrefix: true },
    { format: ':merge(.peer):hover ~ &', respectPrefix: true },
    { format: ':merge(.group):focus &', respectPrefix: true },
    { format: ':merge(.peer):focus ~ &', respectPrefix: true },
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.peer:focus:hover ~ .group:focus:hover .peer-focus\\:group-focus\\:peer-hover\\:group-hover\\:foo'
  )
})

it('group hover and prose headings combination', () => {
  let selector = '.text-center'
  let candidate = 'group-hover:prose-headings:text-center'
  let formats = [
    { format: ':where(&) :is(h1, h2, h3, h4)', respectPrefix: true }, // Prose Headings
    { format: ':merge(.group):hover &', respectPrefix: true }, // Group Hover
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.group:hover :where(.group-hover\\:prose-headings\\:text-center) :is(h1, h2, h3, h4)'
  )
})

it('group hover and prose headings combination flipped', () => {
  let selector = '.text-center'
  let candidate = 'prose-headings:group-hover:text-center'
  let formats = [
    { format: ':merge(.group):hover &', respectPrefix: true }, // Group Hover
    { format: ':where(&) :is(h1, h2, h3, h4)', respectPrefix: true }, // Prose Headings
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    ':where(.group:hover .prose-headings\\:group-hover\\:text-center) :is(h1, h2, h3, h4)'
  )
})

it('should be possible to handle a complex utility', () => {
  let selector = '.space-x-4 > :not([hidden]) ~ :not([hidden])'
  let candidate = 'peer-disabled:peer-first-child:group-hover:group-focus:focus:hover:space-x-4'
  let formats = [
    { format: '&:hover', respectPrefix: true }, // Hover
    { format: '&:focus', respectPrefix: true }, // Focus
    { format: ':merge(.group):focus &', respectPrefix: true }, // Group focus
    { format: ':merge(.group):hover &', respectPrefix: true }, // Group hover
    { format: ':merge(.peer):first-child ~ &', respectPrefix: true }, // Peer first-child
    { format: ':merge(.peer):disabled ~ &', respectPrefix: true }, // Peer disabled
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.peer:disabled:first-child ~ .group:hover:focus .peer-disabled\\:peer-first-child\\:group-hover\\:group-focus\\:focus\\:hover\\:space-x-4:hover:focus > :not([hidden]) ~ :not([hidden])'
  )
})

it('should match base utilities that are prefixed', () => {
  let context = { tailwindConfig: { prefix: 'tw-' } }
  let selector = '.tw-text-center'
  let candidate = 'tw-text-center'
  let formats = []

  expect(finalizeSelector(selector, formats, { candidate, context })).toEqual('.tw-text-center')
})

it('should prefix classes from variants', () => {
  let context = { tailwindConfig: { prefix: 'tw-' } }
  let selector = '.tw-text-center'
  let candidate = 'foo:tw-text-center'
  let formats = [{ format: '.foo &', respectPrefix: true }]

  expect(finalizeSelector(selector, formats, { candidate, context })).toEqual(
    '.tw-foo .foo\\:tw-text-center'
  )
})

it('should not prefix classes from arbitrary variants', () => {
  let context = { tailwindConfig: { prefix: 'tw-' } }
  let selector = '.tw-text-center'
  let candidate = '[.foo_&]:tw-text-center'
  let formats = [{ format: '.foo &', respectPrefix: false }]

  expect(finalizeSelector(selector, formats, { candidate, context })).toEqual(
    '.foo .\\[\\.foo_\\&\\]\\:tw-text-center'
  )
})

it('Merged selectors with mixed combinators uses the first one', () => {
  // This isn't explicitly specced behavior but it is how it works today

  let selector = '.text-center'
  let candidate = 'text-center'
  let formats = [
    { format: ':merge(.group):focus > &', respectPrefix: false },
    { format: ':merge(.group):hover &', respectPrefix: false },
  ]

  expect(finalizeSelector(selector, formats, { candidate })).toEqual(
    '.group:hover:focus > .text-center'
  )
})

describe('real examples', () => {
  it('example a', () => {
    let selector = '.placeholder-red-500::placeholder'
    let candidate = 'hover:placeholder-red-500'

    let formats = [{ format: '&:hover', respectPrefix: true }]

    expect(finalizeSelector(selector, formats, { candidate })).toEqual(
      '.hover\\:placeholder-red-500:hover::placeholder'
    )
  })

  it('example b', () => {
    let selector = '.space-x-4 > :not([hidden]) ~ :not([hidden])'
    let candidate = 'group-hover:hover:space-x-4'

    let formats = [
      { format: '&:hover', respectPrefix: true },
      { format: ':merge(.group):hover &', respectPrefix: true },
    ]

    expect(finalizeSelector(selector, formats, { candidate })).toEqual(
      '.group:hover .group-hover\\:hover\\:space-x-4:hover > :not([hidden]) ~ :not([hidden])'
    )
  })

  it('should work for group-hover and class dark mode combinations', () => {
    let selector = '.text-center'
    let candidate = 'dark:group-hover:text-center'

    let formats = [
      { format: ':merge(.group):hover &', respectPrefix: true },
      { format: '.dark &', respectPrefix: true },
    ]

    expect(finalizeSelector(selector, formats, { candidate })).toEqual(
      '.dark .group:hover .dark\\:group-hover\\:text-center'
    )
  })

  it('should work for group-hover and class dark mode combinations (reversed)', () => {
    let selector = '.text-center'
    let candidate = 'group-hover:dark:text-center'

    let formats = [{ format: '.dark &' }, { format: ':merge(.group):hover &', respectPrefix: true }]

    expect(finalizeSelector(selector, formats, { candidate })).toEqual(
      '.group:hover .dark .group-hover\\:dark\\:text-center'
    )
  })

  describe('prose-headings', () => {
    it('should be possible to use hover:prose-headings:text-center', () => {
      let selector = '.text-center'
      let candidate = 'hover:prose-headings:text-center'

      let formats = [{ format: ':where(&) :is(h1, h2, h3, h4)' }, { format: '&:hover' }]

      expect(finalizeSelector(selector, formats, { candidate })).toEqual(
        ':where(.hover\\:prose-headings\\:text-center) :is(h1, h2, h3, h4):hover'
      )
    })

    it('should be possible to use prose-headings:hover:text-center', () => {
      let selector = '.text-center'
      let candidate = 'prose-headings:hover:text-center'

      let formats = [{ format: '&:hover' }, { format: ':where(&) :is(h1, h2, h3, h4)' }]

      expect(finalizeSelector(selector, formats, { candidate })).toEqual(
        ':where(.prose-headings\\:hover\\:text-center:hover) :is(h1, h2, h3, h4)'
      )
    })
  })
})

describe('pseudo elements', () => {
  it.each`
    before                                                   | after
    ${'&::before'}                                           | ${'&::before'}
    ${'&::before:hover'}                                     | ${'&:hover::before'}
    ${'&:before:hover'}                                      | ${'&:hover:before'}
    ${'&::file-selector-button:hover'}                       | ${'&::file-selector-button:hover'}
    ${'&:hover::file-selector-button'}                       | ${'&:hover::file-selector-button'}
    ${'.parent:hover &'}                                     | ${'.parent:hover &'}
    ${'.parent::before &'}                                   | ${'.parent &::before'}
    ${'.parent::before &:hover'}                             | ${'.parent &:hover::before'}
    ${':where(&::before) :is(h1, h2, h3, h4)'}               | ${':where(&) :is(h1, h2, h3, h4)::before'}
    ${':where(&::file-selector-button) :is(h1, h2, h3, h4)'} | ${':where(&::file-selector-button) :is(h1, h2, h3, h4)'}
    ${'#app :is(:where(.dark) &::before)'}                   | ${'#app :is(:where(.dark) &)::before'}
    ${'#app :is(:is(:where(.dark) &)::before)'}              | ${'#app :is(:is(:where(.dark) &))::before'}
    ${'#app :is(.foo::file-selector-button)'}                | ${'#app :is(.foo)::file-selector-button'}
    ${'#app :is(.foo::-webkit-progress-bar)'}                | ${'#app :is(.foo)::-webkit-progress-bar'}
    ${'.parent::marker li'}                                  | ${'.parent li::marker'}
    ${'.parent::selection li'}                               | ${'.parent li::selection'}
    ${'.parent::placeholder input'}                          | ${'.parent input::placeholder'}
    ${'.parent::backdrop dialog'}                            | ${'.parent dialog::backdrop'}
  `('should translate "$before" into "$after"', ({ before, after }) => {
    let result = finalizeSelector('.a', [{ format: before, respectPrefix: true }], {
      candidate: 'a',
    })

    expect(result).toEqual(after.replace('&', '.a'))
  })
})
