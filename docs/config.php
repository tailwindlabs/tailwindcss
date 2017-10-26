<?php

return [
    'baseUrl' => '',
    'production' => false,
    'collections' => [],
    'config' => json_decode(file_get_contents(__DIR__ . '/tailwind.json'), true),
    'colors' => ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink'],
    'active' => function ($page, $path) {
        return str_contains($page->getPath(), $path);
    }
];
