import type { PluginAPI } from '../../src/compat/plugin-api'

export function plugin({ addComponents, addUtilities }: PluginAPI) {
  addUtilities({
    '.btn-utility': {
      padding: '1rem 2rem',
      borderRadius: '1rem',
    },
  })
  addComponents({
    '.btn': {
      padding: '.5rem 1rem',
      borderRadius: '.25rem',
    },
    '.btn-blue': {
      backgroundColor: '#3490dc',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#2779bd',
      },
    },
  })
}
