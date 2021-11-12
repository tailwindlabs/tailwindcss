import { formatVariantSelector, finalizeSelector } from '../src/util/formatVariantSelector'

it('should be possible to add a simple variant to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'hover:text-center'

  let variants = ['&:hover']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.hover\\:text-center:hover'
  )
})

it('should be possible to add a multiple simple variants to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'focus:hover:text-center'

  let variants = ['&:hover', '&:focus']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.focus\\:hover\\:text-center:hover:focus'
  )
})

it('should be possible to add a simple variant to a selector containing escaped parts', () => {
  let selector = '.bg-\\[rgba\\(0\\,0\\,0\\)\\]'
  let candidate = 'hover:bg-[rgba(0,0,0)]'

  let variants = ['&:hover']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.hover\\:bg-\\[rgba\\(0\\2c 0\\2c 0\\)\\]:hover'
  )
})

it('should be possible to add a simple variant to a selector containing escaped parts (escape is slightly different)', () => {
  let selector = '.bg-\\[rgba\\(0\\2c 0\\2c 0\\)\\]'
  let candidate = 'hover:bg-[rgba(0,0,0)]'

  let variants = ['&:hover']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.hover\\:bg-\\[rgba\\(0\\2c 0\\2c 0\\)\\]:hover'
  )
})

it('should be possible to add a simple variant to a more complex selector', () => {
  let selector = '.space-x-4 > :not([hidden]) ~ :not([hidden])'
  let candidate = 'hover:space-x-4'

  let variants = ['&:hover']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.hover\\:space-x-4:hover > :not([hidden]) ~ :not([hidden])'
  )
})

it('should be possible to add multiple simple variants to a more complex selector', () => {
  let selector = '.space-x-4 > :not([hidden]) ~ :not([hidden])'
  let candidate = 'disabled:focus:hover:space-x-4'

  let variants = ['&:hover', '&:focus', '&:disabled']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.disabled\\:focus\\:hover\\:space-x-4:hover:focus:disabled > :not([hidden]) ~ :not([hidden])'
  )
})

it('should be possible to add a single merge variant to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'group-hover:text-center'

  let variants = [':merge(.group):hover &']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.group:hover .group-hover\\:text-center'
  )
})

it('should be possible to add multiple merge variants to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'group-focus:group-hover:text-center'

  let variants = [':merge(.group):hover &', ':merge(.group):focus &']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.group:focus:hover .group-focus\\:group-hover\\:text-center'
  )
})

it('should be possible to add a single merge variant to a more complex selector', () => {
  let selector = '.space-x-4 ~ :not([hidden]) ~ :not([hidden])'
  let candidate = 'group-hover:space-x-4'

  let variants = [':merge(.group):hover &']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.group:hover .group-hover\\:space-x-4 ~ :not([hidden]) ~ :not([hidden])'
  )
})

it('should be possible to add multiple merge variants to a more complex selector', () => {
  let selector = '.space-x-4 ~ :not([hidden]) ~ :not([hidden])'
  let candidate = 'group-focus:group-hover:space-x-4'

  let variants = [':merge(.group):hover &', ':merge(.group):focus &']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.group:focus:hover .group-focus\\:group-hover\\:space-x-4 ~ :not([hidden]) ~ :not([hidden])'
  )
})

it('should be possible to add multiple unique merge variants to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'peer-focus:group-hover:text-center'

  let variants = [':merge(.group):hover &', ':merge(.peer):focus ~ &']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.peer:focus ~ .group:hover .peer-focus\\:group-hover\\:text-center'
  )
})

it('should be possible to add multiple unique merge variants to a simple selector', () => {
  let selector = '.text-center'
  let candidate = 'group-hover:peer-focus:text-center'

  let variants = [':merge(.peer):focus ~ &', ':merge(.group):hover &']

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.group:hover .peer:focus ~ .group-hover\\:peer-focus\\:text-center'
  )
})

it('should be possible to use multiple :merge() calls with different "arguments"', () => {
  let result = '&'
  result = formatVariantSelector(result, ':merge(.group):hover &')
  expect(result).toEqual(':merge(.group):hover &')

  result = formatVariantSelector(result, ':merge(.peer):hover ~ &')
  expect(result).toEqual(':merge(.peer):hover ~ :merge(.group):hover &')

  result = formatVariantSelector(result, ':merge(.group):focus &')
  expect(result).toEqual(':merge(.peer):hover ~ :merge(.group):focus:hover &')

  result = formatVariantSelector(result, ':merge(.peer):focus ~ &')
  expect(result).toEqual(':merge(.peer):focus:hover ~ :merge(.group):focus:hover &')
})

