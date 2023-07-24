import { quickPluginTest } from '../util/run'

// Default `preflight` output
quickPluginTest('preflight').toMatchSnapshot()

// Lightning CSS optimizes this to just `border-color: 0 solid;` because `currentcolor` is the default user-agent stylesheet value.
// https://drafts.csswg.org/css-backgrounds/#border-color
quickPluginTest('preflight', {
  safelist: ['border-black'],
  theme: {
    borderColor: ({ theme }) => theme('colors'),
  },
}).toMatchSnapshot()
