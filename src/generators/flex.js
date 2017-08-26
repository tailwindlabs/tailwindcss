const postcss = require('postcss')
const _ = require('lodash')
const defineClasses = require('../util/defineClasses')

module.exports = function () {
  return defineClasses({
    flex: {
      display: 'flex',
    },
    inlineFlex: {
      display: 'inline-flex',
    },
    flexRow: {
      flexDirection: 'row',
    },
    flexRowReverse: {
      flexDirection: 'row-reverse',
    },
    flexCol: {
      flexDirection: 'column',
    },
    flexColReverse: {
      flexDirection: 'column-reverse',
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
    flexWrapReverse: {
      flexWrap: 'wrap-reverse',
    },
    flexNowrap: {
      flexWrap: 'nowrap',
    },
    itemsStart: {
      alignItems: 'flex-start',
    },
    itemsEnd: {
      alignItems: 'flex-end',
    },
    itemsCenter: {
      alignItems: 'center',
    },
    itemsBaseline: {
      alignItems: 'baseline',
    },
    itemsStretch: {
      alignItems: 'stretch',
    },
    justifyStart: {
      justifyContent: 'flex-start',
    },
    justifyEnd: {
      justifyContent: 'flex-end',
    },
    justifyCenter: {
      justifyContent: 'center',
    },
    justifyBetween: {
      justifyContent: 'space-between',
    },
    justifyAround: {
      justifyContent: 'space-around',
    },
    flexAuto: {
      flex: 'auto',
    },
    flexInitial: {
      flex: 'initial',
    },
    flexNone: {
      flex: 'none',
    },
    flexGrow: {
      flexGrow: '1',
    },
    flexShrink: {
      flexShrink: '1',
    },
    flexNoGrow: {
      flexGrow: '0',
    },
    flexNoShrink: {
      flexShrink: '0',
    },
  })
}
