import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { describe, expect, test, vi } from 'vitest'
import * as versions from '../../utils/version'
import { migrateCandidate } from './migrate'
vi.spyOn(versions, 'isMajor').mockReturnValue(true)

const css = String.raw

describe('is-safe-migration', async () => {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';

      /* TODO(perf): Only here to speed up the tests */
      @theme {
        --*: initial;
        --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      }
    `,
    { base: __dirname },
  )

  test.each([
    [`let notBorder = !border    \n`, '!border'],
    [`{ "foo": !border.something + ""}\n`, '!border'],
    [`<div v-if="something && !border"></div>\n`, '!border'],
    [`<div v-else-if="something && !border"></div>\n`, '!border'],
    [`<div v-show="something && !border"></div>\n`, '!border'],
    [`<div v-if="!border || !border"></div>\n`, '!border'],
    [`<div v-else-if="!border || !border"></div>\n`, '!border'],
    [`<div v-show="!border || !border"></div>\n`, '!border'],
    [`<div v-if="!border"></div>\n`, '!border'],
    [`<div v-else-if="!border"></div>\n`, '!border'],
    [`<div v-show="!border"></div>\n`, '!border'],
    [`<div x-if="!border"></div>\n`, '!border'],

    [`let notShadow = shadow    \n`, 'shadow'],
    [`{ "foo": shadow.something + ""}\n`, 'shadow'],
    [`<div v-if="something && shadow"></div>\n`, 'shadow'],
    [`<div v-else-if="something && shadow"></div>\n`, 'shadow'],
    [`<div v-show="something && shadow"></div>\n`, 'shadow'],
    [`<div v-if="shadow || shadow"></div>\n`, 'shadow'],
    [`<div v-else-if="shadow || shadow"></div>\n`, 'shadow'],
    [`<div v-show="shadow || shadow"></div>\n`, 'shadow'],
    [`<div v-if="shadow"></div>\n`, 'shadow'],
    [`<div v-else-if="shadow"></div>\n`, 'shadow'],
    [`<div v-show="shadow"></div>\n`, 'shadow'],
    [`<div x-if="shadow"></div>\n`, 'shadow'],
    [`<div style={{filter: 'drop-shadow(30px 10px 4px #4444dd)'}}/>\n`, 'shadow'],
    [`<div style="flex-grow: 1"></div>\n`, 'flex-grow'],
    [`<div style='flex-shrink: 0'></div>\n`, 'flex-shrink'],
    [`<div style="  flex-shrink: 0"></div>\n`, 'flex-shrink'],
    [`<div style="\nflex-shrink: 0\n"></div>\n`, 'flex-shrink'],

    // Next.js Image placeholder cases
    [`<Image placeholder="blur" src="/image.jpg" />`, 'blur'],
    [`<Image placeholder={'blur'} src="/image.jpg" />`, 'blur'],
    [`<Image placeholder={blur} src="/image.jpg" />`, 'blur'],

    // https://github.com/tailwindlabs/tailwindcss/issues/17974
    ['<div v-if="!duration">', '!duration'],
    ['<div :active="!duration">', '!duration'],
    ['<div :active="!visible">', '!visible'],

    // Alpine/Livewire wire:…
    ['<x-input.number required="foo" wire:model.blur="coins" />', 'blur'],

    // Vue 3 events
    [`emit('blur', props.modelValue)\n`, 'blur'],
    [`$emit('blur', props.modelValue)\n`, 'blur'],

    // JavaScript / TypeScript
    [`document.addEventListener('blur',handleBlur)`, 'blur'],
    [`document.addEventListener('blur', handleBlur)`, 'blur'],

    [`function foo({ outline = true })`, 'outline'],
    [`function foo({ before = false, outline = true })`, 'outline'],
    [`function foo({before=false,outline=true })`, 'outline'],
    [`function foo({outline=true })`, 'outline'],
    // https://github.com/tailwindlabs/tailwindcss/issues/18675
    [
      // With default value
      `function foo({ size = "1.25rem", digit, outline = true, textClass = "", className = "" })`,
      'outline',
    ],
    [
      // Without default value
      `function foo({ size = "1.25rem", digit, outline, textClass = "", className = "" })`,
      'outline',
    ],
    [
      // As the last argument
      `function foo({ size = "1.25rem", digit, outline })`,
      'outline',
    ],
    [
      // As the last argument, but there is technically another `"` on the same line
      `function foo({ size = "1.25rem", digit, outline }): { return "foo" }`,
      'outline',
    ],
    [
      // Tricky quote balancing
      `function foo({ before = "'", outline, after = "'" }): { return "foo" }`,
      'outline',
    ],

    [`function foo(blur, foo)`, 'blur'],
    [`function foo(blur,foo)`, 'blur'],

    // shadcn/ui variants
    [`<Button variant="outline" />`, 'outline'],
    [`<Button variant='outline' />`, 'outline'],
    [`<Button variant={"outline"} />`, 'outline'],
    [`<Button variant={'outline'} />`, 'outline'],
    [`function Button({ variant = "outline" }) {}`, 'outline'],
    [`function Button({ variant = 'outline' }) {}`, 'outline'],
    [`function Button({ variant="outline" }) {}`, 'outline'],
    [`function Button({ variant='outline' }) {}`, 'outline'],
    [`Button({ variant: "outline" })`, 'outline'],
    [`Button({ variant: 'outline' })`, 'outline'],

    // https://github.com/tailwindlabs/tailwindcss/issues/20435
    // `variant` prop values holding conditional expressions: the strings
    // inside are variant names, not class names
    [`Button({ variant: isActive ? "outline" : "ghost" })`, 'outline'],
    [`<Button variant={first ? "default" : "outline"} />`, 'outline'],
    [`<Button variant={variant ?? "outline"} />`, 'outline'],
    [`<Button variant={required ? 'secondary' : 'outline'} />`, 'outline'],
    [`<div data-variant={variant ?? "outline"} />`, 'outline'],
    [`<Button variant={variant === "outline" ? "ghost" : "default"} />`, 'outline'],

    // https://github.com/tailwindlabs/tailwindcss/issues/20435
    // Candidates inside comments are not class names
    ['// this comment mentions `outline: none` as CSS prose', 'outline'],
    ['/* this comment mentions `outline: none` as CSS prose */', 'outline'],
    ['<div>{/* this comment mentions `outline: none` as CSS prose */}</div>', 'outline'],

    // A dashed candidate inside a comment is not a class name either
    ['// use `shadow-sm` for the small shadow', 'shadow-sm'],

    // A `variant` value expression can span multiple lines: the strings
    // inside it are still variant names, not class names
    [`<Button variant={\n  active ? "outline" : "ghost"\n} />`, 'outline'],
    [`<Button variant={active ? "outline" :\n  "ghost"} />`, 'ghost'],

    // A string compared against `variant` is a variant name, not a class
    [`const isOutline = variant === "outline"`, 'outline'],

    // A quote inside a comment does not open a string: the `variant`
    // prop after it still protects its values
    ['// Template literals use the ` character.\n<Button variant={active ? "outline" : "ghost"} />', 'outline'],

    // A `variant` value expression can break before a comparison
    // operator: its strings are still variant names
    [`<Button variant={size\n > 0 ? "outline" : "ghost"} />`, 'outline'],

    // Dashed candidates inside comments after JSX are not class names
    ['<div>{/* shadow-sm */}</div>', 'shadow-sm'],
    ['const node = <div></div>; // use shadow-sm', 'shadow-sm'],

    // A multiline block comment inside a `variant` value does not end
    // the value: the strings after it are still variant names
    [`<Button variant={active /*\n * Choose the button style.\n */ ? "outline" : "ghost"} />`, 'outline'],

    // Closing tags of components whose names start with `_` or `$` are
    // not regexes: a comment after them is still a comment
    ['const node = <_Button></_Button>; // use shadow-sm', 'shadow-sm'],
    ['const node = <$Button></$Button>; // use shadow-sm', 'shadow-sm'],
  ])('does not replace classes in invalid positions #%#', async (example, candidate) => {
    expect(
      await migrateCandidate(designSystem, {}, candidate, {
        contents: example,
        start: example.indexOf(candidate),
        end: example.indexOf(candidate) + candidate.length,
      }),
    ).toEqual(candidate)
  })

  test.each([
    // Vue classes
    [`<div class="shadow"></div>`, 'shadow', 'shadow-sm'],
    [`<div :class="{ shadow: true }"></div>`, 'shadow', 'shadow-sm'],
    [`<div enter-class="shadow"></div>`, 'shadow', 'shadow-sm'],
    [`<div :enter-class="{ shadow: true }"></div>`, 'shadow', 'shadow-sm'],

    // React classes
    [`<div className="shadow"></div>`, 'shadow', 'shadow-sm'],
    [`<div enterClassName="shadow"></div>`, 'shadow', 'shadow-sm'],

    // Preact-style
    [`<div enterClass="shadow"></div>`, 'shadow', 'shadow-sm'],

    // A `className` next to a `variant` prop still migrates: the variant
    // value ended before the candidate
    // https://github.com/tailwindlabs/tailwindcss/issues/20435
    [`<Button variant="primary" className="outline" />`, 'outline', 'outline-solid'],
    [`Button({ variant: "primary", className: "outline" })`, 'outline', 'outline-solid'],

    // A comparison against `variant` is not a `variant` prop assignment:
    // the class composed next to it still migrates
    [`cn(variant === "primary" && "outline")`, 'outline', 'outline-solid'],
    [`cn(variant == "primary" && "outline")`, 'outline', 'outline-solid'],

    // An apostrophe in JSX text does not open a string: the class on a
    // later line still migrates, and the `//` in the URL stays a string
    [
      `<p>Don't</p>\n<a href='https://example.com' className="outline" />`,
      'outline',
      'outline-solid',
    ],

    // A URL in HTML text is not a comment: the class after it migrates
    [`<p>https://example.com</p><div class="outline"></div>`, 'outline', 'outline-solid'],

    // `variant` inside a query string is not a prop assignment: the
    // class after it migrates
    [`<a href="/?variant=primary" class="outline">`, 'outline', 'outline-solid'],

    // An attribute value can span lines: the URL inside it is not a
    // comment, and the class after it migrates
    [
      `<img srcset="\nhttps://example.com/image.png 1x" class="outline">`,
      'outline',
      'outline-solid',
    ],

    // A semicolon-free `variant` assignment ends at the newline: a class
    // in the next statement still migrates
    [
      'const variant = props.variant ?? "primary"\nreturn cn("outline")',
      'outline',
      'outline-solid',
    ],

    // A regular expression literal is not a comment: the class after it
    // still migrates
    ['const slash = /\\\\//; const classes = "shadow-sm"', 'shadow-sm', 'shadow-xs'],

    // A cva `variant: { … }` object holds class names, not variant
    // values: they still migrate
    [
      'const buttonVariants = cva("", { variants: { variant: { default: "bg-primary shadow" } } })',
      'shadow',
      'shadow-sm',
    ],

    // A quote right after a block comment still opens the string: the
    // class inside it migrates
    ['cn(/* note */"outline")', 'outline', 'outline-solid'],

    // A comment line after a semicolon-free `variant` assignment does
    // not extend the value: a class in the next statement still migrates
    [
      'const variant = props.variant ?? "primary"\n/* Choose the classes below. */\nreturn cn("outline")',
      'outline',
      'outline-solid',
    ],

    // A regex right after a `<` comparison is not a JSX closing tag:
    // the class after it still migrates
    ['const match = value</[/*]/.test(input); const classes = "shadow-sm"', 'shadow-sm', 'shadow-xs'],

    // An escaped quote inside a regex literal does not open a string:
    // the class after it still migrates
    ['const re = /\\"/; <div className="shadow" />', 'shadow', 'shadow-sm'],
  ])('replaces classes in valid positions #%#', async (example, candidate, expected) => {
    expect(
      await migrateCandidate(designSystem, {}, candidate, {
        contents: example,
        start: example.indexOf(candidate),
        end: example.indexOf(candidate) + candidate.length,
      }),
    ).toEqual(expected)
  })
})
