---
extends: _layouts.documentation
title: "Browser Support"
description: "Understanding how to think about browser support with a utility-first framework."
titleBorder: true
---

Coming soon.

In a nutshell:

- Core features generally target IE11 + evergreen browsers, although some non-IE11 features have snuck in like object-fit/position and position: sticky.
- Can use with < IE11 too, just don't use unsupported features — easy because utilities target single properties. Can't use flex? Don't use flex.
- We don't autoprefix anything, use autoprefixer. Easy because if you're using Tailwind you should already have PostCSS set up anyways, and literally every app framework already has autoprefixer bundled.
