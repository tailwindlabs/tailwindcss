import { bench } from 'vitest'
import * as CSS from './src/css-parser.ts';
import { readFileSync } from 'node:fs'

const currentFolder = new URL('.', import.meta.url).pathname;
const cssFile = readFileSync(currentFolder + './preflight.css', 'utf-8');

bench('css-parser on preflight.css', () => {
  CSS.parse(cssFile);
});


