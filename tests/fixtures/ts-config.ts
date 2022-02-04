// @ts-ignore
import { defineConfig } from '../../src'

export default defineConfig({
  content: [{ raw: '<div class="mobile:font-bold"></div>' }],
  theme: {
    screens: {
      mobile: '400px',
    },
  },
})
