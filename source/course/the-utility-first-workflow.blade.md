---
extends: _layouts.course-lesson
title: "The Utility-First Workflow"
description: "Learn how to use Tailwind's utility classes to build a custom marketing page."
titleBorder: true
hideTableOfContents: true
vimeoId: 345753452
prevUrl: "/course/setting-up-tailwind-and-postcss"
prev: "Setting Up Tailwind and PostCSS"
nextUrl: "/course/responsive-design"
next: "Responsive Design"
---

## Notes

Tailwind has been set up in our project. Let's actually build a simple splash page which promotes the imaginary website workcation. It contains the workcation logo, a short description with a heading and a call to action button.

### Colors

First, we remove the heading and change the background color of our page. Add the class `bg-gray-100` to the body which will create a light gray background.

```html
<body class="bg-gray-100">
</body>
```
Tailwind comes with a set of well-balanced [default colors](https://tailwindcss.com/docs/customizing-colors/#default-color-palette "default colors"). You can style the [background color](https://tailwindcss.com/docs/background-color/#app "background color"), [text color](https://tailwindcss.com/docs/text-color) and [border color](https://tailwindcss.com/docs/border-color/#app).

You can choose from a variety of different color classes. The color class names are assembled by the following schema:
```
[type]-[color]-[brightness]
```
The type can be `bg`, `text` or `border`. The color could be `green` or `indigo` for example. And the brightness goes from `100` to `900` (from lightest to darkest). Combine the three parts as you like.

### Padding Utilities

As the next step, we add an image to the body and wrap it inside of a `div` tag.  Finally, reference the svg in your html 
```html
  <div>
      <img src="./img/logo.svg" alt="Workcation logo">
  </div>
```

Create a new folder `img` inside of the `public` folder. Copy the following svg code and save it as a new `logo.svg` file. Place the svg file inside of the `img` folder.
```svg
<svg viewBox="0 0 185 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8 w-auto"><path d="M121.09 28.336c2.352 0 4.392-1.248 5.424-3.12l-2.688-1.536c-.48.984-1.512 1.584-2.76 1.584-1.848 0-3.216-1.368-3.216-3.264 0-1.92 1.368-3.288 3.216-3.288 1.224 0 2.256.624 2.736 1.608l2.664-1.56c-.984-1.848-3.024-3.096-5.376-3.096-3.648 0-6.336 2.76-6.336 6.336 0 3.576 2.688 6.336 6.336 6.336zM137.084 16v1.416c-.864-1.08-2.16-1.752-3.912-1.752-3.192 0-5.832 2.76-5.832 6.336 0 3.576 2.64 6.336 5.832 6.336 1.752 0 3.048-.672 3.912-1.752V28h3.096V16h-3.096zm-3.336 9.384c-1.896 0-3.312-1.368-3.312-3.384s1.416-3.384 3.312-3.384c1.92 0 3.336 1.368 3.336 3.384s-1.416 3.384-3.336 3.384zM149.851 18.976V16h-2.712v-3.36l-3.096.936V16h-2.088v2.976h2.088v4.992c0 3.24 1.464 4.512 5.808 4.032v-2.808c-1.776.096-2.712.072-2.712-1.224v-4.992h2.712zM153.57 14.56c1.056 0 1.92-.864 1.92-1.896s-.864-1.92-1.92-1.92c-1.032 0-1.896.888-1.896 1.92s.864 1.896 1.896 1.896zM152.034 28h3.096V16h-3.096v12zM163.676 28.336c3.528 0 6.36-2.76 6.36-6.336 0-3.576-2.832-6.336-6.36-6.336-3.528 0-6.336 2.76-6.336 6.336 0 3.576 2.808 6.336 6.336 6.336zm0-3.024c-1.824 0-3.24-1.368-3.24-3.312 0-1.944 1.416-3.312 3.24-3.312 1.848 0 3.264 1.368 3.264 3.312 0 1.944-1.416 3.312-3.264 3.312zM178.886 15.664c-1.608 0-2.856.6-3.576 1.68V16h-3.096v12h3.096v-6.48c0-2.088 1.128-2.976 2.64-2.976 1.392 0 2.376.84 2.376 2.472V28h3.096v-7.368c0-3.192-1.992-4.968-4.536-4.968z" fill="#5870E0"></path><path d="M61.063 28h3.768l3.144-11.088L71.143 28h3.768l4.704-16.8h-3.48L72.92 23.656 69.391 11.2H66.56l-3.504 12.456L59.84 11.2h-3.48L61.063 28zM85.674 28.336c3.528 0 6.36-2.76 6.36-6.336 0-3.576-2.832-6.336-6.36-6.336-3.528 0-6.336 2.76-6.336 6.336 0 3.576 2.808 6.336 6.336 6.336zm0-3.024c-1.824 0-3.24-1.368-3.24-3.312 0-1.944 1.416-3.312 3.24-3.312 1.848 0 3.264 1.368 3.264 3.312 0 1.944-1.416 3.312-3.264 3.312zM97.308 18.064V16h-3.096v12h3.096v-5.736c0-2.52 2.04-3.24 3.648-3.048V15.76c-1.512 0-3.024.672-3.648 2.304zM113.831 28l-4.968-6.072L113.687 16h-3.696l-4.128 5.28V11.2h-3.096V28h3.096v-5.448L110.231 28h3.6z" fill="#2D323F"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M43.911 12.604L36.213 8.16v20.645h9v2h-44v-2h4v-12.72l-3.728.933L1 15.078l21.09-5.273h3.122a9.552 9.552 0 0 0-.68 2.559l-.483 3.975 5.164-2.982v15.448h5V8.161l-7.696 4.444a7.502 7.502 0 0 1 2.565-4.8h-4.12a7.489 7.489 0 0 1 6.646-2.973l-5.591-3.228a7.488 7.488 0 0 1 6.696.402c1.039.6 1.88 1.41 2.5 2.347a7.461 7.461 0 0 1 2.5-2.347 7.49 7.49 0 0 1 6.698-.402l-5.593 3.228a7.488 7.488 0 0 1 6.646 2.973h-4.12a7.498 7.498 0 0 1 2.567 4.8zM25.213 28.805v-10h-6v10h6zm-11-8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill="#5870E0"></path></svg>
```

It doesn't look so nice that the image goes all the way to the edge of the page. Therefore, we add a padding to the div.

All the padding utility classes start with a `p`. The `p` can be followed by a dash and a number resulting in `p-8` for example. Add a `p-8` class to the div. We can also set a different amount of horizontal padding and vertical padding to the div. So replace the `p-8` with `px-8` and `py-12`.

The numbers come from tailwind's spacing scale. The scaling numbers start with `0` and go up to 64 in increasingly greater steps. It is probably the easiest to look into the [padding docs](https://tailwindcss.com/docs/padding) to see which numbers are available and what unit they represent in the actual css.

The padding utilities scheme goes like this:
```
p-[scale]
or
p[direction]-[scale]
```
The direction can be omitted to apply padding to all sides. To apply only horizontal padding use `x` and for vertical padding `y`. Left, right, top and bottom are used by their first character `r, l, t, b`. So for example `pr-10` creates a right padding of 10.

### Height
Right now, the image takes up the full width of the page. Let's make it a little smaller by decreasing its height. We do this by applying the class `h-10` to the image.

The height utility classes use the same sizing scale as the padding. Therefore, the scheme is straight forward and also [written down in the docs](https://tailwindcss.com/docs/height):
```
h-[scale]
```

If done correctly, the current content of your html should look like this:

```html
  <body class="bg-gray-100">
    <div class="px-8 py-12">
        <img class="h-10" src="./img/logo.svg" alt="Workcation logo">
    </div>
  </body>
```

## The Rest of The Notes are Work in Progress
Coming soon.
