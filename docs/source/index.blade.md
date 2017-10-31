---
extends: _layouts.master
---

@section('body')

<div class="min-h-screen bg-pattern bg-center bg-smoke-light border-t-6 border-tailwind-teal flex items-center justify-center leading-tight p-6 pb-16">
    <div>
        <svg class="mx-auto block" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="145" height="123" viewBox="0 0 145 123">
            <defs>
                <circle id="b" cx="73" cy="40" r="40"></circle>
                <filter id="a" width="117.5%" height="117.5%" x="-8.8%" y="-6.2%" filterUnits="objectBoundingBox">
                    <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2"></feGaussianBlur>
                    <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
                </filter>
                <linearGradient id="c" x1="0%" y1="0%" y2="100%">
                    <stop offset="0%" stop-color="#2383AE"></stop>
                    <stop offset="100%" stop-color="#6DD7B9"></stop>
                </linearGradient>
            </defs>
            <g fill="none" fill-rule="evenodd" transform="translate(0 2)">
                <use fill="black" filter="url(#a)" xlink:href="#b"></use>
                <use fill="#FFFFFF" xlink:href="#b"></use>
                <path fill="url(#c)" d="M58.6 33.92C60.52 26.24 65.32 22.4 73 22.4c11.52 0 12.96 8.64 18.72 10.08 3.84.96 7.2-.48 10.08-4.32-1.92 7.68-6.72 11.52-14.4 11.52-11.52 0-12.96-8.64-18.72-10.08-3.84-.96-7.2.48-10.08 4.32zM44.2 51.2c1.92-7.68 6.72-11.52 14.4-11.52 11.52 0 12.96 8.64 18.72 10.08 3.84.96 7.2-.48 10.08-4.32-1.92 7.68-6.72 11.52-14.4 11.52-11.52 0-12.96-8.64-18.72-10.08-3.84-.96-7.2.48-10.08 4.32z"></path>
                <path fill="#222B2F" d="M5.28 120v-13H.6v-3h12.77v3H8.72v13H5.28zm15.7 0v-1.2a4.8 4.8 0 0 1-3.68 1.49c-1.85 0-4.03-1.25-4.03-3.84 0-2.71 2.18-3.7 4.03-3.7 1.54 0 2.9.48 3.67 1.42v-1.61c0-1.18-1-1.94-2.54-1.94-1.25 0-2.4.45-3.39 1.36l-1.15-2.04a7.6 7.6 0 0 1 5.07-1.82c2.64 0 5.06 1.06 5.06 4.4V120h-3.05zm0-2.78v-1.44c-.51-.68-1.47-1.01-2.46-1.01-1.2 0-2.18.65-2.18 1.75 0 1.08.98 1.7 2.18 1.7.99 0 1.95-.33 2.45-1zm7.98-10.52c-.99 0-1.83-.81-1.83-1.82a1.82 1.82 0 1 1 1.82 1.82zM27.44 120v-11.6h3.05V120h-3.05zm6.48 0v-16h3.04v16h-3.04zm16.64 0l-2.44-7.9-2.45 7.9H42.4l-3.52-11.6h3.16l2.16 7.8 2.55-7.8h2.71l2.54 7.8 2.16-7.8h3.17L53.8 120h-3.24zm10.2-13.3c-.99 0-1.83-.81-1.83-1.82a1.82 1.82 0 1 1 1.82 1.82zM59.24 120v-11.6h3.05V120h-3.05zm14.3 0v-7c0-1.62-.84-2.17-2.14-2.17a3.3 3.3 0 0 0-2.64 1.37v7.8h-3.04v-11.6h3.04v1.52a5.3 5.3 0 0 1 4.06-1.8c2.54 0 3.77 1.44 3.77 3.7V120h-3.05zm14.44 0v-1.46a4.55 4.55 0 0 1-3.58 1.75c-2.92 0-5.13-2.21-5.13-6.07 0-3.8 2.18-6.1 5.13-6.1 1.37 0 2.67.6 3.58 1.78V104h3.07v16h-3.07zm0-3.74v-4.1a3.35 3.35 0 0 0-2.64-1.33c-1.73 0-2.93 1.37-2.93 3.39 0 1.99 1.2 3.36 2.93 3.36 1.03 0 2.11-.56 2.64-1.32zm20.74 4.03c-4.68 0-8.4-3.36-8.4-8.28s3.72-8.28 8.4-8.28a7.39 7.39 0 0 1 6.82 3.91l-2.93 1.44a4.38 4.38 0 0 0-3.89-2.33c-2.78 0-4.9 2.23-4.9 5.26 0 3.02 2.12 5.25 4.9 5.25 1.78 0 3.22-1 3.9-2.32l2.92 1.41a7.43 7.43 0 0 1-6.82 3.94zm8.16-2.55l1.87-2.59a7.02 7.02 0 0 0 5.09 2.16c1.87 0 2.78-.89 2.78-1.8 0-1.2-1.4-1.6-3.24-2.04-2.62-.6-5.98-1.32-5.98-4.9 0-2.66 2.3-4.82 6.08-4.82a8.9 8.9 0 0 1 6.24 2.23l-1.9 2.5a6.83 6.83 0 0 0-4.58-1.75c-1.54 0-2.36.67-2.36 1.63 0 1.08 1.35 1.42 3.2 1.85 2.64.6 6 1.39 6 4.94 0 2.93-2.1 5.14-6.41 5.14-3.07 0-5.28-1.03-6.8-2.55zm14.8 0l1.87-2.59a7.02 7.02 0 0 0 5.09 2.16c1.87 0 2.78-.89 2.78-1.8 0-1.2-1.4-1.6-3.24-2.04-2.62-.6-5.98-1.32-5.98-4.9 0-2.66 2.3-4.82 6.08-4.82a8.9 8.9 0 0 1 6.24 2.23l-1.9 2.5a6.83 6.83 0 0 0-4.58-1.75c-1.54 0-2.36.67-2.36 1.63 0 1.08 1.35 1.42 3.2 1.85 2.64.6 6 1.39 6 4.94 0 2.93-2.1 5.14-6.41 5.14-3.07 0-5.28-1.03-6.8-2.55z"></path>
            </g>
        </svg>
        <h1 class="mt-12 font-normal text-4xl text-center">A Utility-First CSS Framework<br class="hidden sm:inline-block"> for Rapid UI Development</h1>
        <div class="mt-12 flex justify-center leading-none">
            <a class="rounded-full font-semibold block px-12 py-3 border-2 border-tailwind-teal hover:border-orange hover:bg-orange text-white bg-tailwind-teal " href="/docs/installation">Get Started</a>
            <a class="rounded-full font-semibold block px-12 py-3 border-2 border-tailwind-teal hover:border-orange hover:text-orange text-tailwind-teal ml-4" href="https://github.com/tailwindcss/tailwindcss">GitHub</a>
        </div>
    </div>
