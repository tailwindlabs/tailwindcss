import fs from 'fs'
import _ from 'lodash'
import postcss from 'postcss'
import cssnext from 'postcss-cssnext'
import stylefmt from 'stylefmt'

import defaultConfig from './defaultConfig'

import addCustomMediaQueries from './lib/addCustomMediaQueries'
import generateUtilities from './lib/generateUtilities'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

export default postcss.plugin('tailwind', options => {
  options = options || defaultConfig

  return postcss([
    addCustomMediaQueries(options),
    generateUtilities(options),
    substituteResponsiveAtRules(options),
    substituteClassApplyAtRules(options),
    cssnext(),
    stylefmt,
  ])
})
