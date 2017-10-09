<?php

return [
    'baseUrl' => '',
    'production' => false,
    'collections' => [],
    'colors' => ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink'],
    'active' => function ($page, $path) {
        return str_contains($page->getPath(), $path);
    }
];
