### Fixed

- Upgrade: Do not migrate a string that names a union member or sits in a sentence, like `{ kind: 'ring' }`, `case 'ring':`, `type Shape = 'ring' | 'circle'` or `title="Add a shadow to the card."`
