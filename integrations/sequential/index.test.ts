import { describe } from 'vitest'

import { sequentials as a } from '../postcss/next.test'
import { sequentials as b } from '../vite/astro.test'
import { sequentials as c } from '../vite/config.test'
import { sequentials as d } from '../vite/index.test'
import { sequentials as e } from '../vite/multi-root.test'
import { sequentials as f } from '../vite/nuxt.test'
import { sequentials as g } from '../vite/other-transforms.test'
import { sequentials as h } from '../vite/resolvers.test'

describe.sequential(() => {
  a()
  b()
  c()
  d()
  e()
  f()
  g()
  h()
})
