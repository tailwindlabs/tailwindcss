### Fixed

- Canonicalization: don't replace an arbitrary variant that has a selector list in `:is(…)` with a custom variant that emits different CSS (e.g. `[&:is(.foo,.bar)]:flex` → `[.foo,.bar]:flex`, not `foo:flex` with `@custom-variant foo (&.foo, .bar)`)
