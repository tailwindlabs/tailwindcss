import { test, expect } from 'vitest'
import { compile } from '.'
import type { PluginAPI } from './compat/plugin-api'

const css = String.raw

test('custom variants using @scope should wrap correctly', async () => {
  let compiler = await compile(
    css`
      @theme {
        --color-red-500: #ef4444;
      }
      @tailwind utilities;
      @plugin 'my-plugin';
    `,
    {
      loadModule: async (id) => {
        if (id === 'my-plugin') {
          return {
            path: '',
            base: '',
            module: ({ addVariant }: PluginAPI) => {
              addVariant('scoped', '@scope (.theme) { & }')
            },
          }
        }
        return { path: '', base: '', module: () => {} }
      },
    },
  )

  let result = compiler.build(['scoped:bg-red-500'])

  // 👇 Move your debug log here
  console.log('\n\n=== GENERATED CSS ===\n', result, '\n====================\n\n')

  expect(result).toContain('@scope (.theme)')
  expect(result).toContain('.scoped\\:bg-red-500')
  // The @scope at-rule should wrap the selector: @scope { .selector { ... } }
  expect(result.indexOf('@scope')).toBeLessThan(result.indexOf('.scoped\\:bg-red-500'))

})