it('group hover and prose headings combination', () => {
  let selector = '.text-center'
  let candidate = 'group-hover:prose-headings:text-center'
  let variants = [
    ':where(&) :is(h1, h2, h3, h4)', // Prose Headings
    ':merge(.group):hover &', // Group Hover
  ]

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.group:hover :where(.group-hover\\:prose-headings\\:text-center) :is(h1, h2, h3, h4)'
  )
})

it('group hover and prose headings combination flipped', () => {
  let selector = '.text-center'
  let candidate = 'prose-headings:group-hover:text-center'
  let variants = [
    ':merge(.group):hover &', // Group Hover
    ':where(&) :is(h1, h2, h3, h4)', // Prose Headings
  ]

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    ':where(.group:hover .prose-headings\\:group-hover\\:text-center) :is(h1, h2, h3, h4)'
  )
})

it('should be possible to handle a complex utility', () => {
  let selector = '.space-x-4 > :not([hidden]) ~ :not([hidden])'
  let candidate = 'peer-disabled:peer-first-child:group-hover:group-focus:focus:hover:space-x-4'
  let variants = [
    '&:hover', // Hover
    '&:focus', // Focus
    ':merge(.group):focus &', // Group focus
    ':merge(.group):hover &', // Group hover
    ':merge(.peer):first-child ~ &', // Peer first-child
    ':merge(.peer):disabled ~ &', // Peer disabled
  ]

  expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
    '.peer:disabled:first-child ~ .group:hover:focus .peer-disabled\\:peer-first-child\\:group-hover\\:group-focus\\:focus\\:hover\\:space-x-4:hover:focus > :not([hidden]) ~ :not([hidden])'
  )
})

describe('real examples', () => {
  it('example a', () => {
    let selector = '.placeholder-red-500::placeholder'
    let candidate = 'hover:placeholder-red-500'

    let variants = ['&:hover']

    expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
      '.hover\\:placeholder-red-500:hover::placeholder'
    )
  })

  it('example b', () => {
    let selector = '.space-x-4 > :not([hidden]) ~ :not([hidden])'
    let candidate = 'group-hover:hover:space-x-4'

    let variants = ['&:hover', ':merge(.group):hover &']

    expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
      '.group:hover .group-hover\\:hover\\:space-x-4:hover > :not([hidden]) ~ :not([hidden])'
    )
  })

  it('should work for group-hover and class dark mode combinations', () => {
    let selector = '.text-center'
    let candidate = 'dark:group-hover:text-center'

    let variants = [':merge(.group):hover &', '.dark &']

    expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
      '.dark .group:hover .dark\\:group-hover\\:text-center'
    )
  })

  it('should work for group-hover and class dark mode combinations (reversed)', () => {
    let selector = '.text-center'
    let candidate = 'group-hover:dark:text-center'

    let variants = ['.dark &', ':merge(.group):hover &']

    expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
      '.group:hover .dark .group-hover\\:dark\\:text-center'
    )
  })

  describe('prose-headings', () => {
    it('should be possible to use hover:prose-headings:text-center', () => {
      let selector = '.text-center'
      let candidate = 'hover:prose-headings:text-center'

      let variants = [':where(&) :is(h1, h2, h3, h4)', '&:hover']

      expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
        ':where(.hover\\:prose-headings\\:text-center) :is(h1, h2, h3, h4):hover'
      )
    })

    it('should be possible to use prose-headings:hover:text-center', () => {
      let selector = '.text-center'
      let candidate = 'prose-headings:hover:text-center'

      let variants = ['&:hover', ':where(&) :is(h1, h2, h3, h4)']

      expect(finalizeSelector(formatVariantSelector(...variants), { selector, candidate })).toEqual(
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
  `('should translate "$before" into "$after"', ({ before, after }) => {
    let result = finalizeSelector(formatVariantSelector('&', before), {
      selector: '.a',
      candidate: 'a',
    })

    expect(result).toEqual(after.replace('&', '.a'))
  })
})
