#!/bin/bash

# Find all .js files
FILES=$(find ./src -regex ".*\.js")

# Compile with esbuild
esbuild $FILES --minify --outdir=lib --platform=node --format=cjs --target=node12

# A bit annoying, but let's copy the css file that we require
mkdir -p ./lib/plugins/css
cp ./src/plugins/css/preflight.css ./lib/plugins/css/preflight.css
