import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

test('variants', () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './variants.test.html')],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './variants.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('stacked peer variants', async () => {
  let config = {
    content: [{ raw: 'peer-disabled:peer-focus:peer-hover:border-blue-500' }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  let expected = css`
    .peer:disabled:focus:hover ~ .peer-disabled\\:peer-focus\\:peer-hover\\:border-blue-500 {
      --tw-border-opacity: 1;
      border-color: rgb(59 130 246 / var(--tw-border-opacity));
    }
  `

  let result = await run(input, config)
  expect(result.css).toIncludeCss(expected)
})

it('should properly handle keyframes with multiple variants', async () => {
  let config = {
    content: [
      {
        raw: 'animate-spin hover:animate-spin focus:animate-spin hover:animate-bounce focus:animate-bounce',
      },
    ],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;
  `

  let result = await run(input, config)
  expect(result.css).toMatchFormattedCss(css`
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .hover\\:animate-spin:hover {
      animation: spin 1s linear infinite;
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

    .hover\\:animate-bounce:hover {
      animation: bounce 1s infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .focus\\:animate-spin:focus {
      animation: spin 1s linear infinite;
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

    .focus\\:animate-bounce:focus {
      animation: bounce 1s infinite;
    }
  `)
})
