### Fixed

- Don't add whitespace around math operators inside quoted strings in arbitrary values (e.g. `content-['(min(1,2))']` no longer outputs `"(min(1, 2))"`)
