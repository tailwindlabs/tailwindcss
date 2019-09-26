<?php

use Illuminate\Support\Collection;

return [
    'baseUrl' => '',
    'production' => false,
    'collections' => [],
    'docSearchVersion' => 'v1',
    'config' => json_decode(file_get_contents(__DIR__ . '/tailwind.json'), true),
    'version' => json_decode(file_get_contents(__DIR__ . '/node_modules/tailwindcss/package.json'), true)['version'],
    'colors' => ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink'],
    'categoryName' => function ($page) {
        if (starts_with($page->getPath(), '/docs')) {
            return 'Documentation';
        } elseif (starts_with($page->getPath(), '/components')) {
            return 'Components';
        } elseif (starts_with($page->getPath(), '/course') || starts_with($page->getPath(), '/screencasts')) {
            return 'Screencasts';
        } elseif (starts_with($page->getPath(), '/resources')) {
            return 'Resources';
        } elseif (starts_with($page->getPath(), '/community')) {
            return 'Community';
        }
    },
    'active' => function ($page, $link) {
        $path = $link instanceof Collection ? $link['url'] : $link;
        
        if ($path === '/course/coming-soon') {
            return false;
        }

        return str_is($page->getPath(), $path);
    },
    'categoryActive' => function ($page, $link) {
        $path = $link instanceof Collection ? $link['url'] : $link;

        return starts_with($page->getPath(), $path);
    },
    'getLink' => function ($page, $link) {
        return $link instanceof Collection ? $link['url'] : $link;
    },
    'isExternal' => function ($page, $link) {
        return $link instanceof Collection ? $link['external'] : false;
    },
    'anyChildrenActive' => function ($page, $children) {
        return $children->contains(function ($link) use ($page) {
            return $page->getPath() == '/docs/'. $link;
        });
    },
    'navigation' => require_once('navigation.php'),
];
