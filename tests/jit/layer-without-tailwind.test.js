import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('using @layer without @tailwind', async () => {
  let config = {
    purge: [path.resolve(__dirname, './layer-without-tailwind.test.html')],
    theme: {},
    plugins: [],
  }

  let css = `
    @layer components {
      .foo {
        color: black;
      }
    }
  `

  await expect(run(css, config)).rejects.toThrowError(
    '`@layer components` is used but no matching `@tailwind components` directive is present.'
  )
})

test('using @responsive without @tailwind', async () => {
  let config = {
    purge: [path.resolve(__dirname, './layer-without-tailwind.test.html')],
    theme: {},
    plugins: [],
  }

  let css = `
    @responsive {
      .foo {
        color: black;
      }
    }
  `

  await expect(run(css, config)).rejects.toThrowError(
    '`@responsive` is used but `@tailwind utilities` is missing.'
  )
})

test('using @variants without @tailwind', async () => {
  let config = {
    purge: [path.resolve(__dirname, './layer-without-tailwind.test.html')],
    theme: {},
    plugins: [],
  }

  let css = `
    @variants hover {
      .foo {
        color: black;
      }
    }
  `

  await expect(run(css, config)).rejects.toThrowError(
    '`@variants` is used but `@tailwind utilities` is missing.'
  )
})

test('non-Tailwind @layer rules are okay', async () => {
  let config = {
    purge: [path.resolve(__dirname, './layer-without-tailwind.test.html')],
    theme: {},
    plugins: [],
  }

  let css = `
    @layer custom {
      .foo {
        color: black;
      }
    }
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      @layer custom {
        .foo {
          color: black;
        }
      }
    `)
  })
})
