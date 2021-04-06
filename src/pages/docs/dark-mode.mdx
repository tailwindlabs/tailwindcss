---
title: Dark Mode
description: Using Tailwind CSS to style your site in dark mode.
---

import { Heading } from '@/components/Heading'

## <Heading hidden>Basic usage</Heading>

Now that dark mode is a first-class feature of many operating systems, it's becoming more and more common to design a dark version of your website to go along with the default design.

To make this as easy as possible, Tailwind includes a `dark` variant that lets you style your site differently when dark mode is enabled:

```html
<div class="bg-white **dark:bg-gray-800**">
  <h1 class="text-gray-900 **dark:text-white**">Dark mode is here!</h1>
  <p class="text-gray-600 **dark:text-gray-300**">
    Lorem ipsum...
  </p>
</div>
```

It's important to note that because of file size considerations, **the dark mode variant is not enabled in Tailwind by default**.

To enable it, set the `darkMode` option in your `tailwind.config.js` file to `media`:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'media',
  // ...
}
```

Now whenever dark mode is enabled on the user's operating system, `dark:{class}` classes will take precedence over unprefixed classes. The `media` strategy uses the `prefers-color-scheme` media feature under the hood, but if you'd like to support toggling dark mode manually, you can also [use the 'class' strategy](#toggling-dark-mode-manually) for more control.

By default, when `darkMode` is enabled `dark` variants are only generated for color-related classes, which includes text color, background color, border color, gradients, and placeholder color.

---

## Stacking with other variants

The `dark` variant can be combined with both [responsive](https://tailwindcss.com/docs/responsive-design) variants and [state variants](https://tailwindcss.com/docs/hover-focus-and-other-states) (like hover and focus):

```html
<button class="lg:dark:hover:bg-white ...">
  <!-- ... -->
</button>
```

The responsive variant needs to come first, then `dark`, then the state variant for this to work.

---

## Enabling for other utilities

To enable the `dark` variant for other utilities, add `dark` to the variants list for whatever utility you'd like to enable it for:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    extend: {
      textOpacity: ['dark']
    }
  }
}
```

By default, the `dark` variant is enabled for `backgroundColor`, `borderColor`, `gradientColorStops`, `placeholderColor`, and `textColor`.

---

## Toggling dark mode manually

If you want to support toggling dark mode manually instead of relying on the operating system preference, use the `class` strategy instead of the `media` strategy:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

Now instead of `dark:{class}` classes being applied based on `prefers-color-scheme`, they will be applied whenever `dark` class is present earlier in the HTML tree.

```html
<!-- Dark mode not enabled -->
<html>
<body>
  <!-- Will be white -->
  <div class="**bg-white** dark:bg-black">
    <!-- ... -->
  </div>
</body>
</html>

<!-- Dark mode enabled -->
<html class="**dark**">
<body>
  <!-- Will be black -->
  <div class="bg-white **dark:bg-black**">
    <!-- ... -->
  </div>
</body>
</html>
```

How you add the `dark` class to the `html` element is up to you, but a common approach is to use a bit of JS that reads a preference from somewhere (like `localStorage`) and updates the DOM accordingly.

Here's a simple example of how you can support light mode, dark mode, as well as respecting the operating system preference:

```js
// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

// Whenever the user explicitly chooses light mode
localStorage.theme = 'light'

// Whenever the user explicitly chooses dark mode
localStorage.theme = 'dark'

// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem('theme')
```

Again you can manage this however you like, even storing the preference server-side in a database and rendering the class on the server — it's totally up to you.
