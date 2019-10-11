import postcss from 'postcss'
import tailwind from '../src/index'

test('plugins can add new theme values', () => {
  return postcss([
    tailwind({
      corePlugins: [],
      plugins: [
        {
          modifyConfig(config) {
            return {
              ...config,
              theme: {
                ...config.theme,
                rotate: {
                  '0': '0deg',
                  '90': '90deg',
                  '180': '180deg',
                  '270': '270deg',
                },
              },
            }
          },
          handler({ addUtilities, theme }) {
            addUtilities(
              Object.entries(theme('rotate')).map(([key, value]) => {
                return {
                  [`.rotate-${key}`]: {
                    transform: `rotate(${value})`,
                  },
                }
              })
            )
          },
        },
      ],
    }),
  ])
    .process('@tailwind utilities;', { from: undefined })
    .then(result => {
      const expected = `
        .rotate-0 {
          transform: rotate(0deg)
        }
        .rotate-90 {
          transform: rotate(90deg)
        }
        .rotate-180 {
          transform: rotate(180deg)
        }
        .rotate-270 {
          transform: rotate(270deg)
        }
      `

      expect(result.css).toMatchCss(expected)
    })
})
