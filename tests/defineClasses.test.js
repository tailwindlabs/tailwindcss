var postcss = require('postcss')
var fs = require('fs')
var _ = require('lodash')
var defineClasses = require('../src/util/define-classes')

var config = {
    flex: {
        display: 'flex',
    },
    inlineFlex: {
        display: 'inline-flex',
    },
}

var flexHelper = `.flex {
    display: flex
}`

var inlineFlexHelper = `.inline-flex {
    display: inline-flex
}`

/**
 * Tests
 */
it('it generates a set of helper classes from a config', () => {
    output = defineClasses(config)
    expect(output).toBeInstanceOf(Array)
    expect(output[0].toString()).toEqual(flexHelper)
    expect(output[1].toString()).toEqual(inlineFlexHelper)
})