</div>

<div class="px-6">
    <div class="my-12 text-center uppercase">
        <span class="inline-block bg-soft px-4 text-medium text-grey-darker tracking-wide">A project by</span>
    </div>
    <div class="flex justify-center">
        <div class="pb-4 flex justify-center flex-wrap max-w-md xl:max-w-full border-b-2 border-grey-light">
            <div class="mb-8 w-64 md:flex-x-center">
                <div class="flex items-center">
                    <img class="h-16 w-16 rounded-full" src="https://pbs.twimg.com/profile_images/887661330832003072/Zp6rA_e2_400x400.jpg" alt="">
                    <div class="pl-4">
                        <a href="https://twitter.com/adamwathan" class="block hover:underline text-dark text-lg text-medium">Adam Wathan</a>
                        <a href="https://twitter.com/adamwathan" class="block hover:underline text-tailwind-teal-dark text-sm">@adamwathan</a>
                    </div>
                </div>
            </div>
            <div class="mb-8 w-64 md:flex-x-center">
                <div class="flex items-center">
                    <img class="h-16 w-16 rounded-full" src="https://pbs.twimg.com/profile_images/885868801232961537/b1F6H4KC_400x400.jpg" alt="">
                    <div class="pl-4">
                        <a href="https://twitter.com/reinink" class="block hover:underline text-dark text-lg text-medium">Jonathan Reinink</a>
                        <a href="https://twitter.com/reinink" class="block hover:underline text-tailwind-teal-dark text-sm">@reinink</a>
                    </div>
                </div>
            </div>
            <div class="mb-8 w-64 md:flex-x-center">
                <div class="flex items-center">
                    <img class="h-16 w-16 rounded-full" src="https://pbs.twimg.com/profile_images/892478120829239296/U1KUwGJO_400x400.jpg">
                    <div class="pl-4">
                        <a href="https://twitter.com/davidhemphill" class="block hover:underline text-dark text-lg text-medium">David Hemphill</a>
                        <a href="https://twitter.com/davidhemphill" class="block hover:underline text-tailwind-teal-dark text-sm">@davidhemphill</a>
                    </div>
                </div>
            </div>
            <div class="mb-8 w-64 md:flex-x-center">
                <div class="flex items-center">
                    <img class="h-16 w-16 rounded-full" src="https://pbs.twimg.com/profile_images/875010472105222144/Pkt9zqPY_400x400.jpg" alt="">
                    <div class="pl-4">
                        <a href="https://twitter.com/steveschoger" class="block hover:underline text-dark text-lg text-medium">Steve Schoger</a>
                        <a href="https://twitter.com/steveschoger" class="block hover:underline text-tailwind-teal-dark text-sm">@steveschoger</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-10 mb-16 mx-auto flex justify-center text-grey-darker">
        <div>Version 0.1.0 - Alpha</div>
        <a class="block ml-6 sm:ml-12 flex items-center hover:text-orange" href="https://github.com/tailwindcss/tailwindcss">
            <svg class="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0"/></svg>
            <span class="ml-2">GitHub</span>
        </a>
        <a class="block ml-6 sm:ml-12 flex items-center hover:text-orange" href="https://twitter.com/tailwindcss">
            <svg class="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6.29 18.25c7.55 0 11.67-6.25 11.67-11.67v-.53c.8-.59 1.49-1.3 2.04-2.13-.75.33-1.54.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27c-.8.48-1.68.81-2.6 1a4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.3 4.1 4.1 0 0 0 1.27 5.49C2.01 8.2 1.37 8.03.8 7.7v.05a4.1 4.1 0 0 0 3.3 4.03 4.1 4.1 0 0 1-1.86.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 0 16.4a11.62 11.62 0 0 0 6.29 1.84"/></svg>
            <span class="ml-2">Twitter</span>
        </a>
    </div>

</div>

@endsection
