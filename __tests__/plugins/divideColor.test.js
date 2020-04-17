import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/divideColor'

test('generating divide color utilities', () => {
  const config = {
    theme: {
      divideColor: {
        default: 'orange', // This should be ignored
        purple: 'purple',
        white: {
          25: 'rgba(255,255,255,.25)',
          50: 'rgba(255,255,255,.5)',
          75: 'rgba(255,255,255,.75)',
          default: '#fff',
        },
        red: {
          1: 'rgb(33,0,0)',
          2: 'rgb(67,0,0)',
          3: 'rgb(100,0,0)',
        },
        green: {
          1: 'rgb(0,33,0)',
          2: 'rgb(0,67,0)',
          3: 'rgb(0,100,0)',
        },
        blue: {
          1: 'rgb(0,0,33)',
          2: 'rgb(0,0,67)',
          3: 'rgb(0,0,100)',
        },
      },
    },
    variants: {
      divideColor: ['responsive'],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.divide-purple > :not(template) ~ :not(template)': {
          'border-color': 'purple',
        },
        '.divide-white-25 > :not(template) ~ :not(template)': {
          'border-color': 'rgba(255,255,255,.25)',
        },
        '.divide-white-50 > :not(template) ~ :not(template)': {
          'border-color': 'rgba(255,255,255,.5)',
        },
        '.divide-white-75 > :not(template) ~ :not(template)': {
          'border-color': 'rgba(255,255,255,.75)',
        },
        '.divide-white > :not(template) ~ :not(template)': {
          'border-color': '#fff',
        },
        '.divide-red-1 > :not(template) ~ :not(template)': {
          'border-color': 'rgb(33,0,0)',
        },
        '.divide-red-2 > :not(template) ~ :not(template)': {
          'border-color': 'rgb(67,0,0)',
        },
        '.divide-red-3 > :not(template) ~ :not(template)': {
          'border-color': 'rgb(100,0,0)',
        },
        '.divide-green-1 > :not(template) ~ :not(template)': {
          'border-color': 'rgb(0,33,0)',
        },
        '.divide-green-2 > :not(template) ~ :not(template)': {
          'border-color': 'rgb(0,67,0)',
        },
        '.divide-green-3 > :not(template) ~ :not(template)': {
          'border-color': 'rgb(0,100,0)',
        },
        '.divide-blue-1 > :not(template) ~ :not(template)': {
          'border-color': 'rgb(0,0,33)',
        },
        '.divide-blue-2 > :not(template) ~ :not(template)': {
          'border-color': 'rgb(0,0,67)',
        },
        '.divide-blue-3 > :not(template) ~ :not(template)': {
          'border-color': 'rgb(0,0,100)',
        },
      },
      ['responsive'],
    ],
  ])
})
