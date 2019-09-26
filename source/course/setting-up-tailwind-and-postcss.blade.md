---
extends: _layouts.course-lesson
title: "Setting up Tailwind and PostCSS"
description: "Learn how to install Tailwind and get it compiling in a simple HTML project."
titleBorder: true
hideTableOfContents: true
vimeoId: 345586861
nextUrl: "/course/the-utility-first-workflow"
next: "The Utility-First Workflow"
downloadHd: https://player.vimeo.com/external/345586861.hd.mp4?s=1e060950c9a5ec015ddb76acb9147cee54e72816&profile_id=175&download=1
downloadSd: https://player.vimeo.com/external/345586861.sd.mp4?s=e1b8725aeaba9b085b2ec68aaefe1db51d85c322&profile_id=165&download=1
---

## Setting up Tailwind and PostCSS

First, create a `package.json` file and install `tailwindcss`, `postcss-cli`, and `autoprefixer`:

```sh
npm init -y
npm install tailwindcss postcss-cli autoprefixer
```

Then, generate a `tailwind.config.js` file:

```sh
npx tailwind init
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



