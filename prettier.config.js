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

/* .editorconfig

root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
*/
