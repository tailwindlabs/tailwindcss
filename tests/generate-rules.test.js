import { generateRules } from '../src/lib/generateRules'
import resolveConfig from '../src/public/resolve-config'
import { createContext } from '../src/lib/setupContextUtils'
import { css } from './util/run'

it('should not generate rules that are incorrect', () => {
  let config = {
    plugins: [
      ({ matchVariant }) => {
        matchVariant('@', (value) => `@container (min-width: ${value})`)
      },
    ],
  }
  let context = createContext(resolveConfig(config))
  let rules = generateRules(
    new Set([
      // Invalid, missing `-`
      'group[:hover]:underline',

      // Invalid, `-` should not be there
      '@-[200px]:underline',

      // Valid
      'group-[:hover]:underline',
      '@[200px]:underline',
    ]),
    context
  )

  // Ensure we only have 2 valid rules
  expect(rules).toHaveLength(2)

  // Ensure we have the correct values
  expect(rules[0][1].toString()).toMatchFormattedCss(css`
    .group:hover .group-\[\:hover\]\:underline {
      text-decoration-line: underline;
    }
  `)
  expect(rules[1][1].toString()).toMatchFormattedCss(css`
    @container (min-width: 200px) {
      .\@\[200px\]\:underline {
        text-decoration-line: underline;
      }
    }
  `)
})
