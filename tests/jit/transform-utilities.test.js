import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('without transform class', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="scale-50 translate-x-4"></div>',
      },
    ],
    corePlugins: ['transform', 'scale', 'translate'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .scale-50, .translate-x-4 {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
        --tw-transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))
          rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
          scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
      }
      .translate-x-4 {
        --tw-translate-x: 1rem;
        transform: var(--tw-transform);
      }
      .scale-50 {
        --tw-scale-x: 0.5;
        --tw-scale-y: 0.5;
        transform: var(--tw-transform);
      }
    `)
  })
})

test('with transform class', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="transform scale-50 translate-x-4"></div>',
      },
    ],
    corePlugins: ['transform', 'scale', 'translate'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .transform, .scale-50, .translate-x-4 {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
        --tw-transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))
          rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
          scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
      }
      .transform {
        transform: var(--tw-transform);
      }
      .translate-x-4 {
        --tw-translate-x: 1rem;
        transform: var(--tw-transform);
      }
      .scale-50 {
        --tw-scale-x: 0.5;
        --tw-scale-y: 0.5;
        transform: var(--tw-transform);
      }
    `)
  })
})

test('with transform-none class', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="transform-none scale-50 translate-x-4"></div>',
      },
    ],
    corePlugins: ['transform', 'scale', 'translate'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .scale-50, .translate-x-4 {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
        --tw-transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))
          rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
          scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
      }
      .transform-none {
        transform: none;
      }
      .translate-x-4 {
        --tw-translate-x: 1rem;
        transform: var(--tw-transform);
      }
      .scale-50 {
        --tw-scale-x: 0.5;
        --tw-scale-y: 0.5;
        transform: var(--tw-transform);
      }
    `)
  })
})

test('with variants', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="scale-50 hover:scale-100 translate-x-4 lg:translate-x-6"></div>',
      },
    ],
    corePlugins: ['transform', 'scale', 'translate'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .scale-50, .hover\\:scale-100, .translate-x-4, .lg\\:translate-x-6 {
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
        --tw-transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))
          rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
          scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
      }
      .translate-x-4 {
        --tw-translate-x: 1rem;
        transform: var(--tw-transform);
      }
      .scale-50 {
        --tw-scale-x: 0.5;
        --tw-scale-y: 0.5;
        transform: var(--tw-transform);
      }
      .hover\\:scale-100:hover {
        --tw-scale-x: 1;
        --tw-scale-y: 1;
        transform: var(--tw-transform);
      }
      @media (min-width: 1024px) {
        .lg\\:translate-x-6 {
          --tw-translate-x: 1.5rem;
          transform: var(--tw-transform);
        }
      }
    `)
  })
})

test('without any transform classes', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class=""></div>',
      },
    ],
    corePlugins: ['transform', 'scale', 'translate'],
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
