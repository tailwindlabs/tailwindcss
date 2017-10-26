<!DOCTYPE html>
<html lang="en" class="bg-white">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>{{ $page->title ? $page->title . ' - Tailwind CSS' : 'Tailwind CSS' }}</title>
        <style>
          @import url("https://use.typekit.net/iqy1okj.css");
        </style>
        {{-- <link rel="stylesheet" href="https://use.typekit.net/iqy1okj.css"> --}}
        <link rel="stylesheet" href="/css/main.css">
        <script type="text/javascript" src="/js/prism.js" defer=""></script>
    </head>
    <body class="font-sans font-normal text-slate-darker leading-normal">
        <div class="min-h-screen">
            <div class="fixed pin-y pin-l bg-smoke-light w-full max-w-xs flex-none overflow-y-scroll border-r-2 border-smoke">
                <div class="text-center border-b border-smoke p-8">
                    <svg class="h-8 mr-4" viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="0%" y1="0%" y2="100%" id="a"><stop stop-color="#2383AE" offset="0%"></stop><stop stop-color="#6DD7B9" offset="100%"></stop></linearGradient></defs><path d="M15 12c2-8 7-12 15-12 12 0 13.5 9 19.5 10.5 4 1 7.5-.5 10.5-4.5-2 8-7 12-15 12-12 0-13.5-9-19.5-10.5-4-1-7.5.5-10.5 4.5zM0 30c2-8 7-12 15-12 12 0 13.5 9 19.5 10.5 4 1 7.5-.5 10.5-4.5-2 8-7 12-15 12-12 0-13.5-9-19.5-10.5-4-1-7.5.5-10.5 4.5z" fill="url(#a)" fill-rule="evenodd"></path></svg>
                    {{-- <span class='text-xl font-semibold'>Tailwind CSS</span> --}}
                    {{-- <svg class="h-4" viewBox="0 0 136 19" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tailwind CSS"> --}}
                        {{-- <title>Tailwind CSS</title> --}}
                        {{-- <path d="M8.638 18h-3.01V3.645H.563V1.09H13.69v2.555H8.637V18zm8.456-2.004c1.652 0 2.976-1.1 2.976-2.6v-.95l-2.87.175c-1.407.095-2.216.728-2.216 1.712 0 1.02.844 1.664 2.11 1.664zm-.88 2.203c-2.4 0-4.148-1.512-4.148-3.75 0-2.204 1.7-3.528 4.723-3.716l3.28-.187v-.89c0-1.302-.88-2.052-2.32-2.052-1.383 0-2.262.668-2.45 1.7h-2.706c.13-2.32 2.11-3.985 5.273-3.985 3.082 0 5.086 1.63 5.086 4.125V18H20.14v-1.98h-.058c-.715 1.347-2.273 2.18-3.867 2.18zm9.153-.2h2.918V5.578h-2.918V18zM26.82 3.95c.914 0 1.63-.704 1.63-1.583 0-.89-.716-1.594-1.63-1.594-.902 0-1.617.704-1.617 1.594 0 .88.715 1.582 1.617 1.582zM30.816 18h2.918V1.09h-2.918V18zM53.07 5.578h-2.883l-2.097 9.54h-.07l-2.426-9.54h-2.8l-2.427 9.54h-.058l-2.1-9.54h-2.93L38.646 18h3.046l2.44-9.082h.057L46.638 18h3.07L53.07 5.578zM54.594 18h2.918V5.578h-2.918V18zm1.453-14.05c.914 0 1.63-.704 1.63-1.583 0-.89-.716-1.594-1.63-1.594-.902 0-1.617.704-1.617 1.594 0 .88.715 1.582 1.617 1.582zM59.96 18h2.92v-7.195c0-1.782 1.065-2.99 2.74-2.99 1.665 0 2.485.986 2.485 2.744V18h2.918V9.973c0-2.87-1.558-4.63-4.3-4.63-1.91 0-3.235.89-3.903 2.368h-.058V5.58h-2.8V18zm18.036.2c-3.13 0-5.156-2.473-5.156-6.423 0-3.925 2.027-6.41 5.156-6.41 1.78 0 3.188.926 3.844 2.297h.07V1.09h2.918V18h-2.86v-2.12h-.046c-.68 1.393-2.11 2.32-3.926 2.32zm.88-10.43c-1.876 0-3.048 1.558-3.048 4.02 0 2.472 1.16 4.02 3.047 4.02 1.84 0 3.047-1.56 3.047-4.02 0-2.438-1.207-4.02-3.047-4.02zm20.788 10.51c3.996 0 6.762-2.19 7.29-5.81h-2.966c-.468 2.038-2.074 3.245-4.312 3.245-2.93 0-4.78-2.38-4.78-6.176 0-3.774 1.862-6.165 4.768-6.165 2.19 0 3.914 1.395 4.313 3.516h2.976c-.375-3.632-3.363-6.08-7.29-6.08-4.804 0-7.862 3.338-7.862 8.73 0 5.425 3.036 8.74 7.864 8.74zm8.283-5.038c.13 3.117 2.683 5.04 6.574 5.04 4.09 0 6.67-2.016 6.67-5.227 0-2.52-1.454-3.938-4.888-4.723l-1.945-.445c-2.074-.492-2.93-1.15-2.93-2.274 0-1.406 1.29-2.343 3.2-2.343 1.933 0 3.257.95 3.398 2.53h2.883c-.07-2.976-2.53-4.99-6.258-4.99-3.68 0-6.293 2.026-6.293 5.026 0 2.414 1.477 3.914 4.594 4.63l2.192.514c2.133.504 3 1.207 3 2.426 0 1.406-1.418 2.414-3.457 2.414-2.062 0-3.62-1.02-3.808-2.578h-2.93zm14.424 0c.13 3.117 2.685 5.04 6.575 5.04 4.09 0 6.668-2.016 6.668-5.227 0-2.52-1.453-3.938-4.886-4.723l-1.946-.445c-2.073-.492-2.928-1.15-2.928-2.274 0-1.406 1.29-2.343 3.2-2.343 1.932 0 3.257.95 3.397 2.53h2.882c-.07-2.976-2.53-4.99-6.258-4.99-3.68 0-6.293 2.026-6.293 5.026 0 2.414 1.478 3.914 4.595 4.63l2.19.514c2.134.504 3 1.207 3 2.426 0 1.406-1.417 2.414-3.456 2.414-2.063 0-3.622-1.02-3.81-2.578h-2.93z" fill="#3A3F46" fill-rule="evenodd"></path> --}}
                    {{-- </svg> --}}
                </div>
                <div class="p-8">
                    <div class="relative mb-8">
                        <input class="rounded bg-white border border-smoke py-2 pr-4 pl-10 block w-full" type="text" placeholder="Search">
                        <div class="pointer-events-none absolute pin-y pin-l pl-3 flex items-center">
                            <svg class="pointer-events-none text-slate h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/></svg>
                        </div>
                    </div>
                    <nav class="text-base">
                        <div class="mb-8">
                            <p class="mb-4 text-slate-light uppercase tracking-wide font-bold text-xs">Introduction</p>
                            <ul>
                                <li class="mb-3"><a class="{{ $page->active('/what-is-tailwind') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/what-is-tailwind">What is Tailwind?</a></li>
                            </ul>
                        </div>
                        <div class="mb-8">
                            <p class="mb-4 text-slate-light uppercase tracking-wide font-bold text-xs">Getting Started</p>
                            <ul>
                                <li class="mb-3"><a class="{{ $page->active('/installation') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/installation">Installation</a></li>
                                <li class="mb-3">
                                    <a class="{{ $page->active('/workflow/configuration') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/workflow/configuration">
                                        Configuration
                                    </a>
                                </li>
                                <li class="mb-3">
                                    <a class="{{ $page->active('/workflow/color-palette') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/workflow/color-palette">
                                        Color Palette
                                    </a>
                                </li>
                                <li class="mb-3">
                                    <a class="{{ $page->active('/workflow/responsive-design') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/workflow/responsive-design">
                                        Responsive Design
                                    </a>
                                </li>
                                <li class="mb-3">
                                    <a class="{{ $page->active('/workflow/adding-new-utilities') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/workflow/adding-new-utilities">
                                        Adding New Utilities
                                    </a>
                                </li>
                                <li class="mb-3">
                                    <a class="{{ $page->active('/workflow/extracting-components') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/workflow/extracting-components">
                                        Extracting Components
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="mt-8">
                            <p class="mb-4 text-slate-light uppercase tracking-wide font-bold text-xs">Styles</p>
                            <ul class="mb-8">
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/base" class="{{ $page->active('/styles/base') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Base</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/alignment" class="{{ $page->active('/styles/alignment') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Alignment</a></li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/styles/backgrounds/color" class="block mb-2 {{ $page->active('/styles/backgrounds/') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Backgrounds</a>
                                    <ul class="pl-4 {{ $page->active('/styles/backgrounds/') ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/backgrounds/color" class="{{ $page->active('/backgrounds/color') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Color</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/backgrounds/position" class="{{ $page->active('/backgrounds/position') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Position</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/backgrounds/size" class="{{ $page->active('/backgrounds/size') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Size</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/styles/borders/base" class="block mb-2 {{ $page->active('/styles/borders/') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Borders</a>
                                    <ul class="pl-4 {{ $page->active('/styles/borders/') ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/borders/base" class="{{ $page->active('/borders/base') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Base</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/borders/color" class="{{ $page->active('/borders/color') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Color</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/borders/style" class="{{ $page->active('/borders/style') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Style</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/borders/radius" class="{{ $page->active('/borders/radius') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Radius</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/buttons" class="{{ $page->active('/styles/buttons') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Buttons</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/container" class="{{ $page->active('/styles/container') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Container</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/display" class="{{ $page->active('/styles/display') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Display</a></li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/styles/flexbox/display" class="block mb-2 {{ $page->active('/styles/flexbox/') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Flexbox</a>
                                    <ul class="pl-4 {{ $page->active('/styles/flexbox/') ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/flexbox/display" class="{{ $page->active('/styles/flexbox/display') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Display</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/flexbox/direction" class="{{ $page->active('/styles/flexbox/direction') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Direction</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/flexbox/wrapping" class="{{ $page->active('/styles/flexbox/wrapping') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Wrapping</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/flexbox/justify-content" class="{{ $page->active('/styles/flexbox/justify-content') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Justify Content</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/flexbox/align-items" class="{{ $page->active('/styles/flexbox/align-items') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Align Items</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/flexbox/align-content" class="{{ $page->active('/styles/flexbox/align-content') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Align Content</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/flexbox/align-self" class="{{ $page->active('/styles/flexbox/align-self') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Align Self</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/flexbox/flex-grow-shrink" class="{{ $page->active('/styles/flexbox/flex-grow-shrink') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Flex, Grow, &amp; Shrink</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/floats" class="{{ $page->active('/styles/floats') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Floats</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/forms" class="{{ $page->active('/styles/forms') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Forms</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/grid" class="{{ $page->active('/styles/grid') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Grid</a></li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/styles/interactivity/cursor" class="block mb-2 {{ $page->active('/styles/interactivity/') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Interactivity</a>
                                    <ul class="pl-4 {{ $page->active('/styles/interactivity/') ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/interactivity/cursor" class="{{ $page->active('/interactivity/cursor') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Cursor</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/interactivity/resize" class="{{ $page->active('/interactivity/resize') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Resize</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/interactivity/pointer-events" class="{{ $page->active('/interactivity/pointer-events') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Pointer Events</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/interactivity/user-select" class="{{ $page->active('/interactivity/user-select') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">User Select</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/lists" class="{{ $page->active('/styles/lists') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Lists</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/opacity" class="{{ $page->active('/styles/opacity') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Opacity</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/overflow" class="{{ $page->active('/styles/overflow') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Overflow</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/positioning" class="{{ $page->active('/styles/positioning') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Positioning</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/shadows" class="{{ $page->active('/styles/shadows') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Shadows</a></li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/styles/sizing/width" class="block mb-2 {{ $page->active('/styles/sizing/') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Sizing</a>
                                    <ul class="pl-4 {{ $page->active('/styles/sizing/') ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/sizing/width" class="{{ $page->active('/sizing/width') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Width</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/sizing/min-width" class="{{ $page->active('/sizing/min-width') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Min-Width</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/sizing/max-width" class="{{ $page->active('/sizing/max-width') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Max-Width</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/sizing/height" class="{{ $page->active('/sizing/height') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Height</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/sizing/min-height" class="{{ $page->active('/sizing/min-height') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Min-Height</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/sizing/max-height" class="{{ $page->active('/sizing/max-height') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Max-Height</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/styles/spacing/padding" class="block mb-2 {{ $page->active('/styles/spacing/') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Spacing</a>
                                    <ul class="pl-4 {{ $page->active('/styles/spacing/') ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/spacing/padding" class="{{ $page->active('/spacing/padding') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Padding</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/spacing/margin" class="{{ $page->active('/spacing/margin') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Margin</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/spacing/negative-margin" class="{{ $page->active('/spacing/negative-margin') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Negative Margin</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/svg" class="{{ $page->active('/styles/svg') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">SVG</a></li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/styles/text/fonts" class="block mb-2 {{ $page->active('/styles/text/') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Typography</a>
                                    <ul class="pl-4 {{ $page->active('/styles/text/') ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/text/fonts" class="{{ $page->active('/text/fonts') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Fonts</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/text/color" class="{{ $page->active('/text/color') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Color</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/text/sizing" class="{{ $page->active('/text/sizing') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Sizing</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/text/weight" class="{{ $page->active('/text/weight') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Weight</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/text/line-height" class="{{ $page->active('/text/line-height') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Line Height</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/text/letter-spacing" class="{{ $page->active('/text/letter-spacing') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Letter Spacing</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/text/wrapping" class="{{ $page->active('/text/wrapping') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Wrapping</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/text/style" class="{{ $page->active('/text/style') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Style &amp; Decoration</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/visibility" class="{{ $page->active('/styles/visibility') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Visibility</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/styles/z-index" class="{{ $page->active('/styles/z-index') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Z-Index</a></li>
                            </ul>
                        </div>
                        <div class="mb-8">
                            <p class="mb-4 text-slate-light uppercase tracking-wide font-bold text-xs">Examples</p>
                            <ul>
                                <li class="mb-3"><a class="{{ $page->active('/examples/alerts') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/examples/alerts">Alerts</a></li>
                                <li class="mb-3"><a class="{{ $page->active('/examples/cards') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/examples/cards">Cards</a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
            <div class="ml-80">
                <div class="px-6 py-8 w-full max-w-lg mx-auto">
                    @yield('body')
                </div>
            </div>
        </div>
    </body>
</html>
