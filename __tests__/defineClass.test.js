import postcss from 'postcss'
import fs from 'fs'
import _ from 'lodash'
import c from '../src/util/collapseWhitespace'
import defineClass from '../src/util/defineClass'

/**
 * Tests
 */
it('creates a proper single-word class with rules', () => {
  let output = defineClass('flex', {display: 'flex'})
  expect(c(output.toString())).toEqual(`.flex { display: flex }`)
})

it('does not modify the case of selector names', () => {
  let output = defineClass('inlineBlock', {display: 'inline-block'})
  expect(c(output.toString())).toEqual(`.inlineBlock { display: inline-block }`)
})

it('does not modify the case of property names', () => {
  let output = defineClass('smooth', {'-webkit-font-smoothing': 'antialiased'})
  expect(c(output.toString())).toEqual(`.smooth { -webkit-font-smoothing: antialiased }`)
})
