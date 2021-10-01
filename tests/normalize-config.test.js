import { run, css } from './util/run'

it.each`
  config
  ${{ purge: [{ raw: 'text-center' }] }}
  ${{ purge: { content: [{ raw: 'text-center' }] } }}
  ${{ content: { content: [{ raw: 'text-center' }] } }}
`('should normalize content $config', ({ config }) => {
  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .text-center {
        text-align: center;
      }
    `)
  })
})

it.each`
  config
  ${{ purge: { safelist: ['text-center'] } }}
  ${{ purge: { options: { safelist: ['text-center'] } } }}
  ${{ content: { safelist: ['text-center'] } }}
`('should normalize safelist $config', ({ config }) => {
  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .text-center {
        text-align: center;
      }
    `)
  })
})

it.each`
  config
  ${{ content: [{ raw: 'text-center' }], purge: { extract: () => ['font-bold'] } }}
  ${{ content: [{ raw: 'text-center' }], purge: { extract: { DEFAULT: () => ['font-bold'] } } }}
  ${{ content: [{ raw: 'text-center' }], purge: { options: { defaultExtractor: () => ['font-bold'] } } }}
  ${{ content: [{ raw: 'text-center' }], purge: { options: { extractors: [{ extractor: () => ['font-bold'], extensions: ['html'] }] } } }}
  ${{ content: [{ raw: 'text-center' }], purge: { extract: { html: () => ['font-bold'] } } }}
`('should normalize extractors $config', ({ config }) => {
  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
    `)
  })
})

it('should still be possible to use the "old" v2 config', () => {
  let config = {
    purge: {
      content: [
        { raw: 'text-svelte', extension: 'svelte' },
        { raw: '# My Big Heading', extension: 'md' },
      ],
      options: {
        defaultExtractor(content) {
          return content.split(' ').concat(['font-bold'])
        },
      },
      extract: {
        svelte(content) {
          return content.replace('svelte', 'center').split(' ')
        },
      },
      transform: {
        md() {
          return 'text-4xl'
        },
      },
    },
    theme: {
      extends: {},
    },
    variants: {
      extends: {},
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .text-center {
        text-align: center;
      }

      .text-4xl {
        font-size: 2.25rem;
        line-height: 2.5rem;
      }

      .font-bold {
        font-weight: 700;
      }
    `)
  })
})
