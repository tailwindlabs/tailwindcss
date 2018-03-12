import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'overflow-auto': { overflow: 'auto' },
    'overflow-hidden': { overflow: 'hidden' },
    'overflow-visible': { overflow: 'visible' },
    'overflow-scroll': { overflow: 'scroll' },
    'overflow-x-auto': {
      'overflow-x': 'auto',
      '-ms-overflow-style': '-ms-autohiding-scrollbar',
    },
    'overflow-y-auto': {
      'overflow-y': 'auto',
      '-ms-overflow-style': '-ms-autohiding-scrollbar',
    },
    'overflow-x-scroll': {
      'overflow-x': 'scroll',
      '-ms-overflow-style': '-ms-scrollbar',
    },
    'overflow-y-scroll': {
      'overflow-y': 'scroll',
      '-ms-overflow-style': '-ms-scrollbar',
    },
    'scrolling-touch': { '-webkit-overflow-scrolling': 'touch' },
    'scrolling-auto': { '-webkit-overflow-scrolling': 'auto' },
  })
}
