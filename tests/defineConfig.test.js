import defineConfig from '../src/public/define-config.js'

it('should return config exactly as it was passed in', () => {
  const config = {
    content: [],
    theme: {
      colors: {
        red: '#f00',
        blue: {
          '500': '#00f',
        },
      },
    },
  }

  expect(defineConfig(config)).toEqual(config)
})
