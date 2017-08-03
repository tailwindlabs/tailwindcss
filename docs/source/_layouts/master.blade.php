<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>{{ $page->title ? $page->title . ' - Tailwind CSS' : 'Tailwind CSS' }}</title>
        <link rel="stylesheet" href="/css/main.css">
        <script type="text/javascript" src="/js/prism.js" defer=""></script>
    </head>
    <body class="full-height flex-col">
        <header class="p-6 bg-primary">
            <a class="text-light text-lg" href="/">Tailwind CSS</a>
            <div class="text-primary-light text-xs">A utility-first CSS framework for rapid UI development</div>
        </header>
        <div class="flex flex-fill">
            <nav class="px-6 pb-6 bg-light-softer text-light text-sm leading-loose" style="flex: 0 0 12rem;">
                <div class="mt-6 mb-1 text-dark-softer text-uppercase text-xs">Introduction</div>
                <ul>
                    <li><a class="{{ $page->getUrl() === '/' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/">Welcome</a></li>
                    <li><a class="{{ $page->getUrl() === '/installation' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/installation">Installation</a></li>
                    <li><a class="{{ $page->getUrl() === '/principles' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/principles">Principles</a></li>
                </ul>
                <div class="mt-6 mb-1 text-dark-softer text-uppercase text-xs">Utilities</div>
                <ul>
                    <li><a class="{{ $page->getUrl() === '/backgrounds' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/backgrounds">Backgrounds</a></li>
                    <li><a class="{{ $page->getUrl() === '/borders' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/borders">Borders</a></li>
                    <li><a class="{{ $page->getUrl() === '/constrain' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/constrain">Constrain</a></li>
                    <li><a class="{{ $page->getUrl() === '/display' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/display">Display</a></li>
                    <li><a class="{{ $page->getUrl() === '/flexbox' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/flexbox">Flexbox</a></li>
                    <li><a class="{{ $page->getUrl() === '/grid' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/grid">Grid</a></li>
                    <li><a class="{{ $page->getUrl() === '/images' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/images">Images</a></li>
                    <li><a class="{{ $page->getUrl() === '/position' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/position">Position</a></li>
                    <li><a class="{{ $page->getUrl() === '/spacing' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/spacing">Spacing</a></li>
                    <li><a class="{{ $page->getUrl() === '/text' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/text">Text</a></li>
                    <li><a class="{{ $page->getUrl() === '/z-index' ? 'text-primary' : 'text-dark-soft' }}" href="{{ $page->baseUrl }}/z-index">Z-Index</a></li>
                </ul>
            </nav>
            <div class="p-7 constrain-lg markdown">
                @yield('content')
            </div>
        </div>
    </body>
</html>
