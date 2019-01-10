export default function () {
  return function ({ addUtilities, config }) {
    addUtilities({
      '.flex': {
        display: 'flex',
      },
      '.inline-flex': {
        display: 'inline-flex',
      },
      '.flex-row': {
        'flex-direction': 'row',
      },
      '.flex-row-reverse': {
        'flex-direction': 'row-reverse',
      },
      '.flex-col': {
        'flex-direction': 'column',
      },
      '.flex-col-reverse': {
        'flex-direction': 'column-reverse',
      },
      '.flex-wrap': {
        'flex-wrap': 'wrap',
      },
      '.flex-wrap-reverse': {
        'flex-wrap': 'wrap-reverse',
      },
      '.flex-no-wrap': {
        'flex-wrap': 'nowrap',
      },
      '.items-start': {
        'align-items': 'flex-start',
      },
      '.items-end': {
        'align-items': 'flex-end',
      },
      '.items-center': {
        'align-items': 'center',
      },
      '.items-baseline': {
        'align-items': 'baseline',
      },
      '.items-stretch': {
        'align-items': 'stretch',
      },
      '.self-auto': {
        'align-self': 'auto',
      },
      '.self-start': {
        'align-self': 'flex-start',
      },
      '.self-end': {
        'align-self': 'flex-end',
      },
      '.self-center': {
        'align-self': 'center',
      },
      '.self-stretch': {
        'align-self': 'stretch',
      },
      '.justify-start': {
        'justify-content': 'flex-start',
      },
      '.justify-end': {
        'justify-content': 'flex-end',
      },
      '.justify-center': {
        'justify-content': 'center',
      },
      '.justify-between': {
        'justify-content': 'space-between',
      },
      '.justify-around': {
        'justify-content': 'space-around',
      },
      '.content-center': {
        'align-content': 'center',
      },
      '.content-start': {
        'align-content': 'flex-start',
      },
      '.content-end': {
        'align-content': 'flex-end',
      },
      '.content-between': {
        'align-content': 'space-between',
      },
      '.content-around': {
        'align-content': 'space-around',
      },
      '.flex-1': {
        flex: '1 1 0%',
      },
      '.flex-auto': {
        flex: '1 1 auto',
      },
      '.flex-initial': {
        flex: '0 1 auto',
      },
      '.flex-none': {
        flex: 'none',
      },
      '.flex-grow': {
        'flex-grow': '1',
      },
      '.flex-shrink': {
        'flex-shrink': '1',
      },
      '.flex-no-grow': {
        'flex-grow': '0',
      },
      '.flex-no-shrink': {
        'flex-shrink': '0',
      },
    }, config('modules.flexbox'))
  }
}
