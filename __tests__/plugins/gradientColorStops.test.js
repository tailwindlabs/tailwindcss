import postcss from 'postcss'
import tailwind from '../../src/index'

test('opacity variables are given to colors defined as closures', () => {
  return postcss([
    tailwind({
      theme: {
        colors: {
          primary: ({ opacityVariable, opacityValue }) => {
            if (opacityValue !== undefined) {
              return `rgba(31,31,31,${opacityValue})`
            }

            if (opacityVariable !== undefined) {
              return `rgba(31,31,31,var(${opacityVariable},1))`
            }

            return `rgb(31,31,31)`
          },
        },
        opacity: {
          '50': '0.5',
        },
      },
      variants: {
        textColor: [],
        textOpacity: [],
        gradientColorStops: [],
      },
      corePlugins: ['textColor', 'textOpacity', 'gradientColorStops'],
    }),
  ])
    .process('@tailwind utilities', { from: undefined })
    .then(result => {
      const expected = `
        .text-primary {
          --text-opacity: 1;
          color: rgba(31,31,31,var(--text-opacity,1))
        }
        .text-opacity-50 {
          --text-opacity: 0.5
        }
				.from-primary {
					--gradient-from-color: rgb(31,31,31);
					--gradient-color-stops: var(--gradient-from-color), var(--gradient-to-color, rgba(31, 31, 31, 0))
				}
				.via-primary {
					--gradient-via-color: rgb(31,31,31);
					--gradient-color-stops: var(--gradient-from-color), var(--gradient-via-color), var(--gradient-to-color, rgba(31, 31, 31, 0))
				}
				.to-primary {
					--gradient-to-color: rgb(31,31,31)
				}
      `

      expect(result.css).toMatchCss(expected)
    })
})
