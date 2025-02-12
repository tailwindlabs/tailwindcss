import flattenColorPalette from './flatten-color-palette.ts'

// This file exists so that `flatten-color-palette.ts` can be written one time
// but be compatible with both CJS and ESM. Without it we get a `.default`
// export when using `require` in CJS.

// @ts-ignore
export = flattenColorPalette
