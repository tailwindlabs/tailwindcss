import applyComplexClasses from '../flagged/applyComplexClasses'

export default function (config, getProcessedPlugins, configChanged) {
  return applyComplexClasses(config, getProcessedPlugins, configChanged)
}
