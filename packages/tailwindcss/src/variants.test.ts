import dedent from 'dedent'
import { expect, test } from 'vitest'
import createPlugin from './plugin'
import { compileCss, run } from './test-utils/run'
import { Compounds, compoundsForSelectors } from './variants'

const css = String.raw

test('*', async () => {
  expect(await run(['*:flex'])).toMatchInlineSnapshot(`
    ":is(.\\*\\:flex > *) {
      display: flex;
    }"
  `)
  expect(await run(['*/foo:flex'])).toEqual('')
})

test('**', async () => {
  expect(await run(['**:flex'])).toMatchInlineSnapshot(`
    ":is(.\\*\\*\\:flex *) {
      display: flex;
    }"
  `)
  expect(await run(['**/foo:flex'])).toEqual('')
})

test('first-letter', async () => {
  expect(await run(['first-letter:flex'])).toMatchInlineSnapshot(`
    ".first-letter\\:flex:first-letter {
      display: flex;
    }"
  `)
  expect(await run(['first-letter/foo:flex'])).toEqual('')
})

test('first-line', async () => {
  expect(await run(['first-line:flex'])).toMatchInlineSnapshot(`
    ".first-line\\:flex:first-line {
      display: flex;
    }"
  `)
  expect(await run(['first-line/foo:flex'])).toEqual('')
})

test('marker', async () => {
  expect(await run(['marker:flex'])).toMatchInlineSnapshot(`
    ".marker\\:flex ::marker {
      display: flex;
    }

    .marker\\:flex::marker {
      display: flex;
    }

    .marker\\:flex ::-webkit-details-marker {
      display: flex;
    }

    .marker\\:flex::-webkit-details-marker {
      display: flex;
    }"
  `)
  expect(await run(['marker/foo:flex'])).toEqual('')
})

test('selection', async () => {
  expect(await run(['selection:flex'])).toMatchInlineSnapshot(`
    ".selection\\:flex ::selection {
      display: flex;
    }

    .selection\\:flex::selection {
      display: flex;
    }"
  `)
  expect(await run(['selection/foo:flex'])).toEqual('')
})

test('file', async () => {
  expect(await run(['file:flex'])).toMatchInlineSnapshot(`
    ".file\\:flex::file-selector-button {
      display: flex;
    }"
  `)
  expect(await run(['file/foo:flex'])).toEqual('')
})

test('placeholder', async () => {
  expect(await run(['placeholder:flex'])).toMatchInlineSnapshot(`
    ".placeholder\\:flex::placeholder {
      display: flex;
    }"
  `)
  expect(await run(['placeholder/foo:flex'])).toEqual('')
})

test('backdrop', async () => {
  expect(await run(['backdrop:flex'])).toMatchInlineSnapshot(`
    ".backdrop\\:flex::backdrop {
      display: flex;
    }"
  `)
  expect(await run(['backdrop/foo:flex'])).toEqual('')
})

test('details-content', async () => {
  expect(await run(['details-content:flex'])).toMatchInlineSnapshot(`
    ".details-content\\:flex::details-content {
      display: flex;
    }"
  `)
  expect(await run(['details-content/foo:flex'])).toEqual('')
})

test('before', async () => {
  expect(await run(['before:flex'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-content: "";
        }
      }
    }

    .before\\:flex:before {
      content: var(--tw-content);
      display: flex;
    }

    @property --tw-content {
      syntax: "*";
      inherits: false;
      initial-value: "";
    }"
  `)
  expect(await run(['before/foo:flex'])).toEqual('')
})

test('after', async () => {
  expect(await run(['after:flex'])).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-content: "";
        }
      }
    }

    .after\\:flex:after {
      content: var(--tw-content);
      display: flex;
    }

    @property --tw-content {
      syntax: "*";
      inherits: false;
      initial-value: "";
    }"
  `)
  expect(await run(['after/foo:flex'])).toEqual('')
})

test('first', async () => {
  expect(await run(['first:flex', 'group-first:flex', 'peer-first:flex'])).toMatchInlineSnapshot(`
    ".group-first\\:flex:is(:where(.group):first-child *), .peer-first\\:flex:is(:where(.peer):first-child ~ *), .first\\:flex:first-child {
      display: flex;
    }"
  `)
  expect(await run(['first/foo:flex'])).toEqual('')
})

test('last', async () => {
  expect(await run(['last:flex', 'group-last:flex', 'peer-last:flex'])).toMatchInlineSnapshot(`
    ".group-last\\:flex:is(:where(.group):last-child *), .peer-last\\:flex:is(:where(.peer):last-child ~ *), .last\\:flex:last-child {
      display: flex;
    }"
  `)
  expect(await run(['last/foo:flex'])).toEqual('')
})

test('only', async () => {
  expect(await run(['only:flex', 'group-only:flex', 'peer-only:flex'])).toMatchInlineSnapshot(`
    ".group-only\\:flex:is(:where(.group):only-child *), .peer-only\\:flex:is(:where(.peer):only-child ~ *), .only\\:flex:only-child {
      display: flex;
    }"
  `)
  expect(await run(['only/foo:flex'])).toEqual('')
})

test('odd', async () => {
  expect(await run(['odd:flex', 'group-odd:flex', 'peer-odd:flex'])).toMatchInlineSnapshot(`
    ".group-odd\\:flex:is(:where(.group):nth-child(odd) *), .peer-odd\\:flex:is(:where(.peer):nth-child(odd) ~ *), .odd\\:flex:nth-child(odd) {
      display: flex;
    }"
  `)
  expect(await run(['odd/foo:flex'])).toEqual('')
})

test('even', async () => {
  expect(await run(['even:flex', 'group-even:flex', 'peer-even:flex'])).toMatchInlineSnapshot(`
    ".group-even\\:flex:is(:where(.group):nth-child(2n) *), .peer-even\\:flex:is(:where(.peer):nth-child(2n) ~ *), .even\\:flex:nth-child(2n) {
      display: flex;
    }"
  `)
  expect(await run(['even/foo:flex'])).toEqual('')
})

test('first-of-type', async () => {
  expect(await run(['first-of-type:flex', 'group-first-of-type:flex', 'peer-first-of-type:flex']))
    .toMatchInlineSnapshot(`
      ".group-first-of-type\\:flex:is(:where(.group):first-of-type *), .peer-first-of-type\\:flex:is(:where(.peer):first-of-type ~ *), .first-of-type\\:flex:first-of-type {
        display: flex;
      }"
    `)
  expect(await run(['first-of-type/foo:flex'])).toEqual('')
})

test('last-of-type', async () => {
  expect(await run(['last-of-type:flex', 'group-last-of-type:flex', 'peer-last-of-type:flex']))
    .toMatchInlineSnapshot(`
      ".group-last-of-type\\:flex:is(:where(.group):last-of-type *), .peer-last-of-type\\:flex:is(:where(.peer):last-of-type ~ *), .last-of-type\\:flex:last-of-type {
        display: flex;
      }"
    `)
  expect(await run(['last-of-type/foo:flex'])).toEqual('')
})

test('only-of-type', async () => {
  expect(await run(['only-of-type:flex', 'group-only-of-type:flex', 'peer-only-of-type:flex']))
    .toMatchInlineSnapshot(`
      ".group-only-of-type\\:flex:is(:where(.group):only-of-type *), .peer-only-of-type\\:flex:is(:where(.peer):only-of-type ~ *), .only-of-type\\:flex:only-of-type {
        display: flex;
      }"
    `)
  expect(await run(['only-of-type/foo:flex'])).toEqual('')
})

test('visited', async () => {
  expect(await run(['visited:flex', 'group-visited:flex', 'peer-visited:flex']))
    .toMatchInlineSnapshot(`
      ".group-visited\\:flex:is(:where(.group):visited *), .peer-visited\\:flex:is(:where(.peer):visited ~ *), .visited\\:flex:visited {
        display: flex;
      }"
    `)
  expect(await run(['visited/foo:flex'])).toEqual('')
})

test('target', async () => {
  expect(await run(['target:flex', 'group-target:flex', 'peer-target:flex']))
    .toMatchInlineSnapshot(`
      ".group-target\\:flex:is(:where(.group):target *), .peer-target\\:flex:is(:where(.peer):target ~ *), .target\\:flex:target {
        display: flex;
      }"
    `)
  expect(await run(['target/foo:flex'])).toEqual('')
})

test('open', async () => {
  expect(await run(['open:flex', 'group-open:flex', 'peer-open:flex', 'not-open:flex']))
    .toMatchInlineSnapshot(`
      ".not-open\\:flex:not(:is([open], :popover-open, :open)), .group-open\\:flex:is(:where(.group):is([open], :popover-open, :open) *), .peer-open\\:flex:is(:where(.peer):is([open], :popover-open, :open) ~ *), .open\\:flex:is([open], :popover-open, :open) {
        display: flex;
      }"
    `)
  expect(await run(['open/foo:flex'])).toEqual('')
})

test('default', async () => {
  expect(await run(['default:flex', 'group-default:flex', 'peer-default:flex']))
    .toMatchInlineSnapshot(`
      ".group-default\\:flex:is(:where(.group):default *), .peer-default\\:flex:is(:where(.peer):default ~ *), .default\\:flex:default {
        display: flex;
      }"
    `)
  expect(await run(['default/foo:flex'])).toEqual('')
})

test('checked', async () => {
  expect(await run(['checked:flex', 'group-checked:flex', 'peer-checked:flex']))
    .toMatchInlineSnapshot(`
      ".group-checked\\:flex:is(:where(.group):checked *), .peer-checked\\:flex:is(:where(.peer):checked ~ *), .checked\\:flex:checked {
        display: flex;
      }"
    `)
  expect(await run(['checked/foo:flex'])).toEqual('')
})

test('indeterminate', async () => {
  expect(await run(['indeterminate:flex', 'group-indeterminate:flex', 'peer-indeterminate:flex']))
    .toMatchInlineSnapshot(`
      ".group-indeterminate\\:flex:is(:where(.group):indeterminate *), .peer-indeterminate\\:flex:is(:where(.peer):indeterminate ~ *), .indeterminate\\:flex:indeterminate {
        display: flex;
      }"
    `)
  expect(await run(['indeterminate/foo:flex'])).toEqual('')
})

