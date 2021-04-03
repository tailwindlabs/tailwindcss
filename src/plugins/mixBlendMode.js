export default function () {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        '.mix-normal': { 'mix-blend-mode': 'normal' },
        '.mix-multiply': { 'mix-blend-mode': 'multiply' },
        '.mix-screen': { 'mix-blend-mode': 'screen' },
        '.mix-overlay': { 'mix-blend-mode': 'overlay' },
        '.mix-darken': { 'mix-blend-mode': 'darken' },
        '.mix-lighten': { 'mix-blend-mode': 'lighten' },
        '.mix-color-dodge': { 'mix-blend-mode': 'color-dodge' },
        '.mix-color-burn': { 'mix-blend-mode': 'color-burn' },
        '.mix-hard-light': { 'mix-blend-mode': 'hard-light' },
        '.mix-soft-light': { 'mix-blend-mode': 'soft-light' },
        '.mix-difference': { 'mix-blend-mode': 'difference' },
        '.mix-exclusion': { 'mix-blend-mode': 'exclusion' },
        '.mix-hue': { 'mix-blend-mode': 'hue' },
        '.mix-saturation': { 'mix-blend-mode': 'saturation' },
        '.mix-color': { 'mix-blend-mode': 'color' },
        '.mix-luminosity': { 'mix-blend-mode': 'luminosity' },
      },
      variants('mixBlendMode')
    )
  }
}
