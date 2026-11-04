### Fixed

- Ignore `<!--` and `-->` between top-level rules in CSS instead of throwing or swallowing the next rule (e.g. `a { color: red } --> b { color: blue }`)
