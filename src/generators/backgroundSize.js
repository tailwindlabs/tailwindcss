import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'bg-cover': {
      'background-size': 'cover',
    },
    'bg-contain': {
      'background-size': 'contain',
    },
  })
}
