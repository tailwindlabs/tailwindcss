<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>{{ isset($title) ? $title . ' - Tailwind CSS' : 'Tailwind CSS' }}</title>
        <link rel="stylesheet" href="/css/main.css">
        <script type="text/javascript" src="/js/prism.js" defer=""></script>
    </head>
    <body class="full-height flex-col">
        <header class="p-6 bg-primary">
            <div class="text-light text-lg">Tailwind CSS</div>
            <div class="text-primary-light text-xs">A utility-first CSS framework for rapid UI development</div>
        </header>
        <div class="flex flex-fill">
            <nav class="px-6 pb-6 bg-light-softer text-light text-sm text-dark-soft leading-loose" style="flex: 0 0 12rem;">
                <div class="mt-6 mb-1 text-dark-softer text-uppercase text-xs">Introduction</div>
                <ul>
                    <li><a href="{{ $page->baseUrl }}/">Welcome</a></li>
                    <li><a href="{{ $page->baseUrl }}/installation">Installation</a></li>
                    <li><a href="{{ $page->baseUrl }}/principles">Principles</a></li>
                </ul>
                <div class="mt-6 mb-1 text-dark-softer text-uppercase text-xs">Utilities</div>
                <ul>
                    <li><a href="{{ $page->baseUrl }}/backgrounds">Backgrounds</a></li>
                    <li><a href="{{ $page->baseUrl }}/borders">Borders</a></li>
                    <li><a href="{{ $page->baseUrl }}/constrain">Constrain</a></li>
                    <li><a href="{{ $page->baseUrl }}/display">Display</a></li>
                    <li><a href="{{ $page->baseUrl }}/flex">Flex</a></li>
                    <li><a href="{{ $page->baseUrl }}/grid">Grid</a></li>
                    <li><a href="{{ $page->baseUrl }}/images">Images</a></li>
                    <li><a href="{{ $page->baseUrl }}/position">Position</a></li>
                    <li><a href="{{ $page->baseUrl }}/spacing">Spacing</a></li>
                    <li><a href="{{ $page->baseUrl }}/text">Text</a></li>
                    <li><a href="{{ $page->baseUrl }}/z-index">Z-Index</a></li>
                </ul>
            </nav>
            <div class="p-7 constrain-lg">
                @yield('body')
            </div>
        </div>
    </body>
</html>