test('placeholder-shown', async () => {
  expect(
    await run([
      'placeholder-shown:flex',
      'group-placeholder-shown:flex',
      'peer-placeholder-shown:flex',
    ]),
  ).toMatchInlineSnapshot(`
    ".group-placeholder-shown\\:flex:is(:where(.group):placeholder-shown *), .peer-placeholder-shown\\:flex:is(:where(.peer):placeholder-shown ~ *), .placeholder-shown\\:flex:placeholder-shown {
      display: flex;
    }"
  `)
  expect(await run(['placeholder-shown/foo:flex'])).toEqual('')
})

test('autofill', async () => {
  expect(await run(['autofill:flex', 'group-autofill:flex', 'peer-autofill:flex']))
    .toMatchInlineSnapshot(`
      ".group-autofill\\:flex:is(:where(.group):autofill *), .peer-autofill\\:flex:is(:where(.peer):autofill ~ *), .autofill\\:flex:autofill {
        display: flex;
      }"
    `)
  expect(await run(['autofill/foo:flex'])).toEqual('')
})

test('optional', async () => {
  expect(await run(['optional:flex', 'group-optional:flex', 'peer-optional:flex']))
    .toMatchInlineSnapshot(`
      ".group-optional\\:flex:is(:where(.group):optional *), .peer-optional\\:flex:is(:where(.peer):optional ~ *), .optional\\:flex:optional {
        display: flex;
      }"
    `)
  expect(await run(['optional/foo:flex'])).toEqual('')
})

test('required', async () => {
  expect(await run(['required:flex', 'group-required:flex', 'peer-required:flex']))
    .toMatchInlineSnapshot(`
      ".group-required\\:flex:is(:where(.group):required *), .peer-required\\:flex:is(:where(.peer):required ~ *), .required\\:flex:required {
        display: flex;
      }"
    `)
  expect(await run(['required/foo:flex'])).toEqual('')
})

test('valid', async () => {
  expect(await run(['valid:flex', 'group-valid:flex', 'peer-valid:flex'])).toMatchInlineSnapshot(`
    ".group-valid\\:flex:is(:where(.group):valid *), .peer-valid\\:flex:is(:where(.peer):valid ~ *), .valid\\:flex:valid {
      display: flex;
    }"
  `)
  expect(await run(['valid/foo:flex'])).toEqual('')
})

test('invalid', async () => {
  expect(await run(['invalid:flex', 'group-invalid:flex', 'peer-invalid:flex']))
    .toMatchInlineSnapshot(`
      ".group-invalid\\:flex:is(:where(.group):invalid *), .peer-invalid\\:flex:is(:where(.peer):invalid ~ *), .invalid\\:flex:invalid {
        display: flex;
      }"
    `)
  expect(await run(['invalid/foo:flex'])).toEqual('')
})

test('user-valid', async () => {
  expect(await run(['user-valid:flex', 'group-user-valid:flex', 'peer-user-valid:flex']))
    .toMatchInlineSnapshot(`
      ".group-user-valid\\:flex:is(:where(.group):user-valid *), .peer-user-valid\\:flex:is(:where(.peer):user-valid ~ *) {
        display: flex;
      }

      .user-valid\\:flex:user-valid {
        display: flex;
      }"
    `)
  expect(await run(['user-valid/foo:flex'])).toEqual('')
})

test('user-invalid', async () => {
  expect(await run(['user-invalid:flex', 'group-user-invalid:flex', 'peer-user-invalid:flex']))
    .toMatchInlineSnapshot(`
      ".group-user-invalid\\:flex:is(:where(.group):user-invalid *), .peer-user-invalid\\:flex:is(:where(.peer):user-invalid ~ *) {
        display: flex;
      }

      .user-invalid\\:flex:user-invalid {
        display: flex;
      }"
    `)
  expect(await run(['invalid/foo:flex'])).toEqual('')
})

test('in-range', async () => {
  expect(await run(['in-range:flex', 'group-in-range:flex', 'peer-in-range:flex']))
    .toMatchInlineSnapshot(`
      ".group-in-range\\:flex:is(:where(.group):in-range *), .peer-in-range\\:flex:is(:where(.peer):in-range ~ *), .in-range\\:flex:in-range {
        display: flex;
      }"
    `)
  expect(await run(['in-range/foo:flex'])).toEqual('')
})

test('out-of-range', async () => {
  expect(await run(['out-of-range:flex', 'group-out-of-range:flex', 'peer-out-of-range:flex']))
    .toMatchInlineSnapshot(`
      ".group-out-of-range\\:flex:is(:where(.group):out-of-range *), .peer-out-of-range\\:flex:is(:where(.peer):out-of-range ~ *), .out-of-range\\:flex:out-of-range {
        display: flex;
      }"
    `)
  expect(await run(['out-of-range/foo:flex'])).toEqual('')
})

test('read-only', async () => {
  expect(await run(['read-only:flex', 'group-read-only:flex', 'peer-read-only:flex']))
    .toMatchInlineSnapshot(`
      ".group-read-only\\:flex:is(:where(.group):read-only *), .peer-read-only\\:flex:is(:where(.peer):read-only ~ *), .read-only\\:flex:read-only {
        display: flex;
      }"
    `)
  expect(await run(['read-only/foo:flex'])).toEqual('')
})

test('empty', async () => {
  expect(await run(['empty:flex', 'group-empty:flex', 'peer-empty:flex'])).toMatchInlineSnapshot(`
    ".group-empty\\:flex:is(:where(.group):empty *), .peer-empty\\:flex:is(:where(.peer):empty ~ *), .empty\\:flex:empty {
      display: flex;
    }"
  `)
  expect(await run(['empty/foo:flex'])).toEqual('')
})

test('focus-within', async () => {
  expect(await run(['focus-within:flex', 'group-focus-within:flex', 'peer-focus-within:flex']))
    .toMatchInlineSnapshot(`
      ".group-focus-within\\:flex:is(:where(.group):focus-within *), .peer-focus-within\\:flex:is(:where(.peer):focus-within ~ *), .focus-within\\:flex:focus-within {
        display: flex;
      }"
    `)
  expect(await run(['focus-within/foo:flex'])).toEqual('')
})

test('hover', async () => {
  expect(await run(['hover:flex', 'group-hover:flex', 'peer-hover:flex'])).toMatchInlineSnapshot(`
    "@media (hover: hover) {
      .group-hover\\:flex:is(:where(.group):hover *), .peer-hover\\:flex:is(:where(.peer):hover ~ *), .hover\\:flex:hover {
        display: flex;
      }
    }"
  `)
  expect(await run(['hover/foo:flex'])).toEqual('')
})

test('focus', async () => {
  expect(await run(['focus:flex', 'group-focus:flex', 'peer-focus:flex'])).toMatchInlineSnapshot(`
    ".group-focus\\:flex:is(:where(.group):focus *), .peer-focus\\:flex:is(:where(.peer):focus ~ *), .focus\\:flex:focus {
      display: flex;
    }"
  `)
  expect(await run(['focus/foo:flex'])).toEqual('')
})

test('group-hover group-focus sorting', async () => {
  expect(await run(['group-hover:flex', 'group-focus:flex'])).toMatchInlineSnapshot(`
    "@media (hover: hover) {
      .group-hover\\:flex:is(:where(.group):hover *) {
        display: flex;
      }
    }

    .group-focus\\:flex:is(:where(.group):focus *) {
      display: flex;
    }"
  `)
  expect(await run(['group-focus:flex', 'group-hover:flex'])).toMatchInlineSnapshot(`
    "@media (hover: hover) {
      .group-hover\\:flex:is(:where(.group):hover *) {
        display: flex;
      }
    }

    .group-focus\\:flex:is(:where(.group):focus *) {
      display: flex;
    }"
  `)
})

test('focus-visible', async () => {
  expect(await run(['focus-visible:flex', 'group-focus-visible:flex', 'peer-focus-visible:flex']))
    .toMatchInlineSnapshot(`
      ".group-focus-visible\\:flex:is(:where(.group):focus-visible *), .peer-focus-visible\\:flex:is(:where(.peer):focus-visible ~ *), .focus-visible\\:flex:focus-visible {
        display: flex;
      }"
    `)
  expect(await run(['focus-visible/foo:flex'])).toEqual('')
})

test('active', async () => {
  expect(await run(['active:flex', 'group-active:flex', 'peer-active:flex']))
    .toMatchInlineSnapshot(`
      ".group-active\\:flex:is(:where(.group):active *), .peer-active\\:flex:is(:where(.peer):active ~ *), .active\\:flex:active {
        display: flex;
      }"
    `)
  expect(await run(['active/foo:flex'])).toEqual('')
})

test('enabled', async () => {
  expect(await run(['enabled:flex', 'group-enabled:flex', 'peer-enabled:flex']))
    .toMatchInlineSnapshot(`
      ".group-enabled\\:flex:is(:where(.group):enabled *), .peer-enabled\\:flex:is(:where(.peer):enabled ~ *), .enabled\\:flex:enabled {
        display: flex;
      }"
    `)
  expect(await run(['enabled/foo:flex'])).toEqual('')
})

test('disabled', async () => {
  expect(await run(['disabled:flex', 'group-disabled:flex', 'peer-disabled:flex']))
    .toMatchInlineSnapshot(`
      ".group-disabled\\:flex:is(:where(.group):disabled *), .peer-disabled\\:flex:is(:where(.peer):disabled ~ *), .disabled\\:flex:disabled {
        display: flex;
      }"
    `)
  expect(await run(['disabled/foo:flex'])).toEqual('')
})

test('inert', async () => {
  expect(await run(['inert:flex', 'group-inert:flex', 'peer-inert:flex'])).toMatchInlineSnapshot(`
    ".group-inert\\:flex:is(:where(.group):is([inert], [inert] *) *), .peer-inert\\:flex:is(:where(.peer):is([inert], [inert] *) ~ *), .inert\\:flex:is([inert], [inert] *) {
      display: flex;
    }"
  `)
  expect(await run(['inert/foo:flex'])).toEqual('')
})

