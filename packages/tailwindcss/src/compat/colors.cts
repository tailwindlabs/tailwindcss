import colors from './colors.ts'

// This file exists so that `colors.ts` can be written one time but be
// compatible with both CJS and ESM. Without it we get a `.default` export when
// using `require` in CJS.

// @ts-ignore
export = colors
