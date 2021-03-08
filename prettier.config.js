module.exports = {
  editorconfig: true,
  semi: false, // default: true
  singleQuote: true, // default: false
  printWidth: 80, // default: 100
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'flow',
      },
    },
  ],
}
