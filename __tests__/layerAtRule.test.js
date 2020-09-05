import postcss from 'postcss'
import tailwind from '../src/index'

function run(input, config = {}) {
  return postcss([tailwind({ corePlugins: [], ...config })]).process(input, { from: undefined })
}

test('layers are grouped and inserted at the matching @tailwind rule', () => {
  const input = `
    @layer vanilla {
      strong { font-weight: medium }
    }

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .btn { background: blue }
    }

    @layer utilities {
      .align-banana { text-align: banana }
    }

    @layer base {
      h1 { font-weight: bold }
    }

    @layer components {
      .card { border-radius: 12px }
    }

    @layer base {
      p { font-weight: normal }
    }

    @layer utilities {
      .align-sandwich { text-align: sandwich }
    }

    @layer chocolate {
      a { text-decoration: underline }
    }
  `

  const expected = `
    @layer vanilla {
      strong { font-weight: medium }
    }

    body { margin: 0 }
    h1 { font-weight: bold }
    p { font-weight: normal }

    .input { background: white }
    .btn { background: blue }
    .card { border-radius: 12px }

    .float-squirrel { float: squirrel }
    .align-banana { text-align: banana }
    .align-sandwich { text-align: sandwich }

    @layer chocolate {
      a { text-decoration: underline }
    }
  `

  expect.assertions(2)

  return run(input, {
    plugins: [
      function({ addBase, addComponents, addUtilities }) {
        addBase({
          body: {
            margin: 0,
          },
        })

        addComponents({
          '.input': { background: 'white' },
        })

        addUtilities({
          '.float-squirrel': { float: 'squirrel' },
        })
      },
    ],
  }).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})
