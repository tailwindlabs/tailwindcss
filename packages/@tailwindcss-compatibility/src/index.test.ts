import tailwindcss from '@tailwindcss/postcss'
import dedent from 'dedent'
import postcss from 'postcss'
import { expect, test } from 'vitest'
import compatibility from './index'

const css = dedent

test('does the thing', async () => {
  let processor = postcss([tailwindcss(), compatibility()])

  let result = await processor.process(
    css`
      @layer theme, base, components, utilities;

      @import 'tailwindcss/theme.css' layer(theme) theme(inline);
      /* @import 'tailwindcss/preflight.css' layer(base); */
      @import 'tailwindcss/utilities.css' layer(utilities) source(none);

      @source inline("h-14 bg-linear-to-bl from-violet-500/50 to-fuchsia-500/50");
    `,
    { from: `${__dirname}/input.css` },
  )

  expect(result.css.trim()).toMatchInlineSnapshot(`
    "@layer {
      *, *:before, *:after, *:backdrop {
        --tw-gradient-position: initial;
        --tw-gradient-from: #0000;
        --tw-gradient-via: #0000;
        --tw-gradient-to: #0000;
        --tw-gradient-stops: initial;
        --tw-gradient-via-stops: initial;
        --tw-gradient-from-position: 0%;
        --tw-gradient-via-position: 50%;
        --tw-gradient-to-position: 100%;
      }
    }
    @layer theme, base, components, utilities;
    @layer utilities {
      .h-14 {
        height: calc(0.25rem * 14);
      }
      .bg-linear-to-bl {
        --tw-gradient-position: to bottom left in oklab;
        background-image: linear-gradient(var(--tw-gradient-stops));
      }
      .from-violet-500\\/50 {
        --tw-gradient-from: color-mix(in oklab, oklch(0.606 0.25 292.717) 50%, transparent);
        --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
      }
      .to-fuchsia-500\\/50 {
        --tw-gradient-to: color-mix(in oklab, oklch(0.667 0.295 322.15) 50%, transparent);
        --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
      }
    }"
  `)
})
