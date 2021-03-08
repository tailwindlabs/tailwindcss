module.exports = {
  editorconfig: true, // Read .editorconfig
  // These settings are handled in .editorconfig:
  // tabWidth: 2, // indent_size = 2
  // useTabs: false, // indent_style = space
  // endOfLine: 'lf', // end_of_line = lf
  semi: false, // default: true
  singleQuote: true, // default: false
  printWidth: 80, // default: 100
  trailingComma: 'es5',
  bracketSpacing: true,
  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'flow',
      },
    },
  ],
}
