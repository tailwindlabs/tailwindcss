const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette')
const { toRgba } = require('tailwindcss/lib/util/withAlphaVariable')

module.exports = {
  purge: ['./src/**/*.{js,mdx}'],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      black: '#000',
      white: '#fff',

      amber: colors.amber,
      blue: colors.blue,
      cyan: colors.cyan,
      emerald: colors.emerald,
      fuchsia: colors.fuchsia,
      gray: colors.coolGray,
      green: colors.green,
      indigo: colors.indigo,
      'light-blue': colors.lightBlue,
      lime: colors.lime,
      orange: {
        ...colors.orange,
        1000: '#4a2008',
      },
      pink: {
        ...colors.pink,
        1000: '#460d25',
      },
      purple: colors.purple,
      red: colors.red,
      rose: colors.rose,
      teal: colors.teal,
      violet: colors.violet,
      yellow: colors.yellow,

      code: {
        punctuation: '#A1E8FF',
        tag: '#D58FFF',
        'attr-name': '#4BD0FB',
        'attr-value': '#A2F679',
        string: '#A2F679',
        highlight: 'rgba(134, 239, 172, 0.25)',
      },
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.500'),
            '> :first-child': { marginTop: '-' },
            '> :last-child': { marginBottom: '-' },
            'h2, h3': {
              'scroll-margin-block': `${(70 + 40) / 16}rem`,
            },
            'ul > li': {
              paddingLeft: '1.5em',
            },
            'ul > li::before': {
              width: '0.75em',
              height: '0.125em',
              top: 'calc(0.875em - 0.0625em)',
              left: 0,
              borderRadius: 0,
              backgroundColor: theme('colors.gray.300'),
            },
            a: {
              color: theme('colors.cyan.700'),
              fontWeight: theme('fontWeight.medium'),
              textDecoration: 'none',
              boxShadow: theme('boxShadow.link'),
            },
            'a code': {
              color: 'inherit',
              fontWeight: 'inherit',
            },
            strong: {
              fontWeight: theme('fontWeight.medium'),
            },
            code: {
              fontWeight: 'inherit',
              color: theme('colors.violet.600'),
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            pre: {
              backgroundColor: '-',
              borderRadius: 0,
              marginTop: 0,
              marginBottom: 0,
            },
          },
        },
      }),
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        source: ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
        'ubuntu-mono': ['Ubuntu Mono', ...defaultTheme.fontFamily.mono],
        system: defaultTheme.fontFamily.sans,
        flow: 'Flow',
      },
      spacing: {
        18: '4.5rem',
        '15px': '0.9375rem',
        '23px': '1.4375rem',
        full: '100%',
      },
      width: {
        xl: '36rem',
      },
      maxWidth: {
        '4.5xl': '60rem',
        '8xl': '90rem',
      },
      maxHeight: (theme) => ({
        sm: '30rem',
        '(screen-18)': `calc(100vh - ${theme('spacing.18')})`,
      }),
      boxShadow: {
        px: '0 0 0 1px rgba(0, 0, 0, 0.5)',
        link: 'inset 0 -0.125em 0 0 #fff, inset 0 -0.375em 0 0 rgba(165, 243, 252, 0.4)',
      },
      keyframes: {
        'flash-code': {
          '0%': { backgroundColor: 'rgba(134, 239, 172, 0.25)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'flash-code': 'flash-code 1s forwards',
        'flash-code-slow': 'flash-code 2s forwards',
      },
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing',
      },
      transitionDuration: {
        1500: '1.5s',
      },
      backgroundImage: {
        squiggle: `url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23fbbf24'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")`,
      },
      scale: {
        80: '0.8',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['odd', 'even'],
      borderWidth: ['first', 'last', 'hover', 'focus'],
      cursor: ['active'],
      opacity: ['disabled'],
      textColor: ['group-focus'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities, theme }) {
      const shadows = theme('boxShadow')
      addUtilities(
        Object.keys(shadows).reduce(
          (utils, key) => ({
            ...utils,
            [`.text-shadow${key === 'DEFAULT' ? '' : `-${key}`}`]: {
              textShadow: shadows[key].replace(
                /([0-9]+(px)? [0-9]+(px)? [0-9]+(px)?) [0-9]+(px)?/g,
                '$1'
              ),
            },
          }),
          {}
        )
      )
    },
    function ({ addUtilities, theme }) {
      const utilities = {
        '.bg-stripes': {
          backgroundImage:
            'linear-gradient(45deg, var(--stripes-color) 12.50%, transparent 12.50%, transparent 50%, var(--stripes-color) 50%, var(--stripes-color) 62.50%, transparent 62.50%, transparent 100%)',
          backgroundSize: '5.66px 5.66px',
        },
      }

      const addColor = (name, color) =>
        (utilities[`.bg-stripes-${name}`] = { '--stripes-color': color })

      const colors = flattenColorPalette(theme('backgroundColor'))
      for (let name in colors) {
        try {
          const [r, g, b, a] = toRgba(colors[name])
          if (a !== undefined) {
            addColor(name, colors[name])
          } else {
            addColor(name, `rgba(${r}, ${g}, ${b}, 0.4)`)
          }
        } catch (_) {
          addColor(name, colors[name])
        }
      }

      addUtilities(utilities)
    },
  ],
}
