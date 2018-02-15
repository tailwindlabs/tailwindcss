---
extends: _layouts.documentation
title: "Layouts"
description: null
---

@include('_partials.work-in-progress-example')

## Simple

@component('_partials.code-sample')
<!doctype html>
<html>
    <head>
        <title>Your page!</title>
        <!--<link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">-->
    </head>
    <body class="pb-12">
        <header class="container mx-auto px-4 py-6 border-b border-grey">
            <a href="/" class="font-bold">Your site!</a>
        </header>

        <div class="container mx-auto px-4 py-8">
            <div class="row">
                Welcome!
            </div>
        </div>

        <footer class="container mx-auto px-4  py-6 border-t border-grey text-center">
            <p>&copy; You!</p>
        </footer>
    </body>
</html>
@endcomponent
