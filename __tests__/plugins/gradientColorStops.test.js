import postcss from 'postcss'
import tailwind from '../../src/index'

test('opacity variables are given to colors defined as closures', () => {
  return postcss([
    tailwind({
      theme: {
        colors: {
          primary: ({ opacityVariable }) => `rgba(31,31,31,var(${opacityVariable},1))`,
        },
      },
      variants: {
        gradientColorStops: [],
      },
      corePlugins: ['gradientColorStops'],
    }),
  ])
    .process('@tailwind utilities', { from: undefined })
    .then(result => {
      const expected = `
				.from-primary {
					--gradient-from-color: rgba(31,31,31,var(--gradient-from-opacity,1));
					--gradient-color-stops: var(--gradient-from-color), var(--gradient-to-color, rgba(255, 255, 255, 0))
				}
		
				.via-primary {
					--gradient-via-color: rgba(31,31,31,var(--gradient-via-opacity,1));
					--gradient-color-stops: var(--gradient-from-color), var(--gradient-via-color), var(--gradient-to-color, rgba(255, 255, 255, 0))
				}
		
				.to-primary {
					--gradient-to-color: rgba(31,31,31,var(--gradient-to-opacity,1))
				}
      `

      expect(result.css).toMatchCss(expected)
    })
})
