import _ from 'lodash'
import postcss from 'postcss'
import processPlugins from '../src/util/processPlugins'
import container from '../src/plugins/container'

function css(nodes) {
  return postcss.root({ nodes }).toString()
}

function config(overrides) {
  return _.defaultsDeep(overrides, {
    theme: {
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
      },
    },
    prefix: '',
  })
}

test.only('options are not required', () => {
  const { components } = processPlugins([container()], config())

  expect(css(components)).toMatchCss(`
    .container { width: 100% }
    @media (min-width: 576px) {
      .container { max-width: 576px }
    }
    @media (min-width: 768px) {
      .container { max-width: 768px }
    }
    @media (min-width: 992px) {
      .container { max-width: 992px }
    }
    @media (min-width: 1200px) {
      .container { max-width: 1200px }
    }
  `)
})

test.only('screens can be passed explicitly', () => {
  const { components } = processPlugins(
    [container()],
    config({
      theme: {
        container: {
          screens: ['400px', '500px'],
        },
      },
    })
  )

  expect(css(components)).toMatchCss(`
    .container { width: 100% }
    @media (min-width: 400px) {
      .container { max-width: 400px }
    }
    @media (min-width: 500px) {
      .container { max-width: 500px }
    }
  `)
})

test.only('screens are ordered ascending by min-width', () => {
  const { components } = processPlugins(
    [container()],
    config({
      theme: {
        container: {
          screens: ['500px', '400px'],
        },
      },
    })
  )

  expect(css(components)).toMatchCss(`
    .container { width: 100% }
    @media (min-width: 400px) {
      .container { max-width: 400px }
    }
    @media (min-width: 500px) {
      .container { max-width: 500px }
    }
  `)
})

test.only('screens are deduplicated by min-width', () => {
  const { components } = processPlugins(
    [container()],
    config({
      theme: {
        container: {
          screens: {
            sm: '576px',
            md: '768px',
            'sm-only': { min: '576px', max: '767px' },
          },
        },
      },
    })
  )

  expect(css(components)).toMatchCss(`
    .container { width: 100% }
    @media (min-width: 576px) {
      .container { max-width: 576px }
    }
    @media (min-width: 768px) {
      .container { max-width: 768px }
    }
  `)
})

test.only('the container can be centered by default', () => {
  const { components } = processPlugins(
    [container()],
    config({
      theme: {
        container: {
          center: true,
        },
      },
    })
  )

  expect(css(components)).toMatchCss(`
    .container {
      width: 100%;
      margin-right: auto;
      margin-left: auto
    }
    @media (min-width: 576px) {
      .container { max-width: 576px }
    }
    @media (min-width: 768px) {
      .container { max-width: 768px }
    }
    @media (min-width: 992px) {
      .container { max-width: 992px }
    }
    @media (min-width: 1200px) {
      .container { max-width: 1200px }
    }
  `)
})

test.only('horizontal padding can be included by default', () => {
  const { components } = processPlugins(
    [container()],
    config({
      theme: {
        container: {
          padding: '2rem',
        },
      },
    })
  )

  expect(css(components)).toMatchCss(`
    .container {
      width: 100%;
      padding-right: 2rem;
      padding-left: 2rem
    }
    @media (min-width: 576px) {
      .container { max-width: 576px }
    }
    @media (min-width: 768px) {
      .container { max-width: 768px }
    }
    @media (min-width: 992px) {
      .container { max-width: 992px }
    }
    @media (min-width: 1200px) {
      .container { max-width: 1200px }
    }
  `)
})

test.only('responsive horizontal padding can be included by default', () => {
  const { components } = processPlugins(
    [container()],
    config({
      theme: {
        container: {
          padding: {
            default: '1rem',
            sm: '2rem',
            lg: '4rem',
            xl: '5rem',
          },
        },
      },
    })
  )

  expect(css(components)).toMatchCss(`
    .container {
      width: 100%;
      padding-right: 1rem;
      padding-left: 1rem
    }
    @media (min-width: 576px) {
      .container {
        max-width: 576px;
        padding-right: 2rem;
        padding-left: 2rem
      }
    }
    @media (min-width: 768px) {
      .container { max-width: 768px }
    }
    @media (min-width: 992px) {
      .container {
        max-width: 992px;
        padding-right: 4rem;
        padding-left: 4rem
      }
    }
    @media (min-width: 1200px) {
      .container {
        max-width: 1200px;
        padding-right: 5rem;
        padding-left: 5rem
      }
    }
  `)
})

test.only('setting all options at once', () => {
  const { components } = processPlugins(
    [container()],
    config({
      theme: {
        container: {
          screens: ['400px', '500px'],
          center: true,
          padding: '2rem',
        },
      },
    })
  )

  expect(css(components)).toMatchCss(`
    .container {
      width: 100%;
      margin-right: auto;
      margin-left: auto;
      padding-right: 2rem;
      padding-left: 2rem
    }
    @media (min-width: 400px) {
      .container { max-width: 400px }
    }
    @media (min-width: 500px) {
      .container { max-width: 500px }
    }
  `)
})
