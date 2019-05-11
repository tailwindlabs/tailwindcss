---
extends: _layouts.documentation
title: "Preflight"
description: "An opinionated set of base styles for Tailwind projects."
titleBorder: true
---

<h2 style="font-size: 0" class="invisible m-0 -mb-6">Overview</h2>

Built on top of [normalize.css](https://github.com/necolas/normalize.css/), Preflight is a set of base styles for Tailwind projects that are designed to smooth over cross-browser inconsistencies and make it easier for you work within the constraints of your design system.

Tailwind automatically injects these styles when you include `@@tailwind base` in your CSS:

```css
/* Preflight will be injected here */
@@tailwind base;

@@tailwind components;

@@tailwind utilities;
```

While most of the styles in Preflight are meant to go unnoticed — they simply make things behave more like you'd expect them to — some are more opinionated and can be surprising when you first encounter them.

For a complete reference of all the styles applied by Preflight, [see the stylesheet](https://unpkg.com/tailwindcss@next/dist/base.css).

---

## Default margins are removed

Preflight removes all of the default margins from elements like headings, blockquotes, paragraphs, etc.

```css
blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
figure,
p,
pre {
  margin: 0;
}
```

This makes it harder to accidentally rely on margin values applied by the user-agent stylesheet that are not part of your spacing scale.

---

## Headings are unstyled

All heading elements are completely unstyled by default, and have the same font-size and font-weight as normal text.

```css
h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}
```

The reason for this is two-fold:

- **It helps you avoid accidentally deviating from your type scale**. By default, the browsers assigns sizes to headings that don't exist in Tailwind's default type scale, and aren't guaranteed to exist in your own type scale.
- **In UI development, headings should often be visually de-emphasized**. Making headings unstyled by default means any styling you apply to headings happens consciously and deliberately.

You can always add default header styles to your project by [adding your own base styles](/docs/adding-base-styles).

---

## Lists are unstyled

Ordered and unordered lists are unstyled by default, with no bullets/numbers and no margin or padding.

```css
ol,
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
```

If you'd like to style a list, you can do so using the [list-style-type](/docs/list-style-type) and [list-style-position](/docs/list-style-position) utilities:

```html
<ul class="list-disc list-inside">
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
```

You can always add default list styles to your project by [adding your own base styles](/docs/adding-base-styles).


---

## Images are block-level

---

## Borders are solid by default

---

## Customizing Preflight

- Changing the base font family, line height, font size, etc.

---

## Extending Preflight

- Adding your own base styles, mostly just link to other page

---

## Disabling Preflight

- Disable in corePlugins section of config

---


Coming soon.

In a nutshell:

- An opinionated layer on top of [normalize.css](https://github.com/necolas/normalize.css/)
- Intended to make it hard to accidentally deviate from your design system, so elements like headings are intentionally unstyled
- [See the source code](https://github.com/tailwindcss/tailwindcss/blob/next/src/plugins/css/preflight.css) to see what styles are applied
