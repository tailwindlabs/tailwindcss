<!DOCTYPE html>
<html lang="en" class="bg-white antialiased">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/manifest.json">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00b4b6">
        <meta name="theme-color" content="#ffffff">
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
                                    <a class="{{ $page->active('/configuration') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/configuration">
                                        Configuration
                                    </a>
                                </li>
                                <li class="mb-3">
                                    <a class="{{ $page->active('/colors') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/colors">
                                        Colors
                                    </a>
                                </li>
                                <li class="mb-3">
                                    <a class="{{ $page->active('/responsive-design') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/responsive-design">
                                        Responsive Design
                                    </a>
                                </li>
                                <li class="mb-3">
                                    <a class="{{ $page->active('/adding-new-utilities') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/adding-new-utilities">
                                        Adding New Utilities
                                    </a>
                                </li>
                                <li class="mb-3">
                                    <a class="{{ $page->active('/extracting-components') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/extracting-components">
                                        Extracting Components
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="mt-8">
                            <p class="mb-4 text-slate-light uppercase tracking-wide font-bold text-xs">Styles</p>
                            <ul class="mb-8">
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/base" class="{{ $page->active('/base') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Base</a></li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/background-color" class="block mb-2 {{ $page->active('/background-') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Backgrounds</a>
                                    <ul class="pl-4 {{ $page->active('/background-') ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/background-color" class="{{ $page->active('/background-color') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Color</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/background-position" class="{{ $page->active('/background-position') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Position</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/background-size" class="{{ $page->active('/background-size') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Size</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/border-size" class="block mb-2 {{ $page->active('/border-') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Borders</a>
                                    <ul class="pl-4 {{ $page->active('/border-') ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/border-size" class="{{ $page->active('/border-size') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Size</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/border-color" class="{{ $page->active('/border-color') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Color</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/border-style" class="{{ $page->active('/border-style') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Style</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/border-radius" class="{{ $page->active('/border-radius') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Radius</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/buttons" class="{{ $page->active('/buttons') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Buttons</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/container" class="{{ $page->active('/container') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Container</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/display" class="{{ $page->active('/display') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Display</a></li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/flexbox-display" class="block mb-2 {{ $page->active('/flexbox-') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Flexbox</a>
                                    <ul class="pl-4 {{ $page->active('/flexbox-') ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/flexbox-display" class="{{ $page->active('/flexbox-display') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Display</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/flexbox-direction" class="{{ $page->active('/flexbox-direction') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Direction</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/flexbox-wrapping" class="{{ $page->active('/flexbox-wrapping') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Wrapping</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/flexbox-justify-content" class="{{ $page->active('/flexbox-justify-content') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Justify Content</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/flexbox-align-items" class="{{ $page->active('/flexbox-align-items') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Align Items</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/flexbox-align-content" class="{{ $page->active('/flexbox-align-content') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Align Content</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/flexbox-align-self" class="{{ $page->active('/flexbox-align-self') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Align Self</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/flexbox-flex-grow-shrink" class="{{ $page->active('/flexbox-flex-grow-shrink') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Flex, Grow, &amp; Shrink</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/floats" class="{{ $page->active('/floats') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Floats</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/forms" class="{{ $page->active('/forms') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Forms</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/grid" class="{{ $page->active('/grid') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Grid</a></li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/cursor" class="block mb-2 {{ $page->active(['/cursor', '/resize', '/pointer-events', '/user-select']) ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Interactivity</a>
                                    <ul class="pl-4 {{ $page->active(['/cursor', '/resize', '/pointer-events', '/user-select']) ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/cursor" class="{{ $page->active('/cursor') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Cursor</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/resize" class="{{ $page->active('/resize') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Resize</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/pointer-events" class="{{ $page->active('/pointer-events') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Pointer Events</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/user-select" class="{{ $page->active('/user-select') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">User Select</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/lists" class="{{ $page->active('/lists') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Lists</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/opacity" class="{{ $page->active('/opacity') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Opacity</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/overflow" class="{{ $page->active('/overflow') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Overflow</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/positioning" class="{{ $page->active('/positioning') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Positioning</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/shadows" class="{{ $page->active('/shadows') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Shadows</a></li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/width" class="block mb-2 {{ $page->active(['/width', '/min-width', '/max-width', '/height', '/min-height', '/max-height']) ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Sizing</a>
                                    <ul class="pl-4 {{ $page->active(['/width', '/min-width', '/max-width', '/height', '/min-height', '/max-height']) ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/width" class="{{ $page->active('/width') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Width</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/min-width" class="{{ $page->active('/min-width') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Min-Width</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/max-width" class="{{ $page->active('/max-width') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Max-Width</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/height" class="{{ $page->active('/height') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Height</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/min-height" class="{{ $page->active('/min-height') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Min-Height</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/max-height" class="{{ $page->active('/max-height') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Max-Height</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/padding" class="block mb-2 {{ $page->active(['/padding', '/margin', '/negative-margin']) ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Spacing</a>
                                    <ul class="pl-4 {{ $page->active(['/padding', '/margin', '/negative-margin']) ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/padding" class="{{ $page->active('/padding') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Padding</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/margin" class="{{ $page->active('/margin') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Margin</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/negative-margin" class="{{ $page->active('/negative-margin') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Negative Margin</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/svg" class="{{ $page->active('/svg') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">SVG</a></li>
                                <li class="mb-3">
                                    <a href="{{ $page->baseUrl }}/fonts" class="block mb-2 {{ $page->active(['/fonts', '/text-color', '/text-sizing', '/font-weight', '/leading', '/tracking', '/whitespace', '/text-style']) ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Typography</a>
                                    <ul class="pl-4 {{ $page->active(['/fonts', '/text-color', '/text-sizing', '/font-weight', '/leading', '/tracking', '/whitespace', '/text-style']) ? 'block' : 'hidden' }}">
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/fonts" class="{{ $page->active('/fonts') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Fonts</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/text-color" class="{{ $page->active('/text-color') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Color</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/text-sizing" class="{{ $page->active('/text-sizing') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Sizing</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/font-weight" class="{{ $page->active('/font-weight') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Weight</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/leading" class="{{ $page->active('/leading') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Leading</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/tracking" class="{{ $page->active('/tracking') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Tracking</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/whitespace" class="{{ $page->active('/whitespace') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Whitespace</a></li>
                                        <li class="mb-3"><a href="{{ $page->baseUrl }}/text-style" class="{{ $page->active('/text-style') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Style &amp; Decoration</a></li>
                                    </ul>
                                </li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/vertical-alignment" class="{{ $page->active('/vertical-alignment') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Vertical Alignment</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/visibility" class="{{ $page->active('/visibility') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Visibility</a></li>
                                <li class="mb-3"><a href="{{ $page->baseUrl }}/z-index" class="{{ $page->active('/z-index') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Z-Index</a></li>
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
