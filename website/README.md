# TailwindUniverse

A beautiful multi-framework landing page that unifies the **kariitsme** ecosystem under one Tailwind CSS design language:

| Frontend | Meta / Tooling | Backend |
| --- | --- | --- |
| [React](https://github.com/kariitsme/react) | [Vite](https://github.com/kariitsme/vite) | [Express](https://github.com/kariitsme/express) |
| [Next.js](https://github.com/kariitsme/next.js) | [Bootstrap](https://github.com/kariitsme/bootstrap) | [Django](https://github.com/kariitsme/django) |
| [Vue](https://github.com/kariitsme/vue) | [Tailwind CSS](https://github.com/kariitsme/tailwindcss) | [Flask](https://github.com/kariitsme/flask) |
| [Nuxt](https://github.com/kariitsme/nuxt) | | |
| [Svelte](https://github.com/kariitsme/svelte) | | |
| [Astro](https://github.com/kariitsme/astro) | | |

## Preview

```bash
# From the repo root
python3 -m http.server 8765 --directory website
# open http://127.0.0.1:8765
```

Or open `website/index.html` directly in a browser (uses the Tailwind CDN for zero-build preview).

## Related playgrounds

The same design system is also mirrored in the monorepo playgrounds:

- `playgrounds/vite` — full interactive React + Vite + `@tailwindcss/vite` experience
- `playgrounds/nextjs` — Next.js App Router surface with `@tailwindcss/postcss`
- `playgrounds/v3` — refined Tailwind v3 comparison surface
