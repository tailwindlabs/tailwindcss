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
  <title>{{ $page->title ? $page->title . ' - Tailwind CSS' : 'Tailwind CSS - A Utility-First CSS Framework for Rapid UI Development' }}</title>
  <meta name="theme-color" content="#ffffff">
  @yield('meta')
  <link rel="stylesheet" href="https://use.typekit.net/iqy1okj.css">
  <link rel="stylesheet" href="{{ mix('/css/main.css') }}">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css">
  <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
  @stack('headScripts')
</head>
<body data-sidebar-visible="true" class="font-sans font-normal text-black leading-normal">

@yield('body')

@if ($page->production)
  <!-- Google Analytics  -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-109068504-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-109068504-1');
  </script>
@endif

@stack('scripts')

</body>
</html>
