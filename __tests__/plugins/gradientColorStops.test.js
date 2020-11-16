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
          50: '0.5',
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
    .then((result) => {
      const expected = `
        .text-primary {
          --tw-text-opacity: 1;
          color: rgba(31,31,31,var(--tw-text-opacity,1))
        }
        .text-opacity-50 {
          --tw-text-opacity: 0.5
        }
				.from-primary {
					--tw-gradient-from: rgb(31,31,31);
					--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(31, 31, 31, 0))
				}
				.via-primary {
					--tw-gradient-stops: var(--tw-gradient-from), rgb(31,31,31), var(--tw-gradient-to, rgba(31, 31, 31, 0))
				}
				.to-primary {
					--tw-gradient-to: rgb(31,31,31)
				}
      `

      expect(result.css).toMatchCss(expected)
    })
})
