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
<div class="bg-white border-b border-grey-lighter fixed pin-t pin-x z-10">
  <div class="relative container mx-auto px-6">
    <div class="flex py-3">
      <div>
        <svg class="w-12 h-12 mx-auto block" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 11.1C15.3 3.9 19.8.3 27 .3c10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 27.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" transform="translate(5 16)" fill="url(#logoGradient)" fill-rule="evenodd"></path></svg>
      </div>
    </div>
  </div>
</div>
<div class="container mx-auto px-6 pt-12">
  <div class="flex -mx-6">
    <div id="sidebar" class="hidden z-50 fixed pin-y pin-l overflow-y-scroll scrolling-touch w-4/5 flex-none border-r-2 border-grey-light lg:z-auto lg:static lg:overflow-visible lg:scrolling-auto lg:w-1/4 lg:block lg:border-0 lg:pin-none lg:px-6 xl:w-1/5">
      <div class="max-h-screen overflow-y-scroll" style="position: sticky; top: 0;">
        <div class="pt-16 py-8">
          <nav id="nav" class="text-base">
            @foreach ($page->navigation as $sectionName => $sectionItems)
            <div class="mb-8">
              <p class="mb-4 text-grey uppercase tracking-wide font-bold text-xs">{{ $sectionName }}</p>
              <ul>
                @foreach ($sectionItems as $name => $slugOrChildren)
                  @if (is_string($slugOrChildren))
                    <li class="mb-3"><a class="hover:underline {{ $page->active('/docs/' . $slugOrChildren) ? 'text-teal-dark font-semibold' : 'text-grey-darker' }}" href="{{ $page->baseUrl }}/docs/{{ $slugOrChildren }}">{{ $name }}</a></li>
                  @else
                    <li class="mb-3">
                      <a href="{{ $page->baseUrl }}/docs/{{ $slugOrChildren->first() }}" class="hover:underline block mb-2 {{ $page->anyChildrenActive($slugOrChildren) ? 'text-teal-dark font-semibold' : 'text-grey-darker' }}">{{ $name }}</a>
                      <ul class="pl-4 {{ $page->anyChildrenActive($slugOrChildren) ? 'block' : 'hidden' }}">
                      @foreach ($slugOrChildren as $title => $link)
                        <li class="mb-3">
                          <a class="hover:underline {{ $page->active('/docs/' . $link) ? 'text-teal-dark font-semibold' : 'text-grey-darker' }}" href="{{ $page->baseUrl }}/docs/{{ $link }}">
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
    </div>
    <div class="w-full lg:w-3/4 xl:w-3/5 px-6">
      <div class="fixed w-full z-20">
        <div class="pin-t bg-white md:hidden relative border-b border-grey-light h-12 flex items-center">
          <div id="sidebar-open" class="absolute pin-l pin-y px-4 flex items-center">
            <svg class="fill-current w-4 h-4 cursor-pointer text-grey" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
          </div>
          <a href="/" class="mx-auto inline-flex items-center">
            <svg class="w-8 h-8" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 11.1C15.3 3.9 19.8.3 27 .3c10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 27.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" transform="translate(5 16)" fill="url(#logoGradient)" fill-rule="evenodd"/></svg>
          </a>
          <div id="sidebar-close" class="hidden">
            <div class="flex items-center absolute pin-r pin-y px-4">
              <svg class="fill-current w-4 h-4 cursor-pointer text-grey" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/></svg>
            </div>
          </div>
        </div>
      </div>
      <div id="content" class="pb-8 pt-20 md:pt-16 px-0 w-full">
        <div id="app" v-cloak>
          <div class="markdown">
            <h1>{{ $page->title }}</h1>
            @if ($page->description)
              <div class="text-xl text-grey-dark mb-4">
                {{ $page->description }}
              </div>
            @endif
            @if ($page->features)
              @include('_partials.feature-badges', $page->features->all())
            @endif
            @yield('content')
          </div>
        </div>
        <script src="/js/app.js"></script>
      </div>
    </div>
    <div class="hidden xl:block xl:w-1/5 xl:px-6">
      <div style="position: sticky; top: 0;" class="pt-16">
        <ul class="list-reset mt-16 mb-20">
          <li class="mb-3"><a href="#" class="text-grey-dark hover:text-grey-darkest">Rounded corners</a></li>
          <li class="mb-3"><a href="#" class="text-grey-dark hover:text-grey-darkest">Pills and circles</a></li>
          <li class="mb-3"><a href="#" class="text-grey-dark hover:text-grey-darkest">No rounding</a></li>
          <li class="mb-3"><a href="#" class="text-grey-dark hover:text-grey-darkest">Rounding sides separately</a></li>
          <li class="mb-3"><a href="#" class="text-grey-dark hover:text-grey-darkest">Rounding corners separately</a></li>
          <li class="mb-3"><a href="#" class="text-grey-dark hover:text-grey-darkest">Responsive design</a></li>
          <li class="mb-3"><a href="#" class="text-grey-dark hover:text-grey-darkest">Customizing</a></li>
        </ul>
        <div class="pr-8">
          <div class="mb-2">
            <img src="https://user-images.githubusercontent.com/4323180/35755405-1b1f5c60-0835-11e8-9146-db406c806cf4.png">
          </div>
          <p class="text-sm text-grey-darkest leading-tight mb-2">It's teamwork, but simpler, more pleasant and more productive.</p>
          <p class="text-xs text-grey-dark">ads via Carbon</p>
        </div>
      </div>
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

@push('scripts')
@if ($page->production)
  <!-- Algolia DocSearch  -->
  <script type="text/javascript" src="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js"></script>
  <script type="text/javascript">
    docsearch({
      apiKey: '3df93446658cd9c4e314d4c02a052188',
      indexName: 'tailwindcss',
      inputSelector: '#docsearch',
    });
  </script>
@endif
@endpush
