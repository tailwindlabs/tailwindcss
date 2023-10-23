import resolveConfigObjects from '../util/resolveConfig'
import getAllConfigs from '../util/getAllConfigs'

export default function resolveConfig(...configs) {
  const [, ...defaultConfigs] = getAllConfigs(configs[0])
  return resolveConfigObjects([...configs, ...defaultConfigs])
}
