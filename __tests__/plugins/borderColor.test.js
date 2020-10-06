import postcss from 'postcss'
import tailwind from '../../src/index'

test('border corner color utilities are generated', () => {
  return postcss([
    tailwind({
      theme: {
        colors: {
          red: '#ff0000',
          blue: {
            dark: '#0000ff',
          },
        },
        opacity: {
          '50': '0.5',
        },
      },
      variants: {
        borderColor: [],
        borderOpacity: [],
      },
      corePlugins: ['borderColor', 'borderOpacity'],
    }),
  ])
    .process('@tailwind utilities', { from: undefined })
    .then((result) => {
      const expected = `
      .border-red {
        --border-opacity: 1;
        border-color: #ff0000;
        border-color: rgba(255, 0, 0, var(--border-opacity))
      }

      .border-blue-dark {
        --border-opacity: 1;
        border-color: #0000ff;
        border-color: rgba(0, 0, 255, var(--border-opacity))
      }

      .border {
        border-color: currentColor
      }

      .border-t-red {
        --border-opacity: 1;
        border-top-color: #ff0000;
        border-top-color: rgba(255, 0, 0, var(--border-opacity))
      }

      .border-r-red {
        --border-opacity: 1;
        border-right-color: #ff0000;
        border-right-color: rgba(255, 0, 0, var(--border-opacity))
      }

      .border-b-red {
        --border-opacity: 1;
        border-bottom-color: #ff0000;
        border-bottom-color: rgba(255, 0, 0, var(--border-opacity))
      }

      .border-l-red {
        --border-opacity: 1;
        border-left-color: #ff0000;
        border-left-color: rgba(255, 0, 0, var(--border-opacity))
      }

      .border-t-blue-dark {
        --border-opacity: 1;
        border-top-color: #0000ff;
        border-top-color: rgba(0, 0, 255, var(--border-opacity))
      }

      .border-r-blue-dark {
        --border-opacity: 1;
        border-right-color: #0000ff;
        border-right-color: rgba(0, 0, 255, var(--border-opacity))
      }

      .border-b-blue-dark {
        --border-opacity: 1;
        border-bottom-color: #0000ff;
        border-bottom-color: rgba(0, 0, 255, var(--border-opacity))
      }

      .border-l-blue-dark {
        --border-opacity: 1;
        border-left-color: #0000ff;
        border-left-color: rgba(0, 0, 255, var(--border-opacity))
      }

      .border-t {
        border-top-color: currentColor
      }

      .border-r {
        border-right-color: currentColor
      }

      .border-b {
        border-bottom-color: currentColor
      }

      .border-l {
        border-left-color: currentColor
      }

      .border-opacity-50 {
        --border-opacity: 0.5
      }
      `

      expect(result.css).toMatchCss(expected)
    })
})

test('border corner color utilities without border opacity are generated', () => {
  return postcss([
    tailwind({
      theme: {
        colors: {
          red: '#ff0000',
        },
        opacity: {
          '50': '0.5',
        },
      },
      variants: {
        borderColor: [],
        borderOpacity: [],
      },
      corePlugins: ['borderColor'],
    }),
  ])
    .process('@tailwind utilities', { from: undefined })
    .then((result) => {
      const expected = `
      .border-red {
        border-color: #ff0000
      }

      .border {
        border-color: currentColor
      }

      .border-t-red {
        border-top-color: #ff0000
      }

      .border-r-red {
        border-right-color: #ff0000
      }

      .border-b-red {
        border-bottom-color: #ff0000
      }

      .border-l-red {
        border-left-color: #ff0000
      }

      .border-t {
        border-top-color: currentColor
      }

      .border-r {
        border-right-color: currentColor
      }

      .border-b {
        border-bottom-color: currentColor
      }

      .border-l {
        border-left-color: currentColor
      }
      `

      expect(result.css).toMatchCss(expected)
    })
})

// import invokePlugin from '../util/invokePlugin'
// import plugin from '../../src/plugins/borderColor'

// test('generating border color corner utilities', () => {
//   const config = {
//     target: 'relaxed',
//     theme: {
//       borderColor: {
//         primary: {
//           500: '#ff0000',
//         },
//         yellow: '#f7cc50',
//       },
//     },
//     variants: {
//       borderColor: ['responsive'],
//     },
//     corePlugins: ['borderColor', 'borderOpacity'],
//   }

//   const { utilities, ...other } = invokePlugin(plugin(), config)

//   expect(utilities).toEqual([[{}, ['responsive']]])
// })
