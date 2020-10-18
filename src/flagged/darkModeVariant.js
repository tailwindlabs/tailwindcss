import defaultConfig from '../../defaultConfig'

export default {
  dark: 'media',
  variants: {
    backgroundColor: [...defaultConfig.variants.backgroundColor, 'dark'],
    gradientColorStops: [...defaultConfig.variants.gradientColorStops, 'dark'],
    borderColor: [...defaultConfig.variants.borderColor, 'dark'],
    divideColor: [...defaultConfig.variants.divideColor, 'dark'],
    placeholderColor: [...defaultConfig.variants.placeholderColor, 'dark'],
    textColor: [...defaultConfig.variants.textColor, 'dark'],
  },
}
