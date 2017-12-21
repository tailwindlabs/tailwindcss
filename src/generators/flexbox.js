import defineClasses from '../util/defineClasses'

export default function({ naming: { flex: ns } }) {
  return defineClasses({
    [ns.flex]: {
      display: 'flex',
    },
    [ns.inlineFlex]: {
      display: 'inline-flex',
    },
    [ns.flexRow]: {
      'flex-direction': 'row',
    },
    [ns.flexRowReverse]: {
      'flex-direction': 'row-reverse',
    },
    [ns.flexCol]: {
      'flex-direction': 'column',
    },
    [ns.flexColReverse]: {
      'flex-direction': 'column-reverse',
    },
    [ns.flexWrap]: {
      'flex-wrap': 'wrap',
    },
    [ns.flexWrapReverse]: {
      'flex-wrap': 'wrap-reverse',
    },
    [ns.flexNoWrap]: {
      'flex-wrap': 'nowrap',
    },
    [ns.itemsStart]: {
      'align-items': 'flex-start',
    },
    [ns.itemsEnd]: {
      'align-items': 'flex-end',
    },
    [ns.itemsCenter]: {
      'align-items': 'center',
    },
    [ns.itemsBaseline]: {
      'align-items': 'baseline',
    },
    [ns.itemsStretch]: {
      'align-items': 'stretch',
    },
    [ns.selfAuto]: {
      'align-self': 'auto',
    },
    [ns.selfStart]: {
      'align-self': 'flex-start',
    },
    [ns.selfEnd]: {
      'align-self': 'flex-end',
    },
    [ns.selfCenter]: {
      'align-self': 'center',
    },
    [ns.selfStretch]: {
      'align-self': 'stretch',
    },
    [ns.justifyStart]: {
      'justify-content': 'flex-start',
    },
    [ns.justifyEnd]: {
      'justify-content': 'flex-end',
    },
    [ns.justifyCenter]: {
      'justify-content': 'center',
    },
    [ns.justifyBetween]: {
      'justify-content': 'space-between',
    },
    [ns.justifyAround]: {
      'justify-content': 'space-around',
    },
    [ns.contentCenter]: {
      'align-content': 'center',
    },
    [ns.contentStart]: {
      'align-content': 'flex-start',
    },
    [ns.contentEnd]: {
      'align-content': 'flex-end',
    },
    [ns.contentBetween]: {
      'align-content': 'space-between',
    },
    [ns.contentAround]: {
      'align-content': 'space-around',
    },
    [ns.flex1]: {
      flex: '1',
    },
    [ns.flexAuto]: {
      flex: 'auto',
    },
    [ns.flexInitial]: {
      flex: 'initial',
    },
    [ns.flexNone]: {
      flex: 'none',
    },
    [ns.flexGrow]: {
      'flex-grow': '1',
    },
    [ns.flexShrink]: {
      'flex-shrink': '1',
    },
    [ns.flexNoGrow]: {
      'flex-grow': '0',
    },
    [ns.flexNoShrink]: {
      'flex-shrink': '0',
    },
  })
}