test('group-[...]', async () => {
  expect(
    await run([
      'group-[&_p]:flex',
      'group-[&_p]:hover:flex',
      'hover:group-[&_p]:flex',
      'hover:group-[&_p]:hover:flex',
      'group-[&:hover]:group-[&_p]:flex',
    ]),
  ).toMatchInlineSnapshot(`
    ".group-\\[\\&_p\\]\\:flex:is(:where(.group) p *), .group-\\[\\&\\:hover\\]\\:group-\\[\\&_p\\]\\:flex:is(:where(.group):hover *):is(:where(.group) p *) {
      display: flex;
    }

    @media (hover: hover) {
      .group-\\[\\&_p\\]\\:hover\\:flex:is(:where(.group) p *):hover, .hover\\:group-\\[\\&_p\\]\\:flex:hover:is(:where(.group) p *) {
        display: flex;
      }

      @media (hover: hover) {
        .hover\\:group-\\[\\&_p\\]\\:hover\\:flex:hover:is(:where(.group) p *):hover {
          display: flex;
        }
      }
    }"
  `)

  expect(
    await compileCss(
      css`
        @tailwind utilities;
      `,
      ['group-[]:flex', 'group-hover/[]:flex', 'group-[@media_foo]:flex', 'group-[>img]:flex'],
    ),
  ).toEqual('')
})

test('group-*', async () => {
  expect(
    await compileCss(
      css`
        @custom-variant hocus {
          &:hover,
          &:focus {
            @slot;
          }
        }
        @tailwind utilities;
      `,
      [
        'group-hover:flex',
        'group-focus:flex',
        'group-hocus:flex',

        'group-hover:group-focus:flex',
        'group-focus:group-hover:flex',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@media (hover: hover) {
      .group-hover\\:flex:is(:where(.group):hover *) {
        display: flex;
      }
    }

    .group-focus\\:flex:is(:where(.group):focus *) {
      display: flex;
    }

    @media (hover: hover) {
      .group-focus\\:group-hover\\:flex:is(:where(.group):focus *):is(:where(.group):hover *), .group-hover\\:group-focus\\:flex:is(:where(.group):hover *):is(:where(.group):focus *) {
        display: flex;
      }
    }

    .group-hocus\\:flex:is(:is(:where(.group):hover, :where(.group):focus) *) {
      display: flex;
    }"
  `)

  expect(
    await compileCss(
      css`
        @custom-variant custom-at-rule (@media foo);
        @custom-variant nested-selectors {
          &:hover {
            &:focus {
              @slot;
            }
          }
        }
        @tailwind utilities;
      `,
      ['group-custom-at-rule:flex', 'group-nested-selectors:flex'],
    ),
  ).toEqual('')
})

test('peer-[...]', async () => {
  expect(
    await run([
      'peer-[&_p]:flex',
      'peer-[&_p]:hover:flex',
      'hover:peer-[&_p]:flex',
      'hover:peer-[&_p]:focus:flex',
      'peer-[&:hover]:peer-[&_p]:flex',
    ]),
  ).toMatchInlineSnapshot(`
    ".peer-\\[\\&_p\\]\\:flex:is(:where(.peer) p ~ *), .peer-\\[\\&\\:hover\\]\\:peer-\\[\\&_p\\]\\:flex:is(:where(.peer):hover ~ *):is(:where(.peer) p ~ *) {
      display: flex;
    }

    @media (hover: hover) {
      .hover\\:peer-\\[\\&_p\\]\\:flex:hover:is(:where(.peer) p ~ *), .peer-\\[\\&_p\\]\\:hover\\:flex:is(:where(.peer) p ~ *):hover, .hover\\:peer-\\[\\&_p\\]\\:focus\\:flex:hover:is(:where(.peer) p ~ *):focus {
        display: flex;
      }
    }"
  `)

  expect(
    await compileCss(
      css`
        @tailwind utilities;
      `,
      ['peer-[]:flex', 'peer-hover/[]:flex', 'peer-[@media_foo]:flex', 'peer-[>img]:flex'],
    ),
  ).toEqual('')
})

test('peer-*', async () => {
  expect(
    await compileCss(
      css`
        @custom-variant hocus {
          &:hover,
          &:focus {
            @slot;
          }
        }
        @tailwind utilities;
      `,
      [
        'peer-hover:flex',
        'peer-focus:flex',
        'peer-hocus:flex',
        'peer-hover:peer-focus:flex',
        'peer-focus:peer-hover:flex',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@media (hover: hover) {
      .peer-hover\\:flex:is(:where(.peer):hover ~ *) {
        display: flex;
      }
    }

    .peer-focus\\:flex:is(:where(.peer):focus ~ *) {
      display: flex;
    }

    @media (hover: hover) {
      .peer-focus\\:peer-hover\\:flex:is(:where(.peer):focus ~ *):is(:where(.peer):hover ~ *), .peer-hover\\:peer-focus\\:flex:is(:where(.peer):hover ~ *):is(:where(.peer):focus ~ *) {
        display: flex;
      }
    }

    .peer-hocus\\:flex:is(:is(:where(.peer):hover, :where(.peer):focus) ~ *) {
      display: flex;
    }"
  `)

  expect(
    await compileCss(
      css`
        @custom-variant custom-at-rule (@media foo);
        @custom-variant nested-selectors {
          &:hover {
            &:focus {
              @slot;
            }
          }
        }
        @tailwind utilities;
      `,
      ['peer-custom-at-rule:flex', 'peer-nested-selectors:flex'],
    ),
  ).toEqual('')
})

test('ltr', async () => {
  expect(await run(['ltr:flex'])).toMatchInlineSnapshot(`
    ".ltr\\:flex:where(:dir(ltr), [dir="ltr"], [dir="ltr"] *) {
      display: flex;
    }"
  `)
  expect(await run(['ltr/foo:flex'])).toEqual('')
})

test('rtl', async () => {
  expect(await run(['rtl:flex'])).toMatchInlineSnapshot(`
    ".rtl\\:flex:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *) {
      display: flex;
    }"
  `)
  expect(await run(['rtl/foo:flex'])).toEqual('')
})

test('motion-safe', async () => {
  expect(await run(['motion-safe:flex'])).toMatchInlineSnapshot(`
    "@media (prefers-reduced-motion: no-preference) {
      .motion-safe\\:flex {
        display: flex;
      }
    }"
  `)
  expect(await run(['motion-safe/foo:flex'])).toEqual('')
})

test('motion-reduce', async () => {
  expect(await run(['motion-reduce:flex'])).toMatchInlineSnapshot(`
    "@media (prefers-reduced-motion: reduce) {
      .motion-reduce\\:flex {
        display: flex;
      }
    }"
  `)
  expect(await run(['motion-reduce/foo:flex'])).toEqual('')
})

test('dark', async () => {
  expect(await run(['dark:flex'])).toMatchInlineSnapshot(`
    "@media (prefers-color-scheme: dark) {
      .dark\\:flex {
        display: flex;
      }
    }"
  `)
  expect(await run(['dark/foo:flex'])).toEqual('')
})

test('starting', async () => {
  expect(await run(['starting:opacity-0'])).toMatchInlineSnapshot(`
    "@starting-style {
      .starting\\:opacity-0 {
        opacity: 0;
      }
    }"
  `)
  expect(await run(['starting/foo:flex'])).toEqual('')
})

test('print', async () => {
  expect(await run(['print:flex'])).toMatchInlineSnapshot(`
    "@media print {
      .print\\:flex {
        display: flex;
      }
    }"
  `)
  expect(await run(['print/foo:flex'])).toEqual('')
})

test('default breakpoints', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          /* Breakpoints */
          --breakpoint-sm: 640px;
          --breakpoint-md: 768px;
          --breakpoint-lg: 1024px;
          --breakpoint-xl: 1280px;
          --breakpoint-2xl: 1536px;
        }
        @tailwind utilities;
      `,
      ['sm:flex', 'md:flex', 'lg:flex', 'xl:flex', '2xl:flex'],
    ),
  ).toMatchInlineSnapshot(`
    "@media (min-width: 640px) {
      .sm\\:flex {
        display: flex;
      }
    }

    @media (min-width: 768px) {
      .md\\:flex {
        display: flex;
      }
    }

    @media (min-width: 1024px) {
      .lg\\:flex {
        display: flex;
      }
    }

    @media (min-width: 1280px) {
      .xl\\:flex {
        display: flex;
      }
    }

    @media (min-width: 1536px) {
      .\\32 xl\\:flex {
        display: flex;
      }
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          /* Breakpoints */
          --breakpoint-sm: 640px;
          --breakpoint-md: 768px;
          --breakpoint-lg: 1024px;
          --breakpoint-xl: 1280px;
          --breakpoint-2xl: 1536px;
        }
        @tailwind utilities;
      `,
      ['sm/foo:flex', 'md/foo:flex', 'lg/foo:flex', 'xl/foo:flex', '2xl/foo:flex'],
    ),
  ).toEqual('')
})

test('custom breakpoint', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --breakpoint-10xl: 5000px;
        }
        @tailwind utilities;
      `,
      ['10xl:flex'],
    ),
  ).toMatchInlineSnapshot(`
    "@media (min-width: 5000px) {
      .\\31 0xl\\:flex {
        display: flex;
      }
    }"
  `)
})

