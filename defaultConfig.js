/*

Tailwind - The Utility-First CSS Framework

A project by Adam Wathan (@adamwathan), Jonathan Reinink (@reinink),
David Hemphill (@davidhemphill) and Steve Schoger (@steveschoger).

Welcome to the Tailwind config file. This is where you can customize
Tailwind specifically for your project. Don't be intimidated by the
length of this file. It's really just a big JavaScript object and
we've done our very best to explain each section.

View the full documentation at https://tailwindcss.com.


/*
|--------------------------------------------------------------------------
| The default config
|--------------------------------------------------------------------------
|
| This variable contains the default Tailwind config. You don't have to
| use it, but it can sometimes be helpful to have available. For
| example, you may choose to merge your custom configuration
| values with some of the Tailwind defaults.
|
*/

var defaultConfig = require('tailwindcss').defaultConfig


/*
|--------------------------------------------------------------------------
| Colors
|--------------------------------------------------------------------------
|
| Here you can specify the colors used in your project. As you'll see
| below these colors are applied to the text, background and border
| utilities.
|
| We've provided a bunch of colors to get you started, but please modify
| them for your project. Also, how you name your colors is entirely up
| to you. You can use color names (as we've done below), or follow a
| numeric scale (like 100, 200, 300), or something else entirely.
|
*/

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
  'smoke-light': '#f0f2f5',
  'smoke-lighter': '#f7f9fa',

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
  'blue-dark': '#3687c8',
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


  /*
  |--------------------------------------------------------------------------
  | Colors
  |--------------------------------------------------------------------------
  |
  | The color palette defined above is also assigned to the "colors" key of
  | your Tailwind config. This makes it easy to access them your CSS using
  | Tailwind's config helper. For example:
  |
  | .error { color: config('colors.red') }
  |
  */

  colors: colors,


  /*
  |--------------------------------------------------------------------------
  | Screens
  |--------------------------------------------------------------------------
  |
  | Screens in Tailwind are essentially CSS media queries. They define the
  | responsive breakpoints for your project. By default Tailwind takes a
  | "mobile first" approach, where each screen size represents a minimum
  | viewport width.
  |
  | Tailwind also allows for more complex screen definitions, which can be
  | useful in certain situations. Be sure to read the full responsive
  | documentation at https://tailwindcss.com/docs/responsive.
  |
  */

  screens: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },


  text: {


    /*
    |--------------------------------------------------------------------------
    | Fonts
    |--------------------------------------------------------------------------
    |
    | Here is where you define your project's font stack, or font families.
    | Keep in mind that Tailwind doesn't actually load any fonts for you.
    | If you're using custom fonts you'll need to import them prior to
    | defining them here.
    |
    | By default we provide a native font stack that works remarkably well on
    | any device or OS you're using, since it just uses the default fonts
    | provided by the platform.
    |
    */

    fonts: {
      'sans': '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
      'serif': 'Constantia, "Lucida Bright", Lucidabright, "Lucida Serif", Lucida, "DejaVu Serif", "Bitstream Vera Serif", "Liberation Serif", Georgia, serif',
      'mono': '"SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },


    /*
    |--------------------------------------------------------------------------
    | Text sizes
    |--------------------------------------------------------------------------
    |
    | Here is where you define your text sizes. These will be available as
    | .text-{size} utilities. Name these in whatever way makes the most
    | sense to you. We use size names by default, but you're welcome to
    | use a numeric scale or even something else entirely.
    |
    | By default Tailwind uses the "rem" unit type for most measurements.
    | This allows you to set a root font size which all other sizes are
    | then based on. That said, you are free to use whatever unit
    | types you prefer, be it rems, ems, pixels or other.
    |
    */

    sizes: {
      'xs': '.75rem',     // 12px
      'sm': '.875rem',    // 14px
      'base': '1rem',     // 16px
      'lg': '1.125rem',   // 18px
      'xl': '1.25rem',    // 20px
      '2xl': '1.75rem',   // 28px
      '3xl': '2.375rem',  // 38px
      '4xl': '2.875rem',  // 46px
    },


    /*
    |--------------------------------------------------------------------------
    | Font weights
    |--------------------------------------------------------------------------
    |
    | Here is where you define your font weights. These will be available as
    | .font-{weight} utilities. We've provided a list of common font weight
    | names with their respective numeric scale values to get you started.
    | It's unlikely that your project will require all of these, so we
    | recommend removing those you don't.
    |
    */

    weights: {
      'hairline': 100,
      'thin': 200,
      'light': 300,
      'normal': 400,
      'medium': 500,
      'semibold': 600,
      'bold': 700,
      'extrabold': 800,
      'black': 900,
    },


    /*
    |--------------------------------------------------------------------------
    | Text leading (line height)
    |--------------------------------------------------------------------------
    |
    | Here is where you define your line height values, or as we call them
    | in Tailwind, leadings. These will be available as .leading-{size}
    | utilities.
    |
    */

    leading: {
      'none': 1,
      'tight': 1.25,
      'normal': 1.5,
      'loose': 2,
    },


    /*
    |--------------------------------------------------------------------------
    | Text tracking (spacing)
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    tracking: {
      'tight': '-0.05em',
      'normal': '0',
      'wide': '0.05em',
    },


    /*
    |--------------------------------------------------------------------------
    | Text colors
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    colors: colors,

  },

  backgrounds: {


    /*
    |--------------------------------------------------------------------------
    | Background colors
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    colors: colors,

  },

  borders: {


    /*
    |--------------------------------------------------------------------------
    | Border widths
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    widths: {
      default: '1px',
      '0': '0',
      '2': '2px',
      '4': '4px',
      '8': '8px',
    },


    /*
    |--------------------------------------------------------------------------
    | Border colors
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    colors: Object.assign({ default: colors['slate-lighter'] }, colors)

  },


  /*
  |--------------------------------------------------------------------------
  | Radiuses
  |--------------------------------------------------------------------------
  |
  | Add...
  |
  */

  radiuses: {
    default: '.25rem',
    sm: '.125rem',
    lg: '.5rem',
    pill: '9999px',
  },


  sizing: {


    /*
    |--------------------------------------------------------------------------
    | Width
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

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


    /*
    |--------------------------------------------------------------------------
    | Height
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

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


    /*
    |--------------------------------------------------------------------------
    | Minimum width
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    minWidth: {
      '0': '0',
      'full': '100%',
    },


    /*
    |--------------------------------------------------------------------------
    | Minimum height
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    minHeight: {
      '0': '0',
      'full': '100%',
      'screen': '100vh'
    },


    /*
    |--------------------------------------------------------------------------
    | Maximum width
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

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


    /*
    |--------------------------------------------------------------------------
    | Maximum height
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    maxHeight: {
      'full': '100%',
      'screen': '100vh'
    },

  },

  spacing: {


    /*
    |--------------------------------------------------------------------------
    | Padding
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    padding: {
      'px': '1px',
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
    },


    /*
    |--------------------------------------------------------------------------
    | Margin
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    margin: {
      'px': '1px',
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
    },


    /*
    |--------------------------------------------------------------------------
    | Negative margin
    |--------------------------------------------------------------------------
    |
    | Add...
    |
    */

    negativeMargin: {
      'px': '1px',
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
    },

  },


  /*
  |--------------------------------------------------------------------------
  | Shadows
  |--------------------------------------------------------------------------
  |
  | Add...
  |
  */

  shadows: {
    default: '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.15)',
    'md': '0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13)',
    'lg': '0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13)',
    'inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    'none': 'none',
  },


  /*
  |--------------------------------------------------------------------------
  | Z-index
  |--------------------------------------------------------------------------
  |
  | Add...
  |
  */

  zIndex: {
    '0': 0,
    '10': 10,
    '20': 20,
    '30': 30,
    '40': 40,
    '50': 50,
    'auto': 'auto',
  },


  /*
  |--------------------------------------------------------------------------
  | Opacity
  |--------------------------------------------------------------------------
  |
  | Add...
  |
  */

  opacity: {
    '0': '0',
    '25': '.25',
    '50': '.5',
    '75': '.75',
    '100': '1',
  }

}
