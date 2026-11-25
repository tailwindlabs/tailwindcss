### Fixed

- Upgrade: Do not migrate a string that names a union member, like `{ kind: 'ring' }`, `case 'ring':` or `type Shape = 'ring' | 'circle'`