test('max-*', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          /* Explicitly ordered in a strange way */
          --breakpoint-sm: 640px;
          --breakpoint-lg: 1024px;
          --breakpoint-md: 768px;
        }
        @tailwind utilities;
      `,
      ['max-lg:flex', 'max-sm:flex', 'max-md:flex'],
    ),
  ).toMatchInlineSnapshot(`
    "@media not all and (min-width: 1024px) {
      .max-lg\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 768px) {
      .max-md\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 640px) {
      .max-sm\\:flex {
        display: flex;
      }
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          /* Explicitly ordered in a strange way */
          --breakpoint-sm: 640px;
          --breakpoint-lg: 1024px;
          --breakpoint-md: 768px;
        }
        @tailwind utilities;
      `,
      ['max-lg/foo:flex', 'max-sm/foo:flex', 'max-md/foo:flex'],
    ),
  ).toEqual('')
})

test('min-*', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          /* Explicitly ordered in a strange way */
          --breakpoint-sm: 640px;
          --breakpoint-lg: 1024px;
          --breakpoint-md: 768px;
        }
        @tailwind utilities;
      `,
      ['min-lg:flex', 'min-sm:flex', 'min-md:flex'],
    ),
  ).toMatchInlineSnapshot(`
    "@media (min-width: 640px) {
      .min-sm\\:flex {
        display: flex;
      }
    }

    @media (min-width: 768px) {
      .min-md\\:flex {
        display: flex;
      }
    }

    @media (min-width: 1024px) {
      .min-lg\\:flex {
        display: flex;
      }
    }"
  `)
  expect(
    await compileCss(
      css`
        @theme reference {
          /* Explicitly ordered in a strange way */
          --breakpoint-sm: 640px;
          --breakpoint-lg: 1024px;
          --breakpoint-md: 768px;
        }
        @tailwind utilities;
      `,
      ['min-lg/foo:flex', 'min-sm/foo:flex', 'min-md/foo:flex'],
    ),
  ).toEqual('')
})

test('sorting stacked min-* and max-* variants', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          /* Explicitly ordered in a strange way */
          --breakpoint-sm: 640px;
          --breakpoint-lg: 1024px;
          --breakpoint-md: 768px;
          --breakpoint-xl: 1280px;
          --breakpoint-xs: 280px;
        }
        @tailwind utilities;
      `,
      ['min-sm:max-lg:flex', 'min-sm:max-xl:flex', 'min-md:max-lg:flex', 'min-xs:max-sm:flex'],
    ),
  ).toMatchInlineSnapshot(`
    "@media (min-width: 280px) {
      @media not all and (min-width: 640px) {
        .min-xs\\:max-sm\\:flex {
          display: flex;
        }
      }
    }

    @media (min-width: 640px) {
      @media not all and (min-width: 1280px) {
        .min-sm\\:max-xl\\:flex {
          display: flex;
        }
      }

      @media not all and (min-width: 1024px) {
        .min-sm\\:max-lg\\:flex {
          display: flex;
        }
      }
    }

    @media (min-width: 768px) {
      @media not all and (min-width: 1024px) {
        .min-md\\:max-lg\\:flex {
          display: flex;
        }
      }
    }"
  `)
})

test('stacked min-* and max-* variants should come after unprefixed variants', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          /* Explicitly ordered in a strange way */
          --breakpoint-sm: 640px;
          --breakpoint-lg: 1024px;
          --breakpoint-md: 768px;
        }
        @tailwind utilities;
      `,
      ['sm:flex', 'min-sm:max-lg:flex', 'md:flex', 'min-md:max-lg:flex'],
    ),
  ).toMatchInlineSnapshot(`
    "@media (min-width: 640px) {
      .sm\\:flex {
        display: flex;
      }

      @media not all and (min-width: 1024px) {
        .min-sm\\:max-lg\\:flex {
          display: flex;
        }
      }
    }

    @media (min-width: 768px) {
      .md\\:flex {
        display: flex;
      }

      @media not all and (min-width: 1024px) {
        .min-md\\:max-lg\\:flex {
          display: flex;
        }
      }
    }"
  `)
})

test('min, max and unprefixed breakpoints', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          /* Explicitly ordered in a strange way */
          --breakpoint-sm: 640px;
          --breakpoint-lg: 1024px;
          --breakpoint-md: 768px;
        }
        @tailwind utilities;
      `,
      [
        'max-lg-sm-potato:flex',
        'min-lg-sm-potato:flex',
        'lg-sm-potato:flex',
        'max-lg:flex',
        'max-sm:flex',
        'min-lg:flex',
        'max-[1000px]:flex',
        'md:flex',
        'min-md:flex',
        'min-[700px]:flex',
        'max-md:flex',
        'min-sm:flex',
        'sm:flex',
        'lg:flex',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@media not all and (min-width: 1024px) {
      .max-lg\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 1000px) {
      .max-\\[1000px\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 768px) {
      .max-md\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 640px) {
      .max-sm\\:flex {
        display: flex;
      }
    }

    @media (min-width: 640px) {
      .min-sm\\:flex, .sm\\:flex {
        display: flex;
      }
    }

    @media (min-width: 700px) {
      .min-\\[700px\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: 768px) {
      .md\\:flex, .min-md\\:flex {
        display: flex;
      }
    }

    @media (min-width: 1024px) {
      .lg\\:flex, .min-lg\\:flex {
        display: flex;
      }
    }"
  `)
})

test('sorting `min` and `max` should sort by unit, then by value, then alphabetically', async () => {
  expect(
    await run([
      'min-[10px]:flex',
      'min-[12px]:flex',
      'min-[10em]:flex',
      'min-[12em]:flex',
      'min-[10rem]:flex',
      'min-[12rem]:flex',
      'max-[10px]:flex',
      'max-[12px]:flex',
      'max-[10em]:flex',
      'max-[12em]:flex',
      'max-[10rem]:flex',
      'max-[12rem]:flex',
      'min-[calc(1000px+12em)]:flex',
      'max-[calc(1000px+12em)]:flex',
      'min-[calc(50vh+12em)]:flex',
      'max-[calc(50vh+12em)]:flex',
      'min-[10vh]:flex',
      'min-[12vh]:flex',
      'max-[10vh]:flex',
      'max-[12vh]:flex',
    ]),
  ).toMatchInlineSnapshot(`
    "@media not all and (min-width: calc(1000px + 12em)) {
      .max-\\[calc\\(1000px\\+12em\\)\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: calc(50vh + 12em)) {
      .max-\\[calc\\(50vh\\+12em\\)\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 12em) {
      .max-\\[12em\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 10em) {
      .max-\\[10em\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 12px) {
      .max-\\[12px\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 10px) {
      .max-\\[10px\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 12rem) {
      .max-\\[12rem\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 10rem) {
      .max-\\[10rem\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 12vh) {
      .max-\\[12vh\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 10vh) {
      .max-\\[10vh\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: calc(1000px + 12em)) {
      .min-\\[calc\\(1000px\\+12em\\)\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: calc(50vh + 12em)) {
      .min-\\[calc\\(50vh\\+12em\\)\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: 10em) {
      .min-\\[10em\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: 12em) {
      .min-\\[12em\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: 10px) {
      .min-\\[10px\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: 12px) {
      .min-\\[12px\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: 10rem) {
      .min-\\[10rem\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: 12rem) {
      .min-\\[12rem\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: 10vh) {
      .min-\\[10vh\\]\\:flex {
        display: flex;
      }
    }

    @media (min-width: 12vh) {
      .min-\\[12vh\\]\\:flex {
        display: flex;
      }
    }"
  `)
})

test('supports', async () => {
  expect(
    await run([
      'supports-gap:grid',
      'supports-[display:grid]:flex',
      'supports-[selector(A_>_B)]:flex',
      'supports-[font-format(opentype)]:grid',
      'supports-[(display:grid)_and_font-format(opentype)]:grid',
      'supports-[font-tech(color-COLRv1)]:flex',
      'supports-[var(--test)]:flex',
      'supports-[--test]:flex',
    ]),
  ).toMatchInlineSnapshot(`
    "@supports (gap: var(--tw)) {
      .supports-gap\\:grid {
        display: grid;
      }
    }

    @supports (display: grid) and font-format(opentype) {
      .supports-\\[\\(display\\:grid\\)_and_font-format\\(opentype\\)\\]\\:grid {
        display: grid;
      }
    }

    @supports (--test: var(--tw)) {
      .supports-\\[--test\\]\\:flex {
        display: flex;
      }
    }

    @supports (display: grid) {
      .supports-\\[display\\:grid\\]\\:flex {
        display: flex;
      }
    }

    @supports font-format(opentype) {
      .supports-\\[font-format\\(opentype\\)\\]\\:grid {
        display: grid;
      }
    }

    @supports font-tech(color-COLRv1) {
      .supports-\\[font-tech\\(color-COLRv1\\)\\]\\:flex {
        display: flex;
      }
    }

    @supports selector(A > B) {
      .supports-\\[selector\\(A_\\>_B\\)\\]\\:flex {
        display: flex;
      }
    }

    @supports var(--test) {
      .supports-\\[var\\(--test\\)\\]\\:flex {
        display: flex;
      }
    }"
  `)
  expect(
    await run([
      'supports-gap/foo:grid',
      'supports-[display:grid]/foo:flex',
      'supports-[selector(A_>_B)]/foo:flex',
      'supports-[font-format(opentype)]/foo:grid',
      'supports-[(display:grid)_and_font-format(opentype)]/foo:grid',
      'supports-[font-tech(color-COLRv1)]/foo:flex',
      'supports-[var(--test)]/foo:flex',
    ]),
  ).toEqual('')
})

