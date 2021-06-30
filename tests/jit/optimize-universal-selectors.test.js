import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('basic utilities', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="scale-x-110 rotate-3 skew-y-6"></div>',
      },
    ],
    theme: {},
    plugins: [],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let css = `
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .rotate-3,
      .skew-y-6,
      .scale-x-110 {
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
      /* --- */
      .rotate-3 {
        --tw-rotate: 3deg;
        transform: var(--tw-transform);
      }
      .skew-y-6 {
        --tw-skew-y: 6deg;
        transform: var(--tw-transform);
      }
      .scale-x-110 {
        --tw-scale-x: 1.1;
        transform: var(--tw-transform);
      }
    `)
  })
})

test('with pseudo-class variants', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="hover:scale-x-110 focus:rotate-3 hover:focus:skew-y-6"></div>',
      },
    ],
    theme: {},
    plugins: [],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let css = `
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .focus\\:rotate-3,
      .hover\\:focus\\:skew-y-6,
      .hover\\:scale-x-110 {
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
      /* --- */
      .hover\\:scale-x-110:hover {
        --tw-scale-x: 1.1;
        transform: var(--tw-transform);
      }
      .focus\\:rotate-3:focus {
        --tw-rotate: 3deg;
        transform: var(--tw-transform);
      }
      .hover\\:focus\\:skew-y-6:hover:focus {
        --tw-skew-y: 6deg;
        transform: var(--tw-transform);
      }
    `)
  })
})

test('with pseudo-element variants', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="before:scale-x-110 after:rotate-3"></div>',
      },
    ],
    theme: {},
    plugins: [],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let css = `
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .after\\:rotate-3::after,
      .before\\:scale-x-110::before {
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
      /* --- */
      .before\\:scale-x-110::before {
        content: '';
        --tw-scale-x: 1.1;
        transform: var(--tw-transform);
      }
      .after\\:rotate-3::after {
        content: '';
        --tw-rotate: 3deg;
        transform: var(--tw-transform);
      }
    `)
  })
})

test('with multi-class variants', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="group-hover:scale-x-110 peer-focus:rotate-3"></div>',
      },
    ],
    theme: {},
    plugins: [],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let css = `
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .peer-focus\\:rotate-3,
      .group-hover\\:scale-x-110 {
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
      /* --- */
      .group:hover .group-hover\\:scale-x-110 {
        --tw-scale-x: 1.1;
        transform: var(--tw-transform);
      }
      .peer:focus ~ .peer-focus\\:rotate-3 {
        --tw-rotate: 3deg;
        transform: var(--tw-transform);
      }
    `)
  })
})

test('with multi-class pseudo-element variants', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="group-hover:before:scale-x-110 peer-focus:after:rotate-3"></div>',
      },
    ],
    theme: {},
    plugins: [],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let css = `
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .peer-focus\\:after\\:rotate-3::after,
      .group-hover\\:before\\:scale-x-110::before {
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
      /* --- */
      .group:hover .group-hover\\:before\\:scale-x-110::before {
        content: '';
        --tw-scale-x: 1.1;
        transform: var(--tw-transform);
      }
      .peer:focus ~ .peer-focus\\:after\\:rotate-3::after {
        content: '';
        --tw-rotate: 3deg;
        transform: var(--tw-transform);
      }
    `)
  })
})

test('with multi-class pseudo-element and pseudo-class variants', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="group-hover:hover:before:scale-x-110 peer-focus:focus:after:rotate-3"></div>',
      },
    ],
    theme: {},
    plugins: [],
    corePlugins: ['transform', 'scale', 'rotate', 'skew'],
  }

  let css = `
    @tailwind base;
    /* --- */
    @tailwind utilities;
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .peer-focus\\:focus\\:after\\:rotate-3::after,
      .group-hover\\:hover\\:before\\:scale-x-110::before {
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
      /* --- */
      .group:hover .group-hover\\:hover\\:before\\:scale-x-110:hover::before {
        content: '';
        --tw-scale-x: 1.1;
        transform: var(--tw-transform);
      }
      .peer:focus ~ .peer-focus\\:focus\\:after\\:rotate-3:focus::after {
        content: '';
        --tw-rotate: 3deg;
        transform: var(--tw-transform);
      }
    `)
  })
})
