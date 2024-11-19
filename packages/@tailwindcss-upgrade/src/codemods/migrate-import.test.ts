import dedent from 'dedent'
import postcss from 'postcss'
import { expect, it } from 'vitest'
import { migrateImport } from './migrate-import'

const css = dedent

async function migrate(input: string) {
  return postcss()
    .use(migrateImport())
    .process(input, { from: expect.getState().testPath })
    .then((result) => result.css)
}

it('prints relative file imports as relative paths', async () => {
  expect(
    await migrate(css`
      @import url('https://example.com');

      @import 'fixtures/test';
      @import 'fixtures/test.css';
      @import './fixtures/test.css';
      @import './fixtures/test';

      @import 'fixtures/test' screen;
      @import 'fixtures/test.css' screen;
      @import './fixtures/test.css' screen;
      @import './fixtures/test' screen;

      @import 'fixtures/test' supports(display: grid);
      @import 'fixtures/test.css' supports(display: grid);
      @import './fixtures/test.css' supports(display: grid);
      @import './fixtures/test' supports(display: grid);

      @import 'fixtures/test' layer(utilities);
      @import 'fixtures/test.css' layer(utilities);
      @import './fixtures/test.css' layer(utilities);
      @import './fixtures/test' layer(utilities);

      @import 'fixtures/test' theme(inline);
      @import 'fixtures/test.css' theme(inline);
      @import './fixtures/test.css' theme(inline);
      @import './fixtures/test' theme(inline);

      @import 'fixtures/test' layer(utilities) supports(display: grid) screen and (min-width: 600px);
      @import 'fixtures/test.css' layer(utilities) supports(display: grid) screen and
        (min-width: 600px);
      @import './fixtures/test.css' layer(utilities) supports(display: grid) screen and
        (min-width: 600px);
      @import './fixtures/test' layer(utilities) supports(display: grid) screen and
        (min-width: 600px);

      @import 'tailwindcss';
      @import 'tailwindcss/theme.css';
      @import 'tailwindcss/theme';
    `),
  ).toMatchInlineSnapshot(`
    "@import url('https://example.com');

    @import './fixtures/test.css';
    @import './fixtures/test.css';
    @import './fixtures/test.css';
    @import './fixtures/test.css';

    @import './fixtures/test.css' screen;
    @import './fixtures/test.css' screen;
    @import './fixtures/test.css' screen;
    @import './fixtures/test.css' screen;

    @import './fixtures/test.css' supports(display: grid);
    @import './fixtures/test.css' supports(display: grid);
    @import './fixtures/test.css' supports(display: grid);
    @import './fixtures/test.css' supports(display: grid);

    @import './fixtures/test.css' layer(utilities);
    @import './fixtures/test.css' layer(utilities);
    @import './fixtures/test.css' layer(utilities);
    @import './fixtures/test.css' layer(utilities);

    @import './fixtures/test.css' theme(inline);
    @import './fixtures/test.css' theme(inline);
    @import './fixtures/test.css' theme(inline);
    @import './fixtures/test.css' theme(inline);

    @import './fixtures/test.css' layer(utilities) supports(display: grid) screen and (min-width: 600px);
    @import './fixtures/test.css' layer(utilities) supports(display: grid) screen and
      (min-width: 600px);
    @import './fixtures/test.css' layer(utilities) supports(display: grid) screen and
      (min-width: 600px);
    @import './fixtures/test.css' layer(utilities) supports(display: grid) screen and
      (min-width: 600px);

    @import 'tailwindcss';
    @import 'tailwindcss/theme.css';
    @import 'tailwindcss/theme';"
  `)
})
