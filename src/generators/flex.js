import postcss from 'postcss'
import _ from 'lodash'
import defineClasses from '../util/defineClasses'

export default function() {
  return defineClasses({
    'flex': {
      display: 'flex',
    },
    'inline-flex': {
      display: 'inline-flex',
    },
    'flex-row': {
      flexDirection: 'row',
    },
    'flex-row-reverse': {
      flexDirection: 'row-reverse',
    },
    'flex-col': {
      flexDirection: 'column',
    },
    'flex-col-reverse': {
      flexDirection: 'column-reverse',
    },
    'flex-wrap': {
      flexWrap: 'wrap',
    },
    'flex-wrap-reverse': {
      flexWrap: 'wrap-reverse',
    },
    'flex-nowrap': {
      flexWrap: 'nowrap',
    },
    'items-start': {
      alignItems: 'flex-start',
    },
    'items-end': {
      alignItems: 'flex-end',
    },
    'items-center': {
      alignItems: 'center',
    },
    'items-baseline': {
      alignItems: 'baseline',
    },
    'items-stretch': {
      alignItems: 'stretch',
    },
    'justify-start': {
      justifyContent: 'flex-start',
    },
    'justify-end': {
      justifyContent: 'flex-end',
    },
    'justify-center': {
      justifyContent: 'center',
    },
    'justify-between': {
      justifyContent: 'space-between',
    },
    'justify-around': {
      justifyContent: 'space-around',
    },
    'flex-auto': {
      flex: 'auto',
    },
    'flex-initial': {
      flex: 'initial',
    },
    'flex-none': {
      flex: 'none',
    },
    'flex-grow': {
      flexGrow: '1',
    },
    'flex-shrink': {
      flexShrink: '1',
    },
    'flex-no-grow': {
      flexGrow: '0',
    },
    'flex-no-shrink': {
      flexShrink: '0',
    },
  })
}