test('not', async () => {
  expect(
    await compileCss(
      css`
        @custom-variant hocus {
          &:hover,
          &:focus {
            @slot;
          }
        }

        @custom-variant device-hocus {
          @media (hover: hover) {
            &:hover,
            &:focus {
              @slot;
            }
          }
        }

        @theme {
          --breakpoint-sm: 640px;
        }

        @tailwind utilities;
      `,
      [
        'not-[:checked]:flex',
        'not-[@media_print]:flex',
        'not-[@media(orientation:portrait)]:flex',
        'not-[@media_(orientation:landscape)]:flex',
        'not-[@media_not_(orientation:portrait)]:flex',
        'not-hocus:flex',
        'not-device-hocus:flex',

        'group-not-[:checked]:flex',
        'group-not-[:checked]/parent-name:flex',
        'group-not-checked:flex',
        'group-not-hocus:flex',
        // 'group-not-hover:flex',
        // 'group-not-device-hocus:flex',
        'group-not-hocus/parent-name:flex',

        'peer-not-[:checked]:flex',
        'peer-not-[:checked]/sibling-name:flex',
        'peer-not-checked:flex',
        'peer-not-hocus:flex',
        'peer-not-hocus/sibling-name:flex',

        // Not versions of built-in variants
        'not-first:flex',
        'not-last:flex',
        'not-only:flex',
        'not-odd:flex',
        'not-even:flex',
        'not-first-of-type:flex',
        'not-last-of-type:flex',
        'not-only-of-type:flex',
        'not-visited:flex',
        'not-target:flex',
        'not-open:flex',
        'not-default:flex',
        'not-checked:flex',
        'not-indeterminate:flex',
        'not-placeholder-shown:flex',
        'not-autofill:flex',
        'not-optional:flex',
        'not-required:flex',
        'not-valid:flex',
        'not-invalid:flex',
        'not-in-range:flex',
        'not-out-of-range:flex',
        'not-read-only:flex',
        'not-empty:flex',
        'not-focus-within:flex',
        'not-hover:flex',
        'not-focus:flex',
        'not-focus-visible:flex',
        'not-active:flex',
        'not-enabled:flex',
        'not-disabled:flex',
        'not-inert:flex',

        'not-ltr:flex',
        'not-rtl:flex',
        'not-motion-safe:flex',
        'not-motion-reduce:flex',
        'not-dark:flex',
        'not-print:flex',
        'not-supports-grid:flex',
        'not-has-checked:flex',
        'not-aria-selected:flex',
        'not-data-foo:flex',
        'not-portrait:flex',
        'not-landscape:flex',
        'not-contrast-more:flex',
        'not-contrast-less:flex',
        'not-forced-colors:flex',
        'not-nth-2:flex',
        'not-noscript:flex',

        'not-sm:flex',
        'not-min-sm:flex',
        'not-min-[130px]:flex',
        'not-max-sm:flex',
        'not-max-[130px]:flex',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ".not-first\\:flex:not(:first-child), .not-last\\:flex:not(:last-child), .not-only\\:flex:not(:only-child), .not-odd\\:flex:not(:nth-child(odd)), .not-even\\:flex:not(:nth-child(2n)), .not-first-of-type\\:flex:not(:first-of-type), .not-last-of-type\\:flex:not(:last-of-type), .not-only-of-type\\:flex:not(:only-of-type), .not-visited\\:flex:not(:visited), .not-target\\:flex:not(:target), .not-open\\:flex:not(:is([open], :popover-open, :open)), .not-default\\:flex:not(:default), .not-checked\\:flex:not(:checked), .not-indeterminate\\:flex:not(:indeterminate), .not-placeholder-shown\\:flex:not(:placeholder-shown), .not-autofill\\:flex:not(:autofill), .not-optional\\:flex:not(:optional), .not-required\\:flex:not(:required), .not-valid\\:flex:not(:valid), .not-invalid\\:flex:not(:invalid), .not-in-range\\:flex:not(:in-range), .not-out-of-range\\:flex:not(:out-of-range), .not-read-only\\:flex:not(:read-only), .not-empty\\:flex:not(:empty), .not-focus-within\\:flex:not(:focus-within), .not-hover\\:flex:not(:hover) {
      display: flex;
    }

    @media not all and (hover: hover) {
      .not-hover\\:flex {
        display: flex;
      }
    }

    .not-focus\\:flex:not(:focus), .not-focus-visible\\:flex:not(:focus-visible), .not-active\\:flex:not(:active), .not-enabled\\:flex:not(:enabled), .not-disabled\\:flex:not(:disabled), .not-inert\\:flex:not(:is([inert], [inert] *)), .not-has-checked\\:flex:not(:has(:checked)), .not-aria-selected\\:flex:not([aria-selected="true"]), .not-data-foo\\:flex:not([data-foo]), .not-nth-2\\:flex:not(:nth-child(2)) {
      display: flex;
    }

    @supports not (grid: var(--tw)) {
      .not-supports-grid\\:flex {
        display: flex;
      }
    }

    @media not all and (prefers-reduced-motion: no-preference) {
      .not-motion-safe\\:flex {
        display: flex;
      }
    }

    @media not all and (prefers-reduced-motion: reduce) {
      .not-motion-reduce\\:flex {
        display: flex;
      }
    }

    @media not all and (prefers-contrast: more) {
      .not-contrast-more\\:flex {
        display: flex;
      }
    }

    @media not all and (prefers-contrast: less) {
      .not-contrast-less\\:flex {
        display: flex;
      }
    }

    @media (min-width: 640px) {
      .not-max-sm\\:flex {
        display: flex;
      }
    }

    @media (min-width: 130px) {
      .not-max-\\[130px\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 130px) {
      .not-min-\\[130px\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (min-width: 640px) {
      .not-min-sm\\:flex, .not-sm\\:flex {
        display: flex;
      }
    }

    @media not all and (orientation: portrait) {
      .not-portrait\\:flex {
        display: flex;
      }
    }

    @media not all and (orientation: landscape) {
      .not-landscape\\:flex {
        display: flex;
      }
    }

    .not-ltr\\:flex:not(:where(:dir(ltr), [dir="ltr"], [dir="ltr"] *)), .not-rtl\\:flex:not(:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)) {
      display: flex;
    }

    @media not all and (prefers-color-scheme: dark) {
      .not-dark\\:flex {
        display: flex;
      }
    }

    @media not print {
      .not-print\\:flex {
        display: flex;
      }
    }

    @media not all and (forced-colors: active) {
      .not-forced-colors\\:flex {
        display: flex;
      }
    }

    @media not all and (scripting: none) {
      .not-noscript\\:flex {
        display: flex;
      }
    }

    .not-hocus\\:flex:not(:hover, :focus), .not-device-hocus\\:flex:not(:hover, :focus) {
      display: flex;
    }

    @media not all and (hover: hover) {
      .not-device-hocus\\:flex {
        display: flex;
      }
    }

    .not-\\[\\:checked\\]\\:flex:not(:checked) {
      display: flex;
    }

    @media not all and (orientation: landscape) {
      .not-\\[\\@media_\\(orientation\\:landscape\\)\\]\\:flex {
        display: flex;
      }
    }

    @media (orientation: portrait) {
      .not-\\[\\@media_not_\\(orientation\\:portrait\\)\\]\\:flex {
        display: flex;
      }
    }

    @media not print {
      .not-\\[\\@media_print\\]\\:flex {
        display: flex;
      }
    }

    @media not all and (orientation: portrait) {
      .not-\\[\\@media\\(orientation\\:portrait\\)\\]\\:flex {
        display: flex;
      }
    }

    .group-not-checked\\:flex:is(:where(.group):not(:checked) *), .group-not-hocus\\:flex:is(:where(.group):not(:hover, :focus) *), .group-not-hocus\\/parent-name\\:flex:is(:where(.group\\/parent-name):not(:hover, :focus) *), .group-not-\\[\\:checked\\]\\:flex:is(:where(.group):not(:checked) *), .group-not-\\[\\:checked\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name):not(:checked) *), .peer-not-checked\\:flex:is(:where(.peer):not(:checked) ~ *), .peer-not-hocus\\:flex:is(:where(.peer):not(:hover, :focus) ~ *), .peer-not-hocus\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name):not(:hover, :focus) ~ *), .peer-not-\\[\\:checked\\]\\:flex:is(:where(.peer):not(:checked) ~ *), .peer-not-\\[\\:checked\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name):not(:checked) ~ *) {
      display: flex;
    }"
  `)

  expect(
    await compileCss(
      css`
        @custom-variant nested-at-rules {
          @media foo {
            @media bar {
              @slot;
            }
          }
        }
        @custom-variant multiple-media-conditions {
          @media foo, bar {
            @slot;
          }
        }
        @custom-variant nested-style-rules {
          &:hover {
            &:focus {
              @slot;
            }
          }
        }
        @custom-variant parallel-style-rules {
          &:hover {
            @slot;
          }
          &:focus {
            @slot;
          }
        }
        @custom-variant parallel-at-rules {
          @media foo {
            @slot;
          }
          @media bar {
            @slot;
          }
        }
        @custom-variant parallel-mixed-rules {
          &:hover {
            @slot;
          }
          @media bar {
            @slot;
          }
        }
        @tailwind utilities;
      `,
      [
        'not-[>img]:flex',
        'not-[+img]:flex',
        'not-[~img]:flex',
        'not-[:checked]/foo:flex',
        'not-[@media_screen,print]:flex',
        'not-[@media_not_screen,print]:flex',
        'not-[@media_not_screen,not_print]:flex',

        'not-nested-at-rules:flex',
        'not-nested-style-rules:flex',
        'not-multiple-media-conditions:flex',
        'not-starting:flex',

        'not-parallel-style-rules:flex',
        'not-parallel-at-rules:flex',
        'not-parallel-mixed-rules:flex',

        // The following built-in variants don't have not-* versions because
        // there is no sensible negative version of them.

        // These just don't make sense as not-*
        'not-force:flex',
        'not-*:flex',

        // These contain pseudo-elements
        'not-first-letter:flex',
        'not-first-line:flex',
        'not-marker:flex',
        'not-selection:flex',
        'not-file:flex',
        'not-placeholder:flex',
        'not-backdrop:flex',
        'not-before:flex',
        'not-after:flex',

        // This is not a conditional at rule
        'not-starting:flex',
      ],
    ),
  ).toEqual('')
})

test('in', async () => {
  expect(
    await run([
      'in-[p]:flex',
      'in-[.group]:flex',
      'not-in-[p]:flex',
      'not-in-[.group]:flex',
      'in-data-visible:flex',
    ]),
  ).toMatchInlineSnapshot(`
    ".not-in-\\[\\.group\\]\\:flex:not(:where(.group) *), .not-in-\\[p\\]\\:flex:not(:where(:is(p)) *), :where([data-visible]) .in-data-visible\\:flex, :where(.group) .in-\\[\\.group\\]\\:flex, :where(:is(p)) .in-\\[p\\]\\:flex {
      display: flex;
    }"
  `)
  expect(await run(['in-p:flex', 'in-foo-bar:flex'])).toEqual('')
})

test('has', async () => {
  expect(
    await compileCss(
      css`
        @custom-variant hocus {
          &:hover,
          &:focus {
            @slot;
          }
        }
        @tailwind utilities;
      `,
      [
        'has-checked:flex',
        'has-[:checked]:flex',
        'has-[>img]:flex',
        'has-[+img]:flex',
        'has-[~img]:flex',
        'has-[&>img]:flex',
        'has-hocus:flex',

        'group-has-[:checked]:flex',
        'group-has-[:checked]/parent-name:flex',
        'group-has-checked:flex',
        'group-has-checked/parent-name:flex',
        'group-has-[>img]:flex',
        'group-has-[>img]/parent-name:flex',
        'group-has-[+img]:flex',
        'group-has-[~img]:flex',
        'group-has-[&>img]:flex',
        'group-has-[&>img]/parent-name:flex',
        'group-has-hocus:flex',
        'group-has-hocus/parent-name:flex',

        'peer-has-[:checked]:flex',
        'peer-has-[:checked]/sibling-name:flex',
        'peer-has-checked:flex',
        'peer-has-checked/sibling-name:flex',
        'peer-has-[>img]:flex',
        'peer-has-[>img]/sibling-name:flex',
        'peer-has-[+img]:flex',
        'peer-has-[~img]:flex',
        'peer-has-[&>img]:flex',
        'peer-has-[&>img]/sibling-name:flex',
        'peer-has-hocus:flex',
        'peer-has-hocus/sibling-name:flex',
      ],
    ),
  ).toMatchInlineSnapshot(`
    ".group-has-checked\\:flex:is(:where(.group):has(:checked) *), .group-has-checked\\/parent-name\\:flex:is(:where(.group\\/parent-name):has(:checked) *), .group-has-hocus\\:flex:is(:where(.group):has(:hover, :focus) *), .group-has-hocus\\/parent-name\\:flex:is(:where(.group\\/parent-name):has(:hover, :focus) *), .group-has-\\[\\:checked\\]\\:flex:is(:where(.group):has(:checked) *), .group-has-\\[\\:checked\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name):has(:checked) *), .group-has-\\[\\&\\>img\\]\\:flex:is(:where(.group):has(* > img) *), .group-has-\\[\\&\\>img\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name):has(* > img) *), .group-has-\\[\\+img\\]\\:flex:is(:where(.group):has( + img) *), .group-has-\\[\\>img\\]\\:flex:is(:where(.group):has( > img) *), .group-has-\\[\\>img\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name):has( > img) *), .group-has-\\[\\~img\\]\\:flex:is(:where(.group):has( ~ img) *), .peer-has-checked\\:flex:is(:where(.peer):has(:checked) ~ *), .peer-has-checked\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name):has(:checked) ~ *), .peer-has-hocus\\:flex:is(:where(.peer):has(:hover, :focus) ~ *), .peer-has-hocus\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name):has(:hover, :focus) ~ *), .peer-has-\\[\\:checked\\]\\:flex:is(:where(.peer):has(:checked) ~ *), .peer-has-\\[\\:checked\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name):has(:checked) ~ *), .peer-has-\\[\\&\\>img\\]\\:flex:is(:where(.peer):has(* > img) ~ *), .peer-has-\\[\\&\\>img\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name):has(* > img) ~ *), .peer-has-\\[\\+img\\]\\:flex:is(:where(.peer):has( + img) ~ *), .peer-has-\\[\\>img\\]\\:flex:is(:where(.peer):has( > img) ~ *), .peer-has-\\[\\>img\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name):has( > img) ~ *), .peer-has-\\[\\~img\\]\\:flex:is(:where(.peer):has( ~ img) ~ *), .has-checked\\:flex:has(:checked), .has-hocus\\:flex:has(:hover, :focus), .has-\\[\\:checked\\]\\:flex:has(:checked), .has-\\[\\&\\>img\\]\\:flex:has(* > img), .has-\\[\\+img\\]\\:flex:has( + img), .has-\\[\\>img\\]\\:flex:has( > img), .has-\\[\\~img\\]\\:flex:has( ~ img) {
      display: flex;
    }"
  `)

  expect(
    await compileCss(
      css`
        @custom-variant custom-at-rule (@media foo);
        @custom-variant nested-selectors {
          &:hover {
            &:focus {
              @slot;
            }
          }
        }
        @tailwind utilities;
      `,
      [
        'has-[:checked]/foo:flex',
        'has-[@media_print]:flex',
        'has-custom-at-rule:flex',
        'has-nested-selectors:flex',
      ],
    ),
  ).toEqual('')
})

test('aria', async () => {
  expect(
    await run([
      'aria-checked:flex',
      'aria-[invalid=spelling]:flex',
      'aria-[valuenow=1]:flex',
      'aria-[valuenow_=_"1"]:flex',

      'group-aria-[modal]:flex',
      'group-aria-checked:flex',
      'group-aria-[valuenow=1]:flex',
      'group-aria-[modal]/parent-name:flex',
      'group-aria-checked/parent-name:flex',
      'group-aria-[valuenow=1]/parent-name:flex',

      'peer-aria-[modal]:flex',
      'peer-aria-checked:flex',
      'peer-aria-[valuenow=1]:flex',
      'peer-aria-[modal]/sibling-name:flex',
      'peer-aria-checked/sibling-name:flex',
      'peer-aria-[valuenow=1]/sibling-name:flex',
    ]),
  ).toMatchInlineSnapshot(`
    ".group-aria-checked\\:flex:is(:where(.group)[aria-checked="true"] *), .group-aria-checked\\/parent-name\\:flex:is(:where(.group\\/parent-name)[aria-checked="true"] *), .group-aria-\\[modal\\]\\:flex:is(:where(.group)[aria-modal] *), .group-aria-\\[modal\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name)[aria-modal] *), .group-aria-\\[valuenow\\=1\\]\\:flex:is(:where(.group)[aria-valuenow="1"] *), .group-aria-\\[valuenow\\=1\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name)[aria-valuenow="1"] *), .peer-aria-checked\\:flex:is(:where(.peer)[aria-checked="true"] ~ *), .peer-aria-checked\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name)[aria-checked="true"] ~ *), .peer-aria-\\[modal\\]\\:flex:is(:where(.peer)[aria-modal] ~ *), .peer-aria-\\[modal\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name)[aria-modal] ~ *), .peer-aria-\\[valuenow\\=1\\]\\:flex:is(:where(.peer)[aria-valuenow="1"] ~ *), .peer-aria-\\[valuenow\\=1\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name)[aria-valuenow="1"] ~ *), .aria-checked\\:flex[aria-checked="true"], .aria-\\[invalid\\=spelling\\]\\:flex[aria-invalid="spelling"], .aria-\\[valuenow_\\=_\\"1\\"\\]\\:flex[aria-valuenow="1"], .aria-\\[valuenow\\=1\\]\\:flex[aria-valuenow="1"] {
      display: flex;
    }"
  `)
  expect(await run(['aria-checked/foo:flex', 'aria-[invalid=spelling]/foo:flex'])).toEqual('')
})

test('data', async () => {
  expect(
    await run([
      'data-disabled:flex',
      'data-[potato=salad]:flex',
      'data-[potato_=_"salad"]:flex',
      'data-[potato_^=_"salad"]:flex',
      'data-[potato="^_="]:flex',
      'data-[foo=1]:flex',
      'data-[foo=bar_baz]:flex',
      "data-[foo$='bar'_i]:flex",
      'data-[foo$=bar_baz_i]:flex',

      'group-data-[disabled]:flex',
      'group-data-[disabled]/parent-name:flex',
      'group-data-[foo=1]:flex',
      'group-data-[foo=1]/parent-name:flex',
      'group-data-[foo=bar baz]/parent-name:flex',
      "group-data-[foo$='bar'_i]/parent-name:flex",
      'group-data-[foo$=bar_baz_i]/parent-name:flex',

      'peer-data-[disabled]:flex',
      'peer-data-[disabled]/sibling-name:flex',
      'peer-data-[foo=1]:flex',
      'peer-data-[foo=1]/sibling-name:flex',
      'peer-data-[foo=bar baz]/sibling-name:flex',
      "peer-data-[foo$='bar'_i]/sibling-name:flex",
      'peer-data-[foo$=bar_baz_i]/sibling-name:flex',
    ]),
  ).toMatchInlineSnapshot(`
    ".group-data-\\[disabled\\]\\:flex:is(:where(.group)[data-disabled] *), .group-data-\\[disabled\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name)[data-disabled] *), .group-data-\\[foo\\$\\=\\'bar\\'_i\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name)[data-foo$="bar" i] *), .group-data-\\[foo\\$\\=bar_baz_i\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name)[data-foo$="bar baz" i] *), .group-data-\\[foo\\=1\\]\\:flex:is(:where(.group)[data-foo="1"] *), .group-data-\\[foo\\=1\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name)[data-foo="1"] *), .group-data-\\[foo\\=bar\\ baz\\]\\/parent-name\\:flex:is(:where(.group\\/parent-name)[data-foo="bar baz"] *), .peer-data-\\[disabled\\]\\:flex:is(:where(.peer)[data-disabled] ~ *), .peer-data-\\[disabled\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name)[data-disabled] ~ *), .peer-data-\\[foo\\$\\=\\'bar\\'_i\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name)[data-foo$="bar" i] ~ *), .peer-data-\\[foo\\$\\=bar_baz_i\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name)[data-foo$="bar baz" i] ~ *), .peer-data-\\[foo\\=1\\]\\:flex:is(:where(.peer)[data-foo="1"] ~ *), .peer-data-\\[foo\\=1\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name)[data-foo="1"] ~ *), .peer-data-\\[foo\\=bar\\ baz\\]\\/sibling-name\\:flex:is(:where(.peer\\/sibling-name)[data-foo="bar baz"] ~ *), .data-disabled\\:flex[data-disabled], .data-\\[foo\\$\\=\\'bar\\'_i\\]\\:flex[data-foo$="bar" i], .data-\\[foo\\$\\=bar_baz_i\\]\\:flex[data-foo$="bar baz" i], .data-\\[foo\\=1\\]\\:flex[data-foo="1"], .data-\\[foo\\=bar_baz\\]\\:flex[data-foo="bar baz"], .data-\\[potato_\\=_\\"salad\\"\\]\\:flex[data-potato="salad"], .data-\\[potato_\\^\\=_\\"salad\\"\\]\\:flex[data-potato^="salad"], .data-\\[potato\\=\\"\\^_\\=\\"\\]\\:flex[data-potato="^ ="], .data-\\[potato\\=salad\\]\\:flex[data-potato="salad"] {
      display: flex;
    }"
  `)
  expect(
    await run([
      'data-[]:flex',
      'data-[foo_^_=_"bar"]:flex', // Can't have spaces between `^` and `=`
      'data-disabled/foo:flex',
      'data-[potato=salad]/foo:flex',
    ]),
  ).toEqual('')
})

test('portrait', async () => {
  expect(await run(['portrait:flex'])).toMatchInlineSnapshot(`
    "@media (orientation: portrait) {
      .portrait\\:flex {
        display: flex;
      }
    }"
  `)
  expect(await run(['portrait/foo:flex'])).toEqual('')
})

test('landscape', async () => {
  expect(await run(['landscape:flex'])).toMatchInlineSnapshot(`
    "@media (orientation: landscape) {
      .landscape\\:flex {
        display: flex;
      }
    }"
  `)
  expect(await run(['landscape/foo:flex'])).toEqual('')
})

test('contrast-more', async () => {
  expect(await run(['contrast-more:flex'])).toMatchInlineSnapshot(`
    "@media (prefers-contrast: more) {
      .contrast-more\\:flex {
        display: flex;
      }
    }"
  `)
  expect(await run(['contrast-more/foo:flex'])).toEqual('')
})

test('contrast-less', async () => {
  expect(await run(['contrast-less:flex'])).toMatchInlineSnapshot(`
    "@media (prefers-contrast: less) {
      .contrast-less\\:flex {
        display: flex;
      }
    }"
  `)
  expect(await run(['contrast-less/foo:flex'])).toEqual('')
})

test('forced-colors', async () => {
  expect(await run(['forced-colors:flex'])).toMatchInlineSnapshot(`
    "@media (forced-colors: active) {
      .forced-colors\\:flex {
        display: flex;
      }
    }"
  `)
  expect(await run(['forced-colors/foo:flex'])).toEqual('')
})

test('inverted-colors', async () => {
  expect(await run(['inverted-colors:flex'])).toMatchInlineSnapshot(`
    "@media (inverted-colors: inverted) {
      .inverted-colors\\:flex {
        display: flex;
      }
    }"
  `)
})

test('pointer-none', async () => {
  expect(await run(['pointer-none:flex'])).toMatchInlineSnapshot(`
    "@media (pointer: none) {
      .pointer-none\\:flex {
        display: flex;
      }
    }"
  `)
})

test('pointer-coarse', async () => {
  expect(await run(['pointer-coarse:flex'])).toMatchInlineSnapshot(`
    "@media (pointer: coarse) {
      .pointer-coarse\\:flex {
        display: flex;
      }
    }"
  `)
})

test('pointer-fine', async () => {
  expect(await run(['pointer-fine:flex'])).toMatchInlineSnapshot(`
    "@media (pointer: fine) {
      .pointer-fine\\:flex {
        display: flex;
      }
    }"
  `)
})

test('any-pointer-none', async () => {
  expect(await run(['any-pointer-none:flex'])).toMatchInlineSnapshot(`
    "@media (any-pointer: none) {
      .any-pointer-none\\:flex {
        display: flex;
      }
    }"
  `)
})

test('any-pointer-coarse', async () => {
  expect(await run(['any-pointer-coarse:flex'])).toMatchInlineSnapshot(`
    "@media (any-pointer: coarse) {
      .any-pointer-coarse\\:flex {
        display: flex;
      }
    }"
  `)
})

test('any-pointer-fine', async () => {
  expect(await run(['any-pointer-fine:flex'])).toMatchInlineSnapshot(`
    "@media (any-pointer: fine) {
      .any-pointer-fine\\:flex {
        display: flex;
      }
    }"
  `)
})

test('scripting-none', async () => {
  expect(await run(['noscript:flex'])).toMatchInlineSnapshot(`
    "@media (scripting: none) {
      .noscript\\:flex {
        display: flex;
      }
    }"
  `)
})

test('nth', async () => {
  expect(
    await run([
      'nth-3:flex',
      'nth-[2n+1]:flex',
      'nth-[2n+1_of_.foo]:flex',
      'nth-last-3:flex',
      'nth-last-[2n+1]:flex',
      'nth-last-[2n+1_of_.foo]:flex',
      'nth-of-type-3:flex',
      'nth-of-type-[2n+1]:flex',
      'nth-last-of-type-3:flex',
      'nth-last-of-type-[2n+1]:flex',
    ]),
  ).toMatchInlineSnapshot(`
    ".nth-3\\:flex:nth-child(3), .nth-\\[2n\\+1\\]\\:flex:nth-child(odd), .nth-\\[2n\\+1_of_\\.foo\\]\\:flex:nth-child(odd of .foo), .nth-last-3\\:flex:nth-last-child(3), .nth-last-\\[2n\\+1\\]\\:flex:nth-last-child(odd), .nth-last-\\[2n\\+1_of_\\.foo\\]\\:flex:nth-last-child(odd of .foo), .nth-of-type-3\\:flex:nth-of-type(3), .nth-of-type-\\[2n\\+1\\]\\:flex:nth-of-type(odd), .nth-last-of-type-3\\:flex:nth-last-of-type(3), .nth-last-of-type-\\[2n\\+1\\]\\:flex:nth-last-of-type(odd) {
      display: flex;
    }"
  `)

  expect(
    await run([
      'nth-foo:flex',
      'nth-of-type-foo:flex',
      'nth-last-foo:flex',
      'nth-last-of-type-foo:flex',
    ]),
  ).toEqual('')
  expect(
    await run([
      'nth--3:flex',
      'nth-3/foo:flex',
      'nth-[2n+1]/foo:flex',
      'nth-[2n+1_of_.foo]/foo:flex',
      'nth-last--3:flex',
      'nth-last-3/foo:flex',
      'nth-last-[2n+1]/foo:flex',
      'nth-last-[2n+1_of_.foo]/foo:flex',
      'nth-of-type--3:flex',
      'nth-of-type-3/foo:flex',
      'nth-of-type-[2n+1]/foo:flex',
      'nth-last-of-type--3:flex',
      'nth-last-of-type-3/foo:flex',
      'nth-last-of-type-[2n+1]/foo:flex',
    ]),
  ).toEqual('')
})

test('container queries', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --container-lg: 1024px;
          --container-foo-bar: 1440px;
        }
        @tailwind utilities;
      `,
      [
        '@lg:flex',
        '@lg/name:flex',
        '@[123px]:flex',
        '@[456px]/name:flex',
        '@foo-bar:flex',
        '@foo-bar/name:flex',

        '@min-lg:flex',
        '@min-lg/name:flex',
        '@min-[123px]:flex',
        '@min-[456px]/name:flex',
        '@min-foo-bar:flex',
        '@min-foo-bar/name:flex',

        '@max-lg:flex',
        '@max-lg/name:flex',
        '@max-[123px]:flex',
        '@max-[456px]/name:flex',
        '@max-foo-bar:flex',
        '@max-foo-bar/name:flex',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@container name not (min-width: 1440px) {
      .\\@max-foo-bar\\/name\\:flex {
        display: flex;
      }
    }

    @container not (min-width: 1440px) {
      .\\@max-foo-bar\\:flex {
        display: flex;
      }
    }

    @container name not (min-width: 1024px) {
      .\\@max-lg\\/name\\:flex {
        display: flex;
      }
    }

    @container not (min-width: 1024px) {
      .\\@max-lg\\:flex {
        display: flex;
      }
    }

    @container name not (min-width: 456px) {
      .\\@max-\\[456px\\]\\/name\\:flex {
        display: flex;
      }
    }

    @container not (min-width: 123px) {
      .\\@max-\\[123px\\]\\:flex {
        display: flex;
      }
    }

    @container (min-width: 123px) {
      .\\@\\[123px\\]\\:flex, .\\@min-\\[123px\\]\\:flex {
        display: flex;
      }
    }

    @container name (min-width: 456px) {
      .\\@\\[456px\\]\\/name\\:flex, .\\@min-\\[456px\\]\\/name\\:flex {
        display: flex;
      }
    }

    @container name (min-width: 1024px) {
      .\\@lg\\/name\\:flex {
        display: flex;
      }
    }

    @container (min-width: 1024px) {
      .\\@lg\\:flex {
        display: flex;
      }
    }

    @container name (min-width: 1024px) {
      .\\@min-lg\\/name\\:flex {
        display: flex;
      }
    }

    @container (min-width: 1024px) {
      .\\@min-lg\\:flex {
        display: flex;
      }
    }

    @container name (min-width: 1440px) {
      .\\@foo-bar\\/name\\:flex {
        display: flex;
      }
    }

    @container (min-width: 1440px) {
      .\\@foo-bar\\:flex {
        display: flex;
      }
    }

    @container name (min-width: 1440px) {
      .\\@min-foo-bar\\/name\\:flex {
        display: flex;
      }
    }

    @container (min-width: 1440px) {
      .\\@min-foo-bar\\:flex {
        display: flex;
      }
    }"
  `)
})

test('variant order', async () => {
  expect(
    await compileCss(
      css`
        @theme {
          --breakpoint-sm: 640px;
          --breakpoint-md: 768px;
          --breakpoint-lg: 1024px;
          --breakpoint-xl: 1280px;
          --breakpoint-2xl: 1536px;
        }
        @tailwind utilities;
      `,
      [
        '[&_p]:flex',
        '2xl:flex',
        'active:flex',
        'after:flex',
        'aria-[custom=true]:flex',
        'aria-busy:flex',
        'aria-checked:flex',
        'aria-disabled:flex',
        'aria-expanded:flex',
        'aria-hidden:flex',
        'aria-pressed:flex',
        'aria-readonly:flex',
        'aria-required:flex',
        'aria-selected:flex',
        'autofill:flex',
        'backdrop:flex',
        'before:flex',
        'checked:flex',
        'contrast-less:flex',
        'contrast-more:flex',
        'dark:flex',
        'data-custom:flex',
        'data-[custom=true]:flex',
        'default:flex',
        'details-content:flex',
        'disabled:flex',
        'empty:flex',
        'enabled:flex',
        'even:flex',
        'file:flex',
        'first-letter:flex',
        'first-line:flex',
        'first-of-type:flex',
        'first:flex',
        'focus-visible:flex',
        'focus-within:flex',
        'focus:flex',
        'forced-colors:flex',
        'group-hover:flex',
        'has-[:hover]:flex',
        'hover:flex',
        'in-range:flex',
        'indeterminate:flex',
        'invalid:flex',
        'landscape:flex',
        'last-of-type:flex',
        'last:flex',
        'lg:flex',
        'ltr:flex',
        'marker:flex',
        'md:flex',
        'motion-reduce:flex',
        'motion-safe:flex',
        'odd:flex',
        'only-of-type:flex',
        'only:flex',
        'open:flex',
        'optional:flex',
        'out-of-range:flex',
        'peer-hover:flex',
        'placeholder-shown:flex',
        'placeholder:flex',
        'portrait:flex',
        'print:flex',
        'read-only:flex',
        'required:flex',
        'rtl:flex',
        'selection:flex',
        'sm:flex',
        'supports-[display:flex]:flex',
        'target:flex',
        'valid:flex',
        'visited:flex',
        'xl:flex',
      ],
    ),
  ).toMatchInlineSnapshot(`
    "@layer properties {
      @supports (((-webkit-hyphens: none)) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
        *, :before, :after, ::backdrop {
          --tw-content: "";
        }
      }
    }

    @media (hover: hover) {
      .group-hover\\:flex:is(:where(.group):hover *), .peer-hover\\:flex:is(:where(.peer):hover ~ *) {
        display: flex;
      }
    }

    .first-letter\\:flex:first-letter, .first-line\\:flex:first-line {
      display: flex;
    }

    .marker\\:flex ::marker {
      display: flex;
    }

    .marker\\:flex::marker {
      display: flex;
    }

    .marker\\:flex ::-webkit-details-marker {
      display: flex;
    }

    .marker\\:flex::-webkit-details-marker {
      display: flex;
    }

    .selection\\:flex ::selection {
      display: flex;
    }

    .selection\\:flex::selection {
      display: flex;
    }

    .file\\:flex::file-selector-button {
      display: flex;
    }

    .placeholder\\:flex::placeholder, .backdrop\\:flex::backdrop {
      display: flex;
    }

    .details-content\\:flex::details-content {
      display: flex;
    }

    .before\\:flex:before, .after\\:flex:after {
      content: var(--tw-content);
      display: flex;
    }

    .first\\:flex:first-child, .last\\:flex:last-child, .only\\:flex:only-child, .odd\\:flex:nth-child(odd), .even\\:flex:nth-child(2n), .first-of-type\\:flex:first-of-type, .last-of-type\\:flex:last-of-type, .only-of-type\\:flex:only-of-type, .visited\\:flex:visited, .target\\:flex:target, .open\\:flex:is([open], :popover-open, :open), .default\\:flex:default, .checked\\:flex:checked, .indeterminate\\:flex:indeterminate, .placeholder-shown\\:flex:placeholder-shown, .autofill\\:flex:autofill, .optional\\:flex:optional, .required\\:flex:required, .valid\\:flex:valid, .invalid\\:flex:invalid, .in-range\\:flex:in-range, .out-of-range\\:flex:out-of-range, .read-only\\:flex:read-only, .empty\\:flex:empty, .focus-within\\:flex:focus-within {
      display: flex;
    }

    @media (hover: hover) {
      .hover\\:flex:hover {
        display: flex;
      }
    }

    .focus\\:flex:focus, .focus-visible\\:flex:focus-visible, .active\\:flex:active, .enabled\\:flex:enabled, .disabled\\:flex:disabled, .has-\\[\\:hover\\]\\:flex:has(:hover), .aria-busy\\:flex[aria-busy="true"], .aria-checked\\:flex[aria-checked="true"], .aria-disabled\\:flex[aria-disabled="true"], .aria-expanded\\:flex[aria-expanded="true"], .aria-hidden\\:flex[aria-hidden="true"], .aria-pressed\\:flex[aria-pressed="true"], .aria-readonly\\:flex[aria-readonly="true"], .aria-required\\:flex[aria-required="true"], .aria-selected\\:flex[aria-selected="true"], .aria-\\[custom\\=true\\]\\:flex[aria-custom="true"], .data-custom\\:flex[data-custom], .data-\\[custom\\=true\\]\\:flex[data-custom="true"] {
      display: flex;
    }

    @supports (display: flex) {
      .supports-\\[display\\:flex\\]\\:flex {
        display: flex;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .motion-safe\\:flex {
        display: flex;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .motion-reduce\\:flex {
        display: flex;
      }
    }

    @media (prefers-contrast: more) {
      .contrast-more\\:flex {
        display: flex;
      }
    }

    @media (prefers-contrast: less) {
      .contrast-less\\:flex {
        display: flex;
      }
    }

    @media (min-width: 640px) {
      .sm\\:flex {
        display: flex;
      }
    }

    @media (min-width: 768px) {
      .md\\:flex {
        display: flex;
      }
    }

    @media (min-width: 1024px) {
      .lg\\:flex {
        display: flex;
      }
    }

    @media (min-width: 1280px) {
      .xl\\:flex {
        display: flex;
      }
    }

    @media (min-width: 1536px) {
      .\\32 xl\\:flex {
        display: flex;
      }
    }

    @media (orientation: portrait) {
      .portrait\\:flex {
        display: flex;
      }
    }

    @media (orientation: landscape) {
      .landscape\\:flex {
        display: flex;
      }
    }

    .ltr\\:flex:where(:dir(ltr), [dir="ltr"], [dir="ltr"] *), .rtl\\:flex:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *) {
      display: flex;
    }

    @media (prefers-color-scheme: dark) {
      .dark\\:flex {
        display: flex;
      }
    }

    @media print {
      .print\\:flex {
        display: flex;
      }
    }

    @media (forced-colors: active) {
      .forced-colors\\:flex {
        display: flex;
      }
    }

    .\\[\\&_p\\]\\:flex p {
      display: flex;
    }

    @property --tw-content {
      syntax: "*";
      inherits: false;
      initial-value: "";
    }"
  `)
})

test('variants with the same root are sorted deterministically', async () => {
  function permute(arr: string[]): string[][] {
    if (arr.length <= 1) return [arr]

    return arr.flatMap((item, i) =>
      permute([...arr.slice(0, i), ...arr.slice(i + 1)]).map((permutation) => [
        item,
        ...permutation,
      ]),
    )
  }

  let classLists = permute([
    'data-hover:flex',
    'data-focus:flex',
    'data-active:flex',
    'data-[foo]:flex',
    'data-[bar]:flex',
    'data-[baz]:flex',
  ])

  for (let classList of classLists) {
    let output = await compileCss('@tailwind utilities;', classList)

    expect(output.trim()).toEqual(
      dedent(`
        .data-active\\:flex[data-active], .data-focus\\:flex[data-focus], .data-hover\\:flex[data-hover], .data-\\[bar\\]\\:flex[data-bar], .data-\\[baz\\]\\:flex[data-baz], .data-\\[foo\\]\\:flex[data-foo] {
          display: flex;
        }
      `),
    )
  }
})

test('matchVariant sorts deterministically', async () => {
  function permute(arr: string[]): string[][] {
    if (arr.length <= 1) return [arr]

    return arr.flatMap((item, i) =>
      permute([...arr.slice(0, i), ...arr.slice(i + 1)]).map((permutation) => [
        item,
        ...permutation,
      ]),
    )
  }

  let classLists = permute([
    'is-data:flex',
    'is-data-foo:flex',
    'is-data-bar:flex',
    'is-data-[potato]:flex',
    'is-data-[sandwich]:flex',
  ])

  for (let classList of classLists) {
    let output = await compileCss('@tailwind utilities; @plugin "./plugin.js";', classList, {
      loadModule(id: string) {
        return {
          base: '/',
          module: createPlugin(({ matchVariant }) => {
            matchVariant('is-data', (value) => `&:is([data-${value}])`, {
              values: {
                DEFAULT: 'default',
                foo: 'foo',
                bar: 'bar',
              },
            })
          }),
        }
      },
    })

    expect(output.trim()).toEqual(
      dedent(`
        .is-data\\:flex[data-default], .is-data-foo\\:flex[data-foo], .is-data-bar\\:flex[data-bar], .is-data-\\[potato\\]\\:flex[data-potato], .is-data-\\[sandwich\\]\\:flex[data-sandwich] {
          display: flex;
        }
      `),
    )
  }
})

test.each([
  // These are style rules
  [['.foo'], Compounds.StyleRules],
  [['&:is(:hover)'], Compounds.StyleRules],

  // These are conditional at rules
  [['@media foo'], Compounds.AtRules],
  [['@supports foo'], Compounds.AtRules],
  [['@container foo'], Compounds.AtRules],

  // These are both
  [['.foo', '@media foo'], Compounds.StyleRules | Compounds.AtRules],

  // These are never compoundable because:
  // - Pseudo-elements are not compoundable
  // - Non-conditional at-rules are not compoundable
  [['.foo::before'], Compounds.Never],
  [['@starting-style'], Compounds.Never],

  // The presence of a single non-compoundable selector makes the whole list non-compoundable
  [['.foo', '@media foo', '.foo::before'], Compounds.Never],
  [['.foo', '@media foo', '@starting-style'], Compounds.Never],
])('compoundsForSelectors: %s', (selectors, expected) => {
  expect(compoundsForSelectors(selectors)).toBe(expected)
})
