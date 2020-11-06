/*
https://github.com/webcaetano/shuffle-seed

The MIT License (MIT)

Copyright (c) 2015 Andre Caetano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import seedrandom from 'seedrandom'

const shuffleSeed = {}

const seedify = function (seed) {
  if (/(number|string)/i.test(Object.prototype.toString.call(seed).match(/^\[object (.*)\]$/)[1]))
    return seed
  if (isNaN(seed))
    return Number(
      String((this.strSeed = seed))
        .split('')
        .map(function (x) {
          return x.charCodeAt(0)
        })
        .join('')
    )
  return seed
}

const seedRand = function (func, min, max) {
  return Math.floor(func() * (max - min + 1)) + min
}

shuffleSeed.shuffle = function (arr, seed) {
  if (!Array.isArray(arr)) return null
  seed = seedify(seed) || 'none'

  var size = arr.length
  var rng = seedrandom(seed)
  var resp = []
  var keys = []

  for (var i = 0; i < size; i++) keys.push(i)
  for (var i = 0; i < size; i++) {
    var r = seedRand(rng, 0, keys.length - 1)
    var g = keys[r]
    keys.splice(r, 1)
    resp.push(arr[g])
  }
  return resp
}

shuffleSeed.unshuffle = function (arr, seed) {
  if (!Array.isArray(arr)) return null
  seed = seedify(seed) || 'none'

  var size = arr.length
  var rng = seedrandom(seed)
  var resp = []
  var keys = []

  for (var i = 0; i < size; i++) {
    resp.push(null)
    keys.push(i)
  }

  for (var i = 0; i < size; i++) {
    var r = seedRand(rng, 0, keys.length - 1)
    var g = keys[r]
    keys.splice(r, 1)
    resp[g] = arr[i]
  }

  return resp
}

export default shuffleSeed
