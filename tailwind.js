/**
 * @type {import("./").Config}
 */
module.exports = {
  dark: 'media',
  purge: [],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1234',
        123: '1234',
      },
    },
    fontSize: {},
    screens: {
      md: '1024px',
    },
    extend: {
      colors: {
        black: '#12345',
        blue: {
          DEFAULT: '1234',
        },
        gray: 1,
        current: {
          DEFAULT: '123456',
        },
      },
    },
  },
  variants: {
    accessibility: ['active', 'checked'],
  },
}
