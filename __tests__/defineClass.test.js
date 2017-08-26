import postcss from 'postcss'
import fs from 'fs'
import _ from 'lodash'
import defineClass from '../src/util/defineClass'

let flexHelper = `.flex {
    display: flex
}`

let inlineBlock = `.inline-block {
    display: inline-block
}`

let inlineFlexHelper = `.inline-flex {
    display: inline-flex
}`

let backgroundColor = `.bg-1 {
    background-color: #bada55
}`

/**
 * Tests
 */
it('creates a proper single-word class with rules', () => {
  let output = defineClass('flex', {display: 'flex'})
  expect(output.toString()).toEqual(flexHelper)
})

it('generates a rule with a kebab-case selector', () => {
  let output = defineClass('inlineBlock', {display: 'inline-block'})
  expect(output.toString()).toEqual(inlineBlock)
})

it('generates a rule with a kebab-case property name', () => {
  let output = defineClass('bg-1', {backgroundColor: '#bada55'})
  expect(output.toString()).toEqual(backgroundColor)
})
