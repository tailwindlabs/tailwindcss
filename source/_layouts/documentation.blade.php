@extends('_layouts.master')

@section('meta')
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@tailwindcss">
<meta name="twitter:title" content="{{ $page->title ? $page->title . ' - Tailwind CSS' : 'Tailwind CSS - A Utility-First CSS Framework for Rapid UI Development' }}">
<meta name="twitter:description" content="{{ $page->description ? $page->description : 'Documentation for the Tailwind CSS framework.' }}">
<meta name="twitter:image" content="https://tailwindcss.com/img/tailwind-square.png">
<meta name="twitter:creator" content="@tailwindcss">
<meta property="og:url" content="https://tailwindcss.com/" />
<meta property="og:type" content="article" />
<meta property="og:title" content="{{ $page->title ? $page->title . ' - Tailwind CSS' : 'Tailwind CSS - A Utility-First CSS Framework for Rapid UI Development' }}" />
<meta property="og:description" content="{{ $page->description ? $page->description : 'Documentation for the Tailwind CSS framework.' }}" />
<meta property="og:image" content="https://tailwindcss.com/img/twitter-card.png" />
@endsection

@push('headScripts')
<script src="{{ mix('/js/nav.js') }}"></script>
@endpush

@section('body')

{{-- Top nav --}}
<div class="flex bg-white border-b border-grey-lighter fixed pin-t pin-x z-100 h-16 items-center">
  <div class="w-full max-w-screen-xl relative mx-auto px-6">
    <div class="flex items-center -mx-6">

      {{-- Logo section --}}
      <div class="lg:w-1/4 xl:w-1/5 pl-6 pr-6 lg:pr-8">
        <div class="flex items-center">
          <a href="/" class="block lg:mr-4">
            <svg class="w-8 h-8 lg:w-12 lg:h-12 block" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 11.1C15.3 3.9 19.8.3 27 .3c10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 27.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" transform="translate(5 16)" fill="url(#logoGradient)" fill-rule="evenodd"></path></svg>
          </a>
          <a href="https://github.com/tailwindcss/tailwindcss/releases" class="hidden lg:block font-semibold text-lg text-grey hover:text-grey-darker">
            v{{ $page->version }}
          </a>
        </div>
      </div>

      <div class="flex flex-grow items-center lg:w-3/4 xl:w-4/5">

        {{-- Search section --}}
        <div class="w-full lg:px-6 lg:w-3/4 xl:px-12">
          <div class="relative">
            <input id="docsearch" class="transition focus:outline-0 border border-transparent focus:bg-white focus:border-grey-light placeholder-grey-darkest rounded bg-grey-lighter py-2 pr-4 pl-10 block w-full appearance-none leading-normal" type="text" placeholder="Search the docs">
            <div class="pointer-events-none absolute pin-y pin-l pl-3 flex items-center">
              <svg class="fill-current pointer-events-none text-grey-dark w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/></svg>
            </div>
          </div>
        </div>


        <div id="sidebar-open" class="flex px-6 items-center lg:hidden">
          <svg class="fill-current w-4 h-4 cursor-pointer text-grey" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </div>


        <div id="sidebar-close" class="hidden flex px-6 items-center lg:hidden">
          <svg class="fill-current w-4 h-4 cursor-pointer text-grey" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/></svg>
        </div>

        {{-- Links section --}}
        <div class="hidden lg:block lg:w-1/4 px-6">
          <div class="flex justify-start items-center text-grey">
            <a class="block flex items-center hover:text-grey-darker mr-6" href="https://github.com/tailwindcss/tailwindcss">
              <svg class="fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>GitHub</title><path d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0"/></svg>
            </a>
            <a class="block flex items-center hover:text-grey-darker mr-6" href="https://twitter.com/tailwindcss">
              <svg class="fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Twitter</title><path d="M6.29 18.25c7.55 0 11.67-6.25 11.67-11.67v-.53c.8-.59 1.49-1.3 2.04-2.13-.75.33-1.54.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27c-.8.48-1.68.81-2.6 1a4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.3 4.1 4.1 0 0 0 1.27 5.49C2.01 8.2 1.37 8.03.8 7.7v.05a4.1 4.1 0 0 0 3.3 4.03 4.1 4.1 0 0 1-1.86.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 0 16.4a11.62 11.62 0 0 0 6.29 1.84"/></svg>
            </a>
            <a class="block flex items-center hover:text-grey-darker" href="https://join.slack.com/t/tailwindcss/shared_invite/enQtMjc2NTA1NTg0NTEyLTY4ZTg1YWFjM2NjMTRkMmNkMTA4MGNiZTFmNDYyYTJhNjNkY2QxODQwODE4MWRiZDFlNzdmOGI0MmQ1M2EzZmQ">
              <svg class="fill-current w-5 h-5" viewBox="0 0 126 126" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Slack</title><g><path d="M68.186 51.784l-16.688 5.59 5.399 16.12 16.688-5.59-5.399-16.12z"/><path fill-rule="evenodd" d="M45.343 5.243c43-12.9 61.6-2.9 74.5 40.1 12.9 43 2.9 61.6-40.1 74.5-43 12.9-61.6 2.9-74.5-40.1-12.9-43-2.9-61.6 40.1-74.5zm44.7 70.7l8.1-2.7c3.4-1.1 5.2-4.8 4.1-8.2-1.1-3.4-4.8-5.2-8.2-4.1l-8.1 2.7-5.4-16.1 8.1-2.7c3.4-1.1 5.2-4.8 4.1-8.2-1.1-3.4-4.8-5.2-8.2-4.1l-8.1 2.7-2.8-8.4c-1.1-3.4-4.8-5.2-8.2-4.1-3.4 1.1-5.2 4.8-4.1 8.2l2.8 8.4-16.7 5.6-2.8-8.4c-1.1-3.4-4.8-5.2-8.2-4.1-3.4 1.1-5.2 4.8-4.1 8.2l2.8 8.4-8.1 2.7c-3.4 1.1-5.2 4.8-4.1 8.2.9 2.6 3.4 4.3 6 4.4.7.1 1.5-.1 2.2-.3l8.1-2.7 5.4 16.1-8.1 2.7c-3.4 1.1-5.2 4.8-4.1 8.2.9 2.6 3.4 4.3 6 4.4.7.1 1.5-.1 2.2-.3l8.1-2.7 2.8 8.4c.9 2.6 3.4 4.3 6 4.4.7.1 1.5-.1 2.2-.3 3.4-1.1 5.2-4.8 4.1-8.2l-2.8-8.4 16.7-5.6 2.8 8.4c.9 2.6 3.4 4.3 6 4.4.7.1 1.5-.1 2.2-.3 3.4-1.1 5.2-4.8 4.1-8.2l-2.8-8.4z"/></g></svg>
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
{{-- /Top nav --}}


{{-- Main container --}}
<div class="w-full max-w-screen-xl mx-auto px-6">
  <div class="lg:flex -mx-6">

    {{-- Side nav --}}
    <div id="sidebar" class="hidden absolute z-90 top-16 bg-white w-full border-b -mb-16 lg:-mb-0 lg:static lg:bg-transparent lg:border-b-0 lg:pt-0 lg:w-1/4 lg:block lg:border-0 xl:w-1/5">
      <div class="px-6 pt-6 overflow-y-scroll lg:block lg:sticky lg:top-16 lg:py-12 lg:pl-6 lg:pr-8 lg:h-(screen-16) lg:max-h-(screen-16)">

        <nav id="nav" class="text-base lg:text-sm">
          @foreach ($page->navigation as $sectionName => $sectionItems)
          <div class="mb-8">
            <p class="mb-3 lg:mb-2 text-grey uppercase tracking-wide font-bold text-sm lg:text-xs">{{ $sectionName }}</p>
            <ul>
              @foreach ($sectionItems as $name => $slugOrChildren)
                @if (is_string($slugOrChildren))
                  <li class="mb-3 lg:mb-2"><a class="hover:underline {{ $page->active('/docs/' . $slugOrChildren) ? 'text-teal-dark font-semibold' : 'text-grey-darkest' }}" href="{{ $page->baseUrl }}/docs/{{ $slugOrChildren }}">{{ $name }}</a></li>
                @else
                  <li class="mb-3 lg:mb-2">
                    <a href="{{ $page->baseUrl }}/docs/{{ $slugOrChildren->first() }}" class="hover:underline block mb-3 lg:mb-2 {{ $page->anyChildrenActive($slugOrChildren) ? 'text-teal-dark font-semibold' : 'text-grey-darkest' }}">{{ $name }}</a>
                    <ul class="pl-4 {{ $page->anyChildrenActive($slugOrChildren) ? 'block' : 'hidden' }}">
                    @foreach ($slugOrChildren as $title => $link)
                      <li class="mb-3 lg:mb-2">
                        <a class="hover:underline {{ $page->active('/docs/' . $link) ? 'text-teal-dark font-semibold' : 'text-grey-darkest' }}" href="{{ $page->baseUrl }}/docs/{{ $link }}">
                          {{ $title }}
                        </a>
                      </li>
                    @endforeach
                    </ul>
                  </li>
                @endif
              @endforeach
            </ul>
          </div>
          @endforeach
        </nav>
      </div>
    </div>
    {{-- /Side nav --}}

    {{-- Right content/TOC pane --}}
    <div class="min-h-screen w-full lg:w-3/4 xl:w-4/5">

      {{-- "Turbolinks" --}}
      <div id="content">

        {{-- Vue-enabled area --}}
        <div id="app" class="flex" v-cloak>

          {{-- Main content area --}}
          <div class="pt-24 pb-8 lg:pt-28 w-full">
            <div class="markdown mb-6 px-6 max-w-lg mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:px-12 xl:w-3/4">
              <h1>{{ $page->title }}</h1>
              @if ($page->description)
                <div class="text-xl text-grey-dark mb-4">
                  {{ $page->description }}
                </div>
              @endif
            </div>
            <div class="flex">
              <div class="markdown px-6 xl:px-12 w-full max-w-lg mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
                @yield('content')
              </div>

              {{-- Table of contents --}}
              <div class="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
                {{-- <div class="px-6 pt-6 overflow-y-scroll lg:block lg:sticky lg:top-16 lg:py-12 lg:pl-6 lg:pr-8 lg:max-h-(screen-16)"> --}}
                <div class="flex flex-col justify-between overflow-y-scroll sticky top-16 max-h-(screen-16) pt-12 pb-4 -mt-12">
                  <table-of-contents class="mb-8"></table-of-contents>
                  <div id="ad"></div>
                </div>
              </div>
              {{-- /Table of contents --}}

            </div>
          </div>
          {{-- /Main content area --}}


        </div>
        {{-- /Vue-enabled area --}}

        <script src="/js/app.js"></script>
      </div>
      {{-- /"Turbolinks" --}}


    </div>
    {{-- /Right content/TOC pane --}}

  </div>
</div>
{{-- /Main container --}}

<svg style="height: 0; width: 0; position: absolute; visibility: hidden;">
  <defs>
    <linearGradient x1="0%" y1="0%" y2="100%" id="logoGradient">
      <stop stop-color="#2383AE" offset="0%"></stop>
      <stop stop-color="#6DD7B9" offset="100%"></stop>
    </linearGradient>
  </defs>
</svg>
@endsection

@push('scripts')
{{-- @if ($page->production) --}}
  <!-- Algolia DocSearch  -->
  <script type="text/javascript" src="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js"></script>
  <script type="text/javascript">
    docsearch({
      apiKey: '3df93446658cd9c4e314d4c02a052188',
      indexName: 'tailwindcss',
      inputSelector: '#docsearch',
    });
  </script>
{{-- @endif --}}
@endpush
