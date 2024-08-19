import { Theme } from '../theme'
import { createCompatConfig } from './config/create-compat-config'

let theme = new Theme()

export default {
  ...createCompatConfig(theme).theme,
  fontSize: {
    base: ['1rem', { lineHeight: '1.5rem' }],
  },
  spacing: {
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    10: '2.5rem',
  },
  borderWidth: {
    DEFAULT: '1px',
  },
  borderRadius: {
    none: '0',
  },
}
