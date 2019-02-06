export default function(userConfig, defaultConfig) {
  return {
    ...defaultConfig,
    ...userConfig,
    theme: { ...defaultConfig.theme, ...userConfig.theme },
    variants: { ...defaultConfig.variants, ...userConfig.variants },
  }
}
