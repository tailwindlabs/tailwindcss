import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('without filter class', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="brightness-150 contrast-50"></div>',
      },
    ],
    corePlugins: ['filter', 'brightness', 'contrast'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .brightness-150, .contrast-50 {
        --tw-blur: var(--tw-empty, /*!*/ /*!*/);
        --tw-brightness: var(--tw-empty, /*!*/ /*!*/);
        --tw-contrast: var(--tw-empty, /*!*/ /*!*/);
        --tw-grayscale: var(--tw-empty, /*!*/ /*!*/);
        --tw-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
        --tw-invert: var(--tw-empty, /*!*/ /*!*/);
        --tw-saturate: var(--tw-empty, /*!*/ /*!*/);
        --tw-sepia: var(--tw-empty, /*!*/ /*!*/);
        --tw-drop-shadow: var(--tw-empty, /*!*/ /*!*/);
        --tw-filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
      }
      .brightness-150 {
        --tw-brightness: brightness(1.5);
        filter: var(--tw-filter);
      }
      .contrast-50 {
        --tw-contrast: contrast(0.5);
        filter: var(--tw-filter);
      }
    `)
  })
})

test('with filter class', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="filter brightness-150 contrast-50"></div>',
      },
    ],
    corePlugins: ['filter', 'brightness', 'contrast'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .filter, .brightness-150, .contrast-50 {
        --tw-blur: var(--tw-empty, /*!*/ /*!*/);
        --tw-brightness: var(--tw-empty, /*!*/ /*!*/);
        --tw-contrast: var(--tw-empty, /*!*/ /*!*/);
        --tw-grayscale: var(--tw-empty, /*!*/ /*!*/);
        --tw-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
        --tw-invert: var(--tw-empty, /*!*/ /*!*/);
        --tw-saturate: var(--tw-empty, /*!*/ /*!*/);
        --tw-sepia: var(--tw-empty, /*!*/ /*!*/);
        --tw-drop-shadow: var(--tw-empty, /*!*/ /*!*/);
        --tw-filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
      }
      .filter {
        filter: var(--tw-filter)
      }
      .brightness-150 {
        --tw-brightness: brightness(1.5);
        filter: var(--tw-filter);
      }
      .contrast-50 {
        --tw-contrast: contrast(0.5);
        filter: var(--tw-filter);
      }
    `)
  })
})

test('with filter-none class', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="filter-none brightness-150 contrast-50"></div>',
      },
    ],
    corePlugins: ['filter', 'brightness', 'contrast'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .brightness-150, .contrast-50 {
        --tw-blur: var(--tw-empty, /*!*/ /*!*/);
        --tw-brightness: var(--tw-empty, /*!*/ /*!*/);
        --tw-contrast: var(--tw-empty, /*!*/ /*!*/);
        --tw-grayscale: var(--tw-empty, /*!*/ /*!*/);
        --tw-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
        --tw-invert: var(--tw-empty, /*!*/ /*!*/);
        --tw-saturate: var(--tw-empty, /*!*/ /*!*/);
        --tw-sepia: var(--tw-empty, /*!*/ /*!*/);
        --tw-drop-shadow: var(--tw-empty, /*!*/ /*!*/);
        --tw-filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
      }
      .filter-none {
        filter: none
      }
      .brightness-150 {
        --tw-brightness: brightness(1.5);
        filter: var(--tw-filter);
      }
      .contrast-50 {
        --tw-contrast: contrast(0.5);
        filter: var(--tw-filter);
      }
    `)
  })
})

test('with variants', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="brightness-100 hover:brightness-150 contrast-50 lg:contrast-100"></div>',
      },
    ],
    corePlugins: ['filter', 'brightness', 'contrast'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .brightness-100,
      .hover\\:brightness-150,
      .contrast-50,
      .lg\\:contrast-100 {
        --tw-blur: var(--tw-empty, /*!*/ /*!*/);
        --tw-brightness: var(--tw-empty, /*!*/ /*!*/);
        --tw-contrast: var(--tw-empty, /*!*/ /*!*/);
        --tw-grayscale: var(--tw-empty, /*!*/ /*!*/);
        --tw-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
        --tw-invert: var(--tw-empty, /*!*/ /*!*/);
        --tw-saturate: var(--tw-empty, /*!*/ /*!*/);
        --tw-sepia: var(--tw-empty, /*!*/ /*!*/);
        --tw-drop-shadow: var(--tw-empty, /*!*/ /*!*/);
        --tw-filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
      }
      .brightness-100 {
        --tw-brightness: brightness(1);
        filter: var(--tw-filter);
      }
      .contrast-50 {
        --tw-contrast: contrast(0.5);
        filter: var(--tw-filter);
      }
      .hover\\:brightness-150:hover {
        --tw-brightness: brightness(1.5);
        filter: var(--tw-filter);
      }
      @media (min-width: 1024px) {
        .lg\\:contrast-100 {
          --tw-contrast: contrast(1);
          filter: var(--tw-filter);
        }
      }
    `)
  })
})

test('without any filter classes', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class=""></div>',
      },
    ],
    corePlugins: ['filter', 'brightness', 'contrast'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(``)
  })
})
