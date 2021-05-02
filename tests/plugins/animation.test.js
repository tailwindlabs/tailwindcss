import postcss from 'postcss'
import processPlugins from '../../src/util/processPlugins'
import plugin from '../../src/plugins/animation'

function css(nodes) {
  return postcss.root({ nodes }).toString()
}

test('defining animation and keyframes', () => {
  const config = {
    theme: {
      animation: {
        none: 'none',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        spin: { to: { transform: 'rotate(360deg)' } },
        ping: { '75%, 100%': { transform: 'scale(2)', opacity: '0' } },
      },
    },
    variants: {
      animation: [],
    },
  }

  const { utilities } = processPlugins([plugin()], config)

  expect(css(utilities)).toMatchCss(`
    @layer utilities {
      @variants {
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      }
    }
    
    @layer utilities {
      @variants {
        .animate-none { animation: none; }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
      }
    }  
  `)
})

test('defining animation and keyframes with prefix', () => {
  const config = {
    prefix: 'tw-',
    theme: {
      animation: {
        none: 'none',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        spin: { to: { transform: 'rotate(360deg)' } },
        ping: { '75%, 100%': { transform: 'scale(2)', opacity: '0' } },
      },
    },
    variants: {
      animation: [],
    },
  }

  const { utilities } = processPlugins([plugin()], config)

  expect(css(utilities)).toMatchCss(`
    @layer utilities {
      @variants {
        @keyframes tw-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes tw-ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      }
    }

    @layer utilities {
      @variants {
        .tw-animate-none { animation: none; }
        .tw-animate-spin { animation: tw-spin 1s linear infinite; }
        .tw-animate-ping { animation: tw-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
      }
    }
  `)
})

test('defining animation and keyframes with prefix (skip undefined animations)', () => {
  const config = {
    prefix: 'tw-',
    theme: {
      animation: {
        none: 'none',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        spin: { to: { transform: 'rotate(360deg)' } },
      },
    },
    variants: {
      animation: [],
    },
  }

  const { utilities } = processPlugins([plugin()], config)

  expect(css(utilities)).toMatchCss(`
    @layer utilities {
      @variants {
        @keyframes tw-spin {
          to { transform: rotate(360deg); }
        }
      }
    }

    @layer utilities {
      @variants {
        .tw-animate-none { animation: none; }
        .tw-animate-spin { animation: tw-spin 1s linear infinite; }
        .tw-animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
      }
    }
  `)
})
