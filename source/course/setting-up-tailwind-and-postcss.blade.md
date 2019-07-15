---
extends: _layouts.course-lesson
title: "Setting Up Tailwind and PostCSS"
description: "Learn how to install Tailwind and get it compiling in a simple HTML project."
titleBorder: true
hideTableOfContents: true
vimeoId: 345586861
nextUrl: "/course/the-utility-first-workflow"
next: "The Utility-First Workflow"
---

## Notes

First, create a `package.json` file and install `tailwindcss`, `postcss-cli`, and `autoprefixer`:

```sh
npm init -y
npm install tailwindcss postcss-cli autoprefixer
```

Next, create a `postcss.config.js` file:

```js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}
```

Now create a CSS file and add the special `@@tailwind` directives:

```css
@@tailwind base;
@@tailwind components;
@@tailwind utilities;
```

Add a simple build script to your `package.json` file to compile your CSS:

```js
{
  // ...
  "scripts": {
    "build": "postcss css/tailwind.css -o public/build/tailwind.css"
  },
  // ...
}
```

Run your build script to generate your CSS:

```sh
npm run build
```

Create a simple HTML file that includes your compiled CSS:

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="stylesheet" href="/build/tailwind.css">
</head>
<body>
  <h1 class="text-4xl font-bold text-center text-blue-500">Hello world!</h1>
</body>
</html>
```



