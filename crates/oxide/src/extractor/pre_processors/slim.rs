use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::pre_processors::pre_processor::PreProcessor;

#[derive(Debug, Default)]
pub struct Slim;

impl PreProcessor for Slim {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);
        let mut bracket_stack = BracketStack::default();
        let mut line_start_pos = 0x00;

        while cursor.pos < len {
            match cursor.curr {
                b'\n' => {
                    line_start_pos = cursor.pos + 1;
                }

                // Line indicators:
                //
                // > Verbatim text with trailing white space '
                // > See: https://github.com/slim-template/slim?tab=readme-ov-file#verbatim-text-with-trailing-white-space-
                b'\''
                    if cursor.input[line_start_pos..cursor.pos]
                        .iter()
                        .all(|x| x.is_ascii_whitespace()) =>
                {
                    // Do not treat the `'` as a string
                }

                // Consume strings as-is
                b'\'' | b'"' if !bracket_stack.is_empty() => {
                    let len = cursor.input.len();
                    let end_char = cursor.curr;

                    cursor.advance();

                    while cursor.pos < len {
                        match cursor.curr {
                            // Escaped character, skip ahead to the next character
                            b'\\' => cursor.advance_twice(),

                            // End of the string
                            b'\'' | b'"' if cursor.curr == end_char => break,

                            // Everything else is valid
                            _ => cursor.advance(),
                        };
                    }
                }

                // Replace dots with spaces
                b'.' if bracket_stack.is_empty() => {
                    result[cursor.pos] = b' ';
                }

                // Any `[` preceded by an alphanumeric value will not be part of a candidate.
                //
                // E.g.:
                //
                // ```
                //  .text-xl.text-red-600[
                //                       ^ not part of the `text-red-600` candidate
                //    data-foo="bar"
                //  ]
                //    | This line should be red
                // ```
                //
                // We know that `-[` is valid for an arbitrary value and that `:[` is valid as a
                // variant. However `[color:red]` is also valid, in this case `[` will be preceded
                // by nothing or a boundary character.
                // Instead of listing all boundary characters, let's list the characters we know
                // will be invalid instead.
                b'[' if bracket_stack.is_empty()
                    && matches!(cursor.prev, b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9') =>
                {
                    result[cursor.pos] = b' ';
                    bracket_stack.push(cursor.curr);
                }

                b'(' | b'[' | b'{' | b'<' => {
                    bracket_stack.push(cursor.curr);
                }

                b')' | b']' | b'}' | b'>' if !bracket_stack.is_empty() => {
                    bracket_stack.pop(cursor.curr);
                }

                // Consume everything else
                _ => {}
            };

            cursor.advance();
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::Slim;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_slim_pre_processor() {
        for (input, expected) in [
            // Convert dots to spaces
            ("div.flex.bg-red-500", "div flex bg-red-500"),
            (".flex.bg-red-500", " flex bg-red-500"),
            // Keep dots in strings
            (r#"div(class="px-2.5")"#, r#"div(class="px-2.5")"#),
            // Replace top-level `(a-z0-9)[` with `$1 `. E.g.: `.flex[x]` -> `.flex x]`
            (".text-xl.text-red-600[", " text-xl text-red-600 "),
            // But keep important brackets:
            (".text-[#0088cc]", " text-[#0088cc]"),
            // Arbitrary value and arbitrary modifier
            (
                ".text-[#0088cc].bg-[#0088cc]/[20%]",
                " text-[#0088cc] bg-[#0088cc]/[20%]",
            ),
            // Start of arbitrary property
            ("[color:red]", "[color:red]"),
            // Arbitrary container query
            ("@[320px]:flex", "@[320px]:flex"),
            // Nested brackets
            (
                "bg-[url(https://example.com/?q=[1,2])]",
                "bg-[url(https://example.com/?q=[1,2])]",
            ),
            // Nested brackets, with "invalid" syntax but valid due to nesting
            ("content-['50[]']", "content-['50[]']"),
            // Escaped string
            ("content-['a\'b\'c\'']", "content-['a\'b\'c\'']"),
            // Classes in HTML attributes
            (r#"<div id="px-2.5"></div>"#, r#"<div id="px-2.5"></div>"#),
        ] {
            Slim::test(input, expected);
        }
    }

    #[test]
    fn test_nested_slim_syntax() {
        let input = r#"
            .text-black[
              data-controller= ['foo', ('bar' if rand.positive?)].join(' ')
            ]
              .bg-green-300
                | BLACK on GREEN - OK

              .bg-red-300[
                data-foo= 42
              ]
                | Should be BLACK on RED - FAIL
        "#;

        let expected = r#"
             text-black 
              data-controller= ['foo', ('bar' if rand.positive?)].join(' ')
            ]
               bg-green-300
                | BLACK on GREEN - OK

               bg-red-300 
                data-foo= 42
              ]
                | Should be BLACK on RED - FAIL
        "#;

        Slim::test(input, expected);
        Slim::test_extract_contains(input, vec!["text-black", "bg-green-300", "bg-red-300"]);
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17081
    // https://github.com/slim-template/slim?tab=readme-ov-file#verbatim-text-with-trailing-white-space-
    #[test]
    fn test_single_quotes_to_enforce_trailing_whitespace() {
        let input = r#"
            div
              'A single quote enforces trailing white space
              = 1234

            .text-red-500.text-3xl
              | This text should be red
        "#;

        let expected = r#"
            div
              'A single quote enforces trailing white space
              = 1234

             text-red-500 text-3xl
              | This text should be red
        "#;

        Slim::test(input, expected);
        Slim::test_extract_contains(input, vec!["text-red-500", "text-3xl"]);
    }

    #[test]
    fn test_strings_only_occur_when_nested() {
        let input = r#"
            p.mt-2.text-xl
              | The quote in the next word, can't be the start of a string

            h3.mt-24.text-center.text-4xl.font-bold.italic
              | The classes above should be extracted
        "#;

        Slim::test_extract_contains(
            input,
            vec![
                // First paragraph
                "mt-2",
                "text-xl",
                // second paragraph
                "mt-24",
                "text-center",
                "text-4xl",
                "font-bold",
                "italic",
            ],
        );
    }
}
