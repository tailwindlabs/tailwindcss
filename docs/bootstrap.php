<?php

use Illuminate\Support\Str;
use Illuminate\Support\HtmlString;

/** @var $container \Illuminate\Container\Container */
/** @var $jigsaw \TightenCo\Jigsaw\Jigsaw */

function mix($path, $manifestDirectory = '')
{
    static $manifests = [];
    if (! Str::startsWith($path, '/')) {
        $path = "/{$path}";
    }
    if ($manifestDirectory && ! Str::startsWith($manifestDirectory, '/')) {
        $manifestDirectory = "/{$manifestDirectory}";
    }

    $manifestPath = public_path($manifestDirectory.'/mix-manifest.json');

    if (! isset($manifests[$manifestPath])) {
        if (! file_exists($manifestPath)) {
            throw new Exception('The Mix manifest does not exist.');
        }
        $manifests[$manifestPath] = json_decode(file_get_contents($manifestPath), true);
    }
    $manifest = $manifests[$manifestPath];
    if (! isset($manifest[$path])) {
        throw new InvalidArgumentException("Unable to locate Mix file: {$path}.");
    }
    return new HtmlString($manifestDirectory.$manifest[$path]);
}
