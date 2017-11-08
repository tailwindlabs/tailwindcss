@extends('_layouts.master')

@section('meta')
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@tailwindcss">
<meta name="twitter:title" content="{{ $page->title ? $page->title . ' - Tailwind CSS' : 'Tailwind CSS - A Utility-First CSS Framework for Rapid UI Development' }}">
<meta name="twitter:description" content="{{ $page->description ? $page->description : 'Documentation for the Tailwind CSS framework.' }}">
<meta name="twitter:image" content="https://tailwindcss.com/img/tailwind-square.png">
<meta name="twitter:creator" content="@tailwindcss">
@endsection

@section('body')
<div class="min-h-screen">
    <div id="sidebar" class="hidden z-50 fixed pin-y pin-l overflow-y-scroll scrolling-touch bg-smoke-light w-4/5 md:w-full md:max-w-xs flex-none border-r-2 border-smoke md:flex flex-col">
        <div class="border-b border-smoke flex-none px-8 py-6">
            <div class="mb-4">
                <div class="hidden md:flex md:justify-center">
                    <a href="/" class="flex justify-center">
                        <svg class="w-16 h-16 mx-auto block" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 11.1C15.3 3.9 19.8.3 27 .3c10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 27.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" transform="translate(5 16)" fill="url(#logoGradient)" fill-rule="evenodd"/></svg>
                    </a>
                </div>
                <p class="text-center">
                    <a href="https://github.com/tailwindcss/tailwindcss/releases" class="text-sm hover:text-grey-dark text-grey font-semibold">v{{ $page->version }}</a>
                </p>
            </div>
            <div class="relative opacity-75">
                <input class="rounded bg-white border border-smoke py-2 pr-4 pl-10 block w-full cursor-not-allowed" type="text" placeholder="Search coming soon!" disabled>
                <div class="pointer-events-none absolute pin-y pin-l pl-3 flex items-center">
                    <svg class="pointer-events-none text-slate w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/></svg>
                </div>
            </div>
        </div>
        <div class="p-8 flex-1 overflow-y-scroll">
            <nav id="nav" class="text-base overflow-y-scroll">
                <div class="mb-8">
                    <p class="mb-4 text-slate-light uppercase tracking-wide font-bold text-xs">Introduction</p>
                    <ul>
                        <li class="mb-3"><a class="hover:underline {{ $page->active('/docs/what-is-tailwind') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/docs/what-is-tailwind">What is Tailwind?</a></li>
                    </ul>
                </div>
                <div class="mb-8">
                    <p class="mb-4 text-slate-light uppercase tracking-wide font-bold text-xs">Getting Started</p>
                    <ul>
                    @include('_partials.nav-links', ['links' => [
                        'installation' => 'Installation',
                        'configuration' => 'Configuration',
                        'colors' => 'Colors',
                        'responsive-design' => 'Responsive Design',
                        'adding-new-utilities' => 'Adding New Utilities',
                        'extracting-components' => 'Extracting Components',
                        'functions-and-directives' => 'Functions &amp; Directives'
                    ]])
                    </ul>
                </div>
                <div class="mt-8">
                    <p class="mb-4 text-slate-light uppercase tracking-wide font-bold text-xs">Styles</p>
                    <ul class="mb-8">
                        <li class="mb-3">
                            <a href="{{ $page->baseUrl }}/docs/background-color" class="hover:underline block mb-2 {{ $page->active('/docs/background-') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Backgrounds</a>
                            <ul class="pl-4 {{ $page->active('/docs/background-') ? 'block' : 'hidden' }}">
                            @include('_partials.nav-links', ['links' => [
                                'background-color' => 'Color',
                                'background-position' => 'Position',
                                'background-size' => 'Size',
                            ]])
                            </ul>
                        </li>
                        <li class="mb-3">
                            <a href="{{ $page->baseUrl }}/docs/border-width" class="hover:underline block mb-2 {{ $page->active(['/docs/border-width', '/docs/border-color', '/docs/border-style']) ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Borders</a>
                            <ul class="pl-4 {{ $page->active(['/docs/border-width', '/docs/border-color', '/docs/border-style']) ? 'block' : 'hidden' }}">
                            @include('_partials.nav-links', ['links' => [
                                'border-width' => 'Width',
                                'border-color' => 'Color',
                                'border-style' => 'Style',
                            ]])
                            </ul>
                        </li>
                        @include('_partials.nav-links', ['links' => [
                            'border-radius' => 'Border Radius',
                            'container' => 'Container',
                            'display' => 'Display',
                        ]])
                        <li class="mb-3">
                            <a href="{{ $page->baseUrl }}/docs/flexbox-display" class="hover:underline block mb-2 {{ $page->active('/docs/flexbox-') ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Flexbox</a>
                            <ul class="pl-4 {{ $page->active('/docs/flexbox-') ? 'block' : 'hidden' }}">
                            @include('_partials.nav-links', ['links' => [
                                'flexbox-display' => 'Display',
                                'flexbox-direction' => 'Direction',
                                'flexbox-wrapping' => 'Wrapping',
                                'flexbox-justify-content' => 'Justify Content',
                                'flexbox-align-items' => 'Align Items',
                                'flexbox-align-content' => 'Align Content',
                                'flexbox-align-self' => 'Align Self',
                                'flexbox-flex-grow-shrink' => 'Flex, Grow, &amp; Shrink',
                            ]])
                            </ul>
                        </li>
                        @include('_partials.nav-links', ['links' => [
                            'floats' => 'Floats',
                            'forms' => 'Forms',
                            'grid' => 'Grid',
                        ]])
                        <li class="mb-3">
                            <a href="{{ $page->baseUrl }}/docs/cursor" class="hover:underline block mb-2 {{ $page->active(['/docs/cursor', '/docs/resize', '/docs/pointer-events', '/docs/user-select']) ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Interactivity</a>
                            <ul class="pl-4 {{ $page->active(['/docs/cursor', '/docs/resize', '/docs/pointer-events', '/docs/user-select']) ? 'block' : 'hidden' }}">
                            @include('_partials.nav-links', ['links' => [
                                'cursor' => 'Cursor',
                                'resize' => 'Resize',
                                'pointer-events' => 'Pointer Events',
                                'user-select' => 'User Select',
                            ]])
                            </ul>
                        </li>
                        @include('_partials.nav-links', ['links' => [
                            'lists' => 'Lists',
                            'opacity' => 'Opacity',
                            'overflow' => 'Overflow',
                            'positioning' => 'Positioning',
                            'shadows' => 'Shadows',
                        ]])
                        <li class="mb-3">
                            <a href="{{ $page->baseUrl }}/docs/width" class="hover:underline block mb-2 {{ $page->active(['/docs/width', '/docs/min-width', '/docs/max-width', '/docs/height', '/docs/min-height', '/docs/max-height']) ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Sizing</a>
                            <ul class="pl-4 {{ $page->active(['/docs/width', '/docs/min-width', '/docs/max-width', '/docs/height', '/docs/min-height', '/docs/max-height']) ? 'block' : 'hidden' }}">
                            @include('_partials.nav-links', ['links' => [
                                'width' => 'Width',
                                'min-width' => 'Min-Width',
                                'max-width' => 'Max-Width',
                                'height' => 'Height',
                                'min-height' => 'Min-Height',
                                'max-height' => 'Max-Height',
                            ]])
                            </ul>
                        </li>
                        @include('_partials.nav-links', ['links' => [
                            'spacing' => 'Spacing',
                            'svg' => 'SVG',
                        ]])
                        <li class="mb-3">
                            <a href="{{ $page->baseUrl }}/docs/fonts" class="hover:underline block mb-2 {{ $page->active(['/docs/fonts', '/docs/text-color', '/docs/text-sizing', '/docs/font-weight', '/docs/text-alignment',  '/docs/line-height', '/docs/letter-spacing', '/docs/whitespace-and-wrapping', '/docs/text-style']) ? 'text-slate-darker font-bold' : 'text-slate-dark' }}">Typography</a>
                            <ul class="pl-4 {{ $page->active(['/docs/fonts', '/docs/text-color', '/docs/text-sizing', '/docs/font-weight', '/docs/text-alignment',  '/docs/line-height', '/docs/letter-spacing', '/docs/whitespace-and-wrapping', '/docs/text-style']) ? 'block' : 'hidden' }}">
                            @include('_partials.nav-links', ['links' => [
                                'fonts' => 'Fonts',
                                'text-color' => 'Color',
                                'text-sizing' => 'Sizing',
                                'font-weight' => 'Weight',
                                'text-alignment' => 'Alignment',
                                'line-height' => 'Line Height',
                                'letter-spacing' => 'Letter Spacing',
                                'text-style' => 'Style &amp; Decoration',
                                'whitespace-and-wrapping' => 'Whitespace &amp; Wrapping',
                            ]])
                            </ul>
                        </li>
                        @include('_partials.nav-links', ['links' => [
                            'vertical-alignment' => 'Vertical Alignment',
                            'visibility' => 'Visibility',
                            'z-index' => 'Z-Index',
                        ]])
                    </ul>
                </div>
                <div class="mb-8">
                    <p class="mb-4 text-slate-light uppercase tracking-wide font-bold text-xs">Examples</p>
                    <ul>
                    @include('_partials.nav-links', ['links' => [
                        'examples/alerts' => 'Alerts',
                        'examples/buttons' => 'Buttons',
                        'examples/cards' => 'Cards',
                        'examples/forms' => 'Forms',
                        'examples/navigation' => 'Navigation',
                    ]])
                    </ul>
                </div>
            </nav>
        </div>
    </div>
    <div class="md:ml-80">
        <div class="fixed w-full z-20">
            <div class="pin-t bg-white md:hidden relative border-b border-grey-light h-12 flex items-center">
                  <div id="sidebar-open" class="absolute pin-l pin-y px-4 flex items-center">
                      <svg class="w-4 h-4 cursor-pointer text-grey" role="button" fill="#777" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                  </div>
                  <a href="/" class="mx-auto inline-flex items-center">
                      <svg class="w-8 h-8" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 11.1C15.3 3.9 19.8.3 27 .3c10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 27.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" transform="translate(5 16)" fill="url(#logoGradient)" fill-rule="evenodd"/></svg>
                  </a>
                  <div id="sidebar-close" class="hidden">
                    <div class="flex items-center absolute pin-r pin-y px-4">
                      <svg class="w-4 h-4 cursor-pointer text-grey" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/></svg>
                    </div>
                  </div>
            </div>
        </div>
        <div id="content" class="px-6 pb-8 pt-20 md:pt-16 w-full max-w-lg mx-auto">
            <div id="app" v-cloak>
                <div class="markdown">
                    <h1>{{ $page->title }}</h1>

                    @if($page->description)
                    <div class="text-xl text-slate-light mb-4">
                        {{ $page->description }}
                    </div>
                    @endif

                    @if($page->features)
                        @include('_partials.feature-badges', $page->features->all())
                    @endif

                    @yield('content')
                </div>
            </div>
            <script src="/js/app.js"></script>
        </div>
    </div>
</div>

<svg style="height: 0; width: 0; position: absolute; visibility: hidden;">
  <defs>
    <linearGradient x1="0%" y1="0%" y2="100%" id="logoGradient">
      <stop stop-color="#2383AE" offset="0%"></stop>
      <stop stop-color="#6DD7B9" offset="100%"></stop>
    </linearGradient>
  </defs>
</svg>
@endsection
