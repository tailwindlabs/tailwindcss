import { run, html, css } from './util/run'

test('basic', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="animate-spin"></div>
          <div class="hover:animate-ping"></div>
          <div class="group-hover:animate-bounce"></div>
        `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      @keyframes ping {
        75%,
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
      .hover\:animate-ping:hover {
        animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      @keyframes bounce {
        0%,
        100% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: none;
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
      .group:hover .group-hover\:animate-bounce {
        animation: bounce 1s infinite;
      }
    `)
  })
})

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
        animation: one 2s;
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
        animation: tw-one 2s;
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
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: none;
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
      @keyframes pulse {
        50% {
          opacity: 0.5;
        }
      }
      .animate-multiple {
        animation: bounce 2s linear, pulse 3s ease-in;
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
        animation: one 2s, two 3s;
      }
    `)
  })
})

test('with dots in the name', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="animate-zoom-.5"></div>
          <div class="animate-zoom-1.5"></div>
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
      @keyframes zoom-\.5 {
        to {
          transform: scale(0.5);
        }
      }
      .animate-zoom-\.5 {
        animation: zoom-\.5 2s;
      }
      @keyframes zoom-1\.5 {
        to {
          transform: scale(1.5);
        }
      }
      .animate-zoom-1\.5 {
        animation: zoom-1\.5 2s;
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
        animation: tw-zoom-\.5 2s;
      }
      @keyframes tw-zoom-1\.5 {
        to {
          transform: scale(1.5);
        }
      }
      .tw-animate-zoom-1\.5 {
        animation: tw-zoom-1\.5 2s;
      }
    `)
  })
})
