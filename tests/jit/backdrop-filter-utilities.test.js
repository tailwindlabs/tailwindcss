import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('without backdrop-filter class', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="backdrop-brightness-150 backdrop-contrast-50"></div>',
      },
    ],
    corePlugins: ['backdropFilter', 'backdropBrightness', 'backdropContrast'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .backdrop-brightness-150, .backdrop-contrast-50 {
        --tw-backdrop-blur: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-brightness: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-contrast: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-grayscale: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-invert: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-opacity: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-saturate: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-sepia: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
          var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
      }
      .backdrop-brightness-150 {
        --tw-backdrop-brightness: brightness(1.5);
        backdrop-filter: var(--tw-backdrop-filter);
      }
      .backdrop-contrast-50 {
        --tw-backdrop-contrast: contrast(0.5);
        backdrop-filter: var(--tw-backdrop-filter);
      }
    `)
  })
})

test('with backdrop-filter class', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="backdrop-filter backdrop-brightness-150 backdrop-contrast-50"></div>',
      },
    ],
    corePlugins: ['backdropFilter', 'backdropBrightness', 'backdropContrast'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .backdrop-filter, .backdrop-brightness-150, .backdrop-contrast-50 {
        --tw-backdrop-blur: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-brightness: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-contrast: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-grayscale: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-invert: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-opacity: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-saturate: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-sepia: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
          var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
      }
      .backdrop-filter {
        backdrop-filter: var(--tw-backdrop-filter);
      }
      .backdrop-brightness-150 {
        --tw-backdrop-brightness: brightness(1.5);
        backdrop-filter: var(--tw-backdrop-filter);
      }
      .backdrop-contrast-50 {
        --tw-backdrop-contrast: contrast(0.5);
        backdrop-filter: var(--tw-backdrop-filter);
      }
    `)
  })
})

test('with backdrop-filter-none class', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="backdrop-filter-none backdrop-brightness-150 backdrop-contrast-50"></div>',
      },
    ],
    corePlugins: ['backdropFilter', 'backdropBrightness', 'backdropContrast'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .backdrop-brightness-150, .backdrop-contrast-50 {
        --tw-backdrop-blur: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-brightness: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-contrast: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-grayscale: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-invert: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-opacity: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-saturate: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-sepia: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
          var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
      }
      .backdrop-filter-none {
        backdrop-filter: none;
      }
      .backdrop-brightness-150 {
        --tw-backdrop-brightness: brightness(1.5);
        backdrop-filter: var(--tw-backdrop-filter);
      }
      .backdrop-contrast-50 {
        --tw-backdrop-contrast: contrast(0.5);
        backdrop-filter: var(--tw-backdrop-filter);
      }
    `)
  })
})

test('with variants', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="bad-variant:backdrop-brightness-100 backdrop-brightness-100 hover:backdrop-brightness-150 backdrop-contrast-50 lg:backdrop-contrast-100"></div>',
      },
    ],
    corePlugins: ['backdropFilter', 'backdropBrightness', 'backdropContrast'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .backdrop-brightness-100, .hover\\:backdrop-brightness-150, .backdrop-contrast-50, .lg\\:backdrop-contrast-100 {
        --tw-backdrop-blur: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-brightness: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-contrast: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-grayscale: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-hue-rotate: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-invert: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-opacity: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-saturate: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-sepia: var(--tw-empty, /*!*/ /*!*/);
        --tw-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
          var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
      }
      .backdrop-brightness-100 {
        --tw-backdrop-brightness: brightness(1);
        backdrop-filter: var(--tw-backdrop-filter);
      }
      .backdrop-contrast-50 {
        --tw-backdrop-contrast: contrast(0.5);
        backdrop-filter: var(--tw-backdrop-filter);
      }
      .hover\\:backdrop-brightness-150:hover {
        --tw-backdrop-brightness: brightness(1.5);
        backdrop-filter: var(--tw-backdrop-filter);
      }
      @media (min-width: 1024px) {
        .lg\\:backdrop-contrast-100 {
          --tw-backdrop-contrast: contrast(1);
          backdrop-filter: var(--tw-backdrop-filter);
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
