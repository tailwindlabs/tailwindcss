var colors = {
  'black': '#000000',
  'white': '#ffffff',
  'transparent': 'transparent',

  'slate-darker': '#212b35',
  'slate-dark': '#404e5c',
  'slate': '#647382',
  'slate-light': '#919eab',
  'slate-lighter': '#c5ced6',

  'smoke-darker': '#919eab',
  'smoke-dark': '#c5ced6',
  'smoke': '#dfe3e8',
  'smoke-light': 'hsl(200, 33%, 96%)',
  'smoke-lighter': 'hsl(200, 25%, 98%)',

  'red-darker': '#960f0d',
  'red-dark': '#d43633',
  'red': '#f25451',
  'red-light': '#fa8785',
  'red-lighter': '#fff1f0',

  'orange-darker': '#875200',
  'orange-dark': '#f29500',
  'orange': '#ffb82b',
  'orange-light': '#ffd685',
  'orange-lighter': '#fff8eb',

  'yellow-darker': '#966100',
  'yellow-dark': '#ffc400',
  'yellow': '#ffe14a',
  'yellow-light': '#ffea83',
  'yellow-lighter': '#fffbe5',

  'green-darker': '#056619',
  'green-dark': '#34ae4c',
  'green': '#57d06f',
  'green-light': '#b1f3be',
  'green-lighter': '#eefff1',

  'teal-darker': '#025654',
  'teal-dark': '#249e9a',
  'teal': '#4dc0b5',
  'teal-light': '#9eebe4',
  'teal-lighter': '#e8fdfa',

  'blue-darker': '#154267',
  'blue-dark': '#317af6',
  'blue': '#4aa2ea',
  'blue-light': '#acdaff',
  'blue-lighter': '#f1f9ff',

  'indigo-darker': '#242b54',
  'indigo-dark': '#4957a5',
  'indigo': '#6574cd',
  'indigo-light': '#bcc5fb',
  'indigo-lighter': '#f4f5ff',

  'purple-darker': '#331f56',
  'purple-dark': '#714cb4',
  'purple': '#976ae6',
  'purple-light': '#ceb3ff',
  'purple-lighter': '#f7f3ff',

  'pink-darker': '#6b2052',
  'pink-dark': '#d84f7d',
  'pink': '#f66d9b',
  'pink-light': '#ffa5c3',
  'pink-lighter': '#fdf2f5',
}

module.exports = {
  colors: colors,
  screens: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  text: {
    fonts: {
      'sans': 'Proxima Nova, proxima-nova, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
      'serif': 'Constantia, "Lucida Bright", Lucidabright, "Lucida Serif", Lucida, "DejaVu Serif", "Bitstream Vera Serif", "Liberation Serif", Georgia, serif',
      'mono': 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    sizes: {
      'base': '1rem', // 16px
      'xs': '.75rem', // 12px
      'sm': '.875rem', // 14px
      'md': '1rem', // 16px
      'lg': '1.125rem', // 18px
      'xl': '1.25rem', // 20px
      '2xl': '1.75rem', // 28px
      '3xl': '2.375rem', // 38px
      '4xl': '2.875rem', // 46px
    },
    weights: {
      'normal': 400,
      'semibold': 500,
      'bold': 700,
    },
    leading: {
      'none': 1,
      'tight': 1.25,
      'normal': 1.5,
      'loose': 2,
    },
    tracking: {
      'tight': '-0.05em',
      'normal': '0',
      'wide': '0.05em',
    },
    colors: {
      ...colors
    },
  },
  backgrounds: {
    colors: {
      ...colors
    },
  },
  borders: {
    widths: {
      default: '1px',
      '0': '0',
      '2': '2px',
      '4': '4px',
      '8': '8px',
    },
    colors: {
      default: colors['slate-lighter'],
      ...colors
    },
  },
  radiuses: {
    default: '.25rem',
    sm: '.125rem',
    lg: '.5rem',
    pill: '9999px',
  },
  sizing: {
    width: {
      'auto': 'auto',
      'px': '1px',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '24': '6rem',
      '32': '8rem',
      '48': '12rem',
      '64': '16rem',
      '128': '32rem',
      '1/2': '50%',
      '1/3': '33.33333%',
      '2/3': '66.66667%',
      '1/4': '25%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.66667%',
      '5/6': '83.33333%',
      'full': '100%',
      'screen': '100vw'
    },
    height: {
      'auto': 'auto',
      'px': '1px',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '24': '6rem',
      '32': '8rem',
      '48': '12rem',
      '64': '16rem',
      'full': '100%',
      'screen': '100vh'
    },
    minHeight: {
      '0': '0',
      'full': '100%',
      'screen': '100vh'
    },
    maxHeight: {
      'full': '100%',
      'screen': '100vh'
    },
    minWidth: {
      '0': '0',
      'full': '100%',
    },
    maxWidth: {
      'xs': '20rem',
      'sm': '30rem',
      'md': '40rem',
      'lg': '50rem',
      'xl': '60rem',
      '2xl': '70rem',
      '3xl': '80rem',
      '4xl': '90rem',
      '5xl': '100rem',
      'full': '100%',
    },
  },
  spacing: {
    padding: {
      'px': '1px',
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem'
    },
    margin: {
      'px': '1px',
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem',
      '80': '20rem',
    },
    negativeMargin: {
      'px': '1px',
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem'
    },
  },
  shadows: {
    default: '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.15)',
    md: '0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13)',
    lg: '0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13)',
    inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    none: 'none',
  },
  zIndex: {
    '0': 0,
    '10': 10,
    '20': 20,
    '30': 30,
    '40': 40,
    '50': 50,
    'auto': 'auto',
  },
  opacity: {
    '0': '0',
    '25': '.25',
    '50': '.5',
    '75': '.75',
    '100': '1',
  },
}
