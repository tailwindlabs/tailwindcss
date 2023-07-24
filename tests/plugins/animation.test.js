import { run, html, css, quickPluginTest } from '../util/run'

quickPluginTest('animation', {
  safelist: [
    // Arbitrary values
    'animate-[1s_infinite_example]',
    'animate-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .animate-\[1s_infinite_example\] {
    animation: 1s infinite example;
  }
  .animate-\[var\(--my-value\)\] {
    animation: var(--my-value);
  }
  @keyframes bounce {
    0%,
    100% {
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      transform: translateY(-25%);
    }
    50% {
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      transform: none;
    }
  }
  .animate-bounce {
    animation: 1s infinite bounce;
  }
  .animate-none {
    animation: none;
  }
  @keyframes ping {
    75%,
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }
  .animate-ping {
    animation: 1s cubic-bezier(0, 0, 0.2, 1) infinite ping;
  }
  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }
  .animate-pulse {
    animation: 2s cubic-bezier(0.4, 0, 0.6, 1) infinite pulse;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin {
    animation: 1s linear infinite spin;
  }
`)

test('custom', () => {
  let config = {
    content: [{ raw: html`<div class="animate-one"></div>` }],
    theme: {
      extend: {
        keyframes: {
          one: { to: { transform: 'rotate(360deg)' } },
        },
        animation: {
          one: 'one 2s',
        },
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @keyframes one {
        to {
          transform: rotate(360deg);
        }
      }
      .animate-one {
        animation: 2s one;
      }
    `)
  })
})

test('custom prefixed', () => {
  let config = {
    prefix: 'tw-',
    content: [{ raw: `<div class="tw-animate-one"></div>` }],
    theme: {
      extend: {
        keyframes: {
          one: { to: { transform: 'rotate(360deg)' } },
        },
        animation: {
          one: 'one 2s',
        },
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @keyframes tw-one {
        to {
          transform: rotate(360deg);
        }
      }
      .tw-animate-one {
        animation: 2s tw-one;
      }
    `)
  })
})

test('multiple', () => {
  let config = {
    content: [{ raw: html`<div class="animate-multiple"></div>` }],
    theme: {
      extend: {
        animation: {
          multiple: 'bounce 2s linear, pulse 3s ease-in',
        },
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @keyframes bounce {
        0%,
        100% {
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          transform: translateY(-25%);
        }
        50% {
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          transform: none;
        }
      }
      @keyframes pulse {
        50% {
          opacity: 0.5;
        }
      }
      .animate-multiple {
        animation: 2s linear bounce, 3s ease-in pulse;
      }
    `)
  })
})

test('multiple custom', () => {
  let config = {
    content: [{ raw: html`<div class="animate-multiple"></div>` }],
    theme: {
      extend: {
        keyframes: {
          one: { to: { transform: 'rotate(360deg)' } },
          two: { to: { transform: 'scale(1.23)' } },
        },
        animation: {
          multiple: 'one 2s, two 3s',
        },
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @keyframes one {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes two {
        to {
          transform: scale(1.23);
        }
      }
      .animate-multiple {
        animation: 2s one, 3s two;
      }
    `)
  })
})

test('with dots in the name', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="animate-zoom-0.5"></div>
          <div class="animate-zoom-1.5"></div>
        `,
      },
    ],
    theme: {
      extend: {
        keyframes: {
          'zoom-0.5': { to: { transform: 'scale(0.5)' } },
          'zoom-1.5': { to: { transform: 'scale(1.5)' } },
        },
        animation: {
          'zoom-0.5': 'zoom-0.5 2s',
          'zoom-1.5': 'zoom-1.5 2s',
        },
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @keyframes zoom-0\.5 {
        to {
          transform: scale(0.5);
        }
      }

      .animate-zoom-0\.5 {
        animation: 2s zoom-0\.5;
      }

      @keyframes zoom-1\.5 {
        to {
          transform: scale(1.5);
        }
      }

      .animate-zoom-1\.5 {
        animation: 2s zoom-1\.5;
      }
    `)
  })
})

test('with dots in the name and prefix', () => {
  let config = {
    prefix: 'tw-',
    content: [
      {
        raw: html`
          <div class="tw-animate-zoom-.5"></div>
          <div class="tw-animate-zoom-1.5"></div>
        `,
      },
    ],
    theme: {
      extend: {
        keyframes: {
          'zoom-.5': { to: { transform: 'scale(0.5)' } },
          'zoom-1.5': { to: { transform: 'scale(1.5)' } },
        },
        animation: {
          'zoom-.5': 'zoom-.5 2s',
          'zoom-1.5': 'zoom-1.5 2s',
        },
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @keyframes tw-zoom-\.5 {
        to {
          transform: scale(0.5);
        }
      }
      .tw-animate-zoom-\.5 {
        animation: 2s tw-zoom-\.5;
      }
      @keyframes tw-zoom-1\.5 {
        to {
          transform: scale(1.5);
        }
      }
      .tw-animate-zoom-1\.5 {
        animation: 2s tw-zoom-1\.5;
      }
    `)
  })
})

test('special character prefixes are escaped in animation names', () => {
  let config = {
    prefix: '@',
    content: [{ raw: `<div class="@animate-one"></div>` }],
    theme: {
      extend: {
        keyframes: {
          one: { to: { transform: 'rotate(360deg)' } },
        },
        animation: {
          one: 'one 2s',
        },
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @keyframes \@one {
        to {
          transform: rotate(360deg);
        }
      }
      .\@animate-one {
        animation: 2s \@one;
      }
    `)
  })
})
