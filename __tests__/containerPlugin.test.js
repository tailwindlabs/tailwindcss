import _ from 'lodash'
import postcss from 'postcss'
import processPlugins from '../src/util/processPlugins'
import container from '../src/plugins/container'

function css(nodes) {
  return postcss.root({ nodes }).toString()
}

function config(overrides) {
  return _.defaultsDeep(overrides, {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    options: {
      prefix: "",
      important: false,
      separator: ":"
    }
  })
}

function processPluginsWithValidConfig(config) {
  return processPlugins(
    _.defaultsDeep(config, {
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
      },
      options: {
        prefix: '',
        important: false,
        separator: ':',
      },
    })
  )
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

test.only('screens can be specified explicitly', () => {
  const { components } = processPlugins([
    container({
      screens: {
        sm: '400px',
        lg: '500px',
      },
    }),
  ], config())

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

test.only('screens can be an array', () => {
  const { components } = processPlugins([
    container({
      screens: ['400px', '500px'],
    }),
  ], config())

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

test.only('the container can be centered by default', () => {
  const { components } = processPlugins([
    container({
      center: true,
    }),
  ], config())

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
  const { components } = processPlugins([
    container({
      padding: '2rem',
    }),
  ], config())

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

test.only('setting all options at once', () => {
  const { components } = processPlugins([
    container({
      screens: {
        sm: '400px',
        lg: '500px',
      },
      center: true,
      padding: '2rem',
    }),
  ], config())

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
