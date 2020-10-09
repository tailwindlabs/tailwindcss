import postcss from 'postcss'
import tailwind from '../src/index'
import createPlugin from '../src/util/createPlugin'

function run(input, config = {}) {
  return postcss([tailwind({ experimental: { darkModeVariant: true }, ...config })]).process(
    input,
    { from: undefined }
  )
}

test('dark mode variants cannot be generated without enabling the dark mode experiment', () => {
  const input = `
    @variants dark {
      .text-red {
        color: red;
      }
    }
  `

  expect.assertions(1)
  return expect(run(input, { experimental: {} })).rejects.toThrow()
})

test('user-defined dark mode variants do not stack when the dark mode experiment is disabled', () => {
  const input = `
    @variants dark, hover {
      .text-red {
        color: red;
      }
    }
  `

  const expected = `
    .text-red {
      color: red;
    }
    .custom-dark .custom-dark\\:text-red {
      color: red;
    }
    .hover\\:text-red:hover {
      color: red;
    }
  `

  const userPlugin = createPlugin(function({ addVariant }) {
    addVariant('dark', function({ modifySelectors }) {
      modifySelectors(function({ className }) {
        return `.custom-dark .custom-dark\\:${className}`
      })
    })
  })

  expect.assertions(2)

  return postcss([tailwind({ experimental: { darkModeVariant: false }, plugins: [userPlugin] })])
    .process(input, { from: undefined })
    .then(result => {
      expect(result.css).toMatchCss(expected)
      expect(result.warnings().length).toBe(0)
    })
})

test('generating dark mode variants uses the media strategy by default', () => {
  const input = `
    @variants dark {
      .text-red {
        color: red;
      }
    }
  `

  const expected = `
    .text-red {
      color: red;
    }
    @media (prefers-color-scheme: dark) {
      .dark\\:text-red {
        color: red;
      }
    }
  `

  expect.assertions(2)

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('dark mode variants can be generated even when the user has their own plugins array', () => {
  const input = `
    @variants dark {
      .text-red {
        color: red;
      }
    }
  `

  const expected = `
    .text-red {
      color: red;
    }
    @media (prefers-color-scheme: dark) {
      .dark\\:text-red {
        color: red;
      }
    }
  `

  expect.assertions(2)

  return run(input, { plugins: [] }).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('dark mode variants can be generated using the class strategy', () => {
  const input = `
    @variants dark {
      .text-red {
        color: red;
      }
    }
  `

  const expected = `
    .text-red {
      color: red;
    }
    .dark .dark\\:text-red {
      color: red;
    }
  `

  expect.assertions(2)

  return run(input, { dark: 'class' }).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('dark mode variants can be disabled', () => {
  const input = `
    @variants dark {
      .text-red {
        color: red;
      }
    }
  `

  const expected = `
    .text-red {
      color: red;
    }
  `

  expect.assertions(2)

  return run(input, { dark: false }).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('dark mode variants stack with other variants', () => {
  const input = `
    @variants responsive, dark, hover, focus {
      .text-red {
        color: red;
      }
    }
  `

  const expected = `
    .text-red {
      color: red;
    }
    .hover\\:text-red:hover {
      color: red;
    }
    .focus\\:text-red:focus {
      color: red;
    }
    @media (prefers-color-scheme: dark) {
      .dark\\:text-red {
        color: red;
      }
      .dark\\:hover\\:text-red:hover {
        color: red;
      }
      .dark\\:focus\\:text-red:focus {
        color: red;
      }
    }
    @media (min-width: 500px) {
      .sm\\:text-red {
        color: red;
      }
      .sm\\:hover\\:text-red:hover {
        color: red;
      }
      .sm\\:focus\\:text-red:focus {
        color: red;
      }
      @media (prefers-color-scheme: dark) {
        .sm\\:dark\\:text-red {
          color: red;
        }
        .sm\\:dark\\:hover\\:text-red:hover {
          color: red;
        }
        .sm\\:dark\\:focus\\:text-red:focus {
          color: red;
        }
      }
    }
    @media (min-width: 800px) {
      .lg\\:text-red {
        color: red;
      }
      .lg\\:hover\\:text-red:hover {
        color: red;
      }
      .lg\\:focus\\:text-red:focus {
        color: red;
      }
      @media (prefers-color-scheme: dark) {
        .lg\\:dark\\:text-red {
          color: red;
        }
        .lg\\:dark\\:hover\\:text-red:hover {
          color: red;
        }
        .lg\\:dark\\:focus\\:text-red:focus {
          color: red;
        }
      }
    }
  `

  expect.assertions(2)

  return run(input, { theme: { screens: { sm: '500px', lg: '800px' } } }).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('dark mode variants stack with other variants when using the class strategy', () => {
  const input = `
    @variants responsive, dark, group-hover, hover, focus {
      .text-red {
        color: red;
      }
    }
  `

  const expected = `
    .text-red {
      color: red;
    }
    .group:hover .group-hover\\:text-red {
      color: red;
    }
    .hover\\:text-red:hover {
      color: red;
    }
    .focus\\:text-red:focus {
      color: red;
    }
    .dark .dark\\:text-red {
      color: red;
    }
    .dark .group:hover .dark\\:group-hover\\:text-red {
      color: red;
    }
    .dark .dark\\:hover\\:text-red:hover {
      color: red;
    }
    .dark .dark\\:focus\\:text-red:focus {
      color: red;
    }
    @media (min-width: 500px) {
      .sm\\:text-red {
        color: red;
      }
      .group:hover .sm\\:group-hover\\:text-red {
        color: red;
      }
      .sm\\:hover\\:text-red:hover {
        color: red;
      }
      .sm\\:focus\\:text-red:focus {
        color: red;
      }
      .dark .sm\\:dark\\:text-red {
        color: red;
      }
      .dark .group:hover .sm\\:dark\\:group-hover\\:text-red {
        color: red;
      }
      .dark .sm\\:dark\\:hover\\:text-red:hover {
        color: red;
      }
      .dark .sm\\:dark\\:focus\\:text-red:focus {
        color: red;
      }
    }
    @media (min-width: 800px) {
      .lg\\:text-red {
        color: red;
      }
      .group:hover .lg\\:group-hover\\:text-red {
        color: red;
      }
      .lg\\:hover\\:text-red:hover {
        color: red;
      }
      .lg\\:focus\\:text-red:focus {
        color: red;
      }
      .dark .lg\\:dark\\:text-red {
        color: red;
      }
      .dark .group:hover .lg\\:dark\\:group-hover\\:text-red {
        color: red;
      }
      .dark .lg\\:dark\\:hover\\:text-red:hover {
        color: red;
      }
      .dark .lg\\:dark\\:focus\\:text-red:focus {
        color: red;
      }
    }
  `

  expect.assertions(2)

  return run(input, { dark: 'class', theme: { screens: { sm: '500px', lg: '800px' } } }).then(
    result => {
      expect(result.css).toMatchCss(expected)
      expect(result.warnings().length).toBe(0)
    }
  )
})
