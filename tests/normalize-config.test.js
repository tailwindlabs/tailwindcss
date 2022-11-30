import { normalizeConfig } from '../src/util/normalizeConfig'
import { run, css } from './util/run'
import resolveConfig from '../src/public/resolve-config'
import { env } from '../src/lib/sharedState'
import log from '../src/util/log'

let t = env.OXIDE ? test.skip : test

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

t.each`
  config
  ${{ content: [{ raw: 'text-center' }], purge: { extract: () => ['font-bold'] } }}
  ${{ content: [{ raw: 'text-center' }], purge: { extract: { DEFAULT: () => ['font-bold'] } } }}
  ${{
    content: [{ raw: 'text-center' }],
    purge: { options: { defaultExtractor: () => ['font-bold'] } },
  }}
  ${{
    content: [{ raw: 'text-center' }],
    purge: { options: { extractors: [{ extractor: () => ['font-bold'], extensions: ['html'] }] } },
  }}
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

t('should still be possible to use the "old" v2 config', () => {
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

it('should keep content files with globs', () => {
  let config = {
    content: ['./example-folder/**/*.{html,js}'],
  }

  expect(normalizeConfig(resolveConfig(config)).content).toEqual({
    files: ['./example-folder/**/*.{html,js}'],
    relative: false,
    extract: {},
    transform: {},
  })
})

it('should warn when we detect invalid globs with incorrect brace expansion', () => {
  let spy = jest.spyOn(log, 'warn')

  let config = {
    content: [
      './{example-folder}/**/*.{html,js}',
      './{example-folder}/**/*.{html}',
      './example-folder/**/*.{html}',
    ],
  }

  // No rewrite happens
  expect(normalizeConfig(resolveConfig(config)).content).toEqual({
    files: [
      './{example-folder}/**/*.{html,js}',
      './{example-folder}/**/*.{html}',
      './example-folder/**/*.{html}',
    ],
    relative: false,
    extract: {},
    transform: {},
  })

  // But a warning should happen
  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy.mock.calls.map((x) => x[0])).toEqual(['invalid-glob-braces', 'invalid-glob-braces'])

  spy.mockClear()
})
