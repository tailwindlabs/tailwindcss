### Fixed

- Canonicalization: don't replace an arbitrary variant with `:is(…)` around a selector list, like `[&:is(.foo,.bar)]`, with a custom variant that emits different CSS
