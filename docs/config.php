<?php

return [
    'baseUrl' => '',
    'production' => false,
    'collections' => [],
    'config' => json_decode(file_get_contents(__DIR__ . '/tailwind.json'), true),
    'version' => json_decode(file_get_contents(__DIR__ . '/../package.json'), true)['version'],
    'colors' => ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink'],
    'active' => function ($page, $path) {
        $pages = collect(array_wrap($page));

        return $pages->contains(function ($page) use ($path) {
            return str_contains($page->getPath(), $path);
        });
    },
];
