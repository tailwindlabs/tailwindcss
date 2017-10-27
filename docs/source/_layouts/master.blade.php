<!DOCTYPE html>
<html lang="en" class="bg-white antialiased">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        @if (isset($title))
        <title>{{ $title . ' - Tailwind CSS' }}</title>
        @else
        <title>{{ $page->title ? $page->title . ' - Tailwind CSS' : 'Tailwind CSS' }}</title>
        @endif
        <style>
          @import url("https://use.typekit.net/iqy1okj.css");
        </style>
        {{-- <link rel="stylesheet" href="https://use.typekit.net/iqy1okj.css"> --}}
        <link rel="stylesheet" href="/css/main.css">
        <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
        <script src="/js/nav.js"></script>

    </head>
    <body class="font-sans font-normal text-slate-darker leading-normal">
        <div class="min-h-screen">
            <div class="fixed pin-y pin-l bg-smoke-light w-full max-w-xs flex-none border-r-2 border-smoke flex flex-col">
                <div class="border-b border-smoke flex-none p-8">
                    <div class="text-center mb-8">
                        <a href="/" class="inline-block">
                            <svg class="h-8" viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="0%" y1="0%" y2="100%" id="a"><stop stop-color="#2383AE" offset="0%"></stop><stop stop-color="#6DD7B9" offset="100%"></stop></linearGradient></defs><path d="M15 12c2-8 7-12 15-12 12 0 13.5 9 19.5 10.5 4 1 7.5-.5 10.5-4.5-2 8-7 12-15 12-12 0-13.5-9-19.5-10.5-4-1-7.5.5-10.5 4.5zM0 30c2-8 7-12 15-12 12 0 13.5 9 19.5 10.5 4 1 7.5-.5 10.5-4.5-2 8-7 12-15 12-12 0-13.5-9-19.5-10.5-4-1-7.5.5-10.5 4.5z" fill="url(#a)" fill-rule="evenodd"></path></svg>
                        </a>
                    </div>
                    <div class="relative">
                        <input class="rounded bg-white border border-smoke py-2 pr-4 pl-10 block w-full" type="text" placeholder="Search">
                        <div class="pointer-events-none absolute pin-y pin-l pl-3 flex items-center">
                            <svg class="pointer-events-none text-slate h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/></svg>
                        </div>
                    </div>
                </div>
                <div class="p-8 flex-1 overflow-y-scroll">
                    <nav id="nav" class="text-base overflow-y-scroll">
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
                <div id="content" class="px-6 py-8 w-full max-w-xl mx-auto">
                    <div id="app">
                        @yield('body')
                    </div>
                    <script src="/js/app.js"></script>
                    <script src="/js/prism.js"></script>
                    <script>
                        anchors.options = { placement: 'left', class: 'text-slate-light' };
                        anchors.add();
                    </script>
                </div>
            </div>
        </div>
    </body>
</html>
