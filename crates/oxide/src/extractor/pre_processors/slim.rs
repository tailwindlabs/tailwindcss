use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::pre_processors::pre_processor::PreProcessor;
use crate::extractor::variant_machine::VariantMachine;

#[derive(Debug, Default)]
pub struct Slim;

impl PreProcessor for Slim {
    fn process(&self, content: &[u8]) -> Vec<u8> {
        let len = content.len();
        let mut result = content.to_vec();
        let mut cursor = cursor::Cursor::new(content);
        let mut bracket_stack = BracketStack::default();

        while cursor.pos < len {
            match cursor.curr {
                // Only replace `.` with a space if it's not surrounded by numbers. E.g.:
                //
                // ```diff
                // - .flex.items-center
                // +  flex items-center
                // ```
                //
                // But with numbers, it's allowed:
                //
                // ```diff
                // - px-2.5
                // + px-2.5
                // ```
                b'.' => {
                    // Don't replace dots with spaces when inside of any type of brackets, because
                    // this could be part of arbitrary values. E.g.: `bg-[url(https://example.com)]`
                    //                                                                       ^
                    if !bracket_stack.is_empty() {
                        cursor.advance();
                        continue;
                    }

                    // If the dot is surrounded by digits, we want to keep it. E.g.: `px-2.5`
                    // EXCEPT if it's followed by a valid variant that happens to start with a
                    // digit.
                    // E.g.: `bg-red-500.2xl:flex`
                    //                 ^^^
                    if cursor.prev.is_ascii_digit() && cursor.next.is_ascii_digit() {
                        let mut next_cursor = cursor.clone();
                        next_cursor.advance();

                        let mut variant_machine = VariantMachine::default();
                        if let MachineState::Done(_) = variant_machine.next(&mut next_cursor) {
                            result[cursor.pos] = b' ';
                        }
                    } else {
                        result[cursor.pos] = b' ';
                    }
                }

                // Handle Ruby syntax with `%w[]` arrays embedded in Slim directly.
                //
                // E.g.:
                //
                // ```
                // div [
                //   class=%w[bg-blue-500 w-10 h-10]
                // ]
                // ```
                b'%' if matches!(cursor.next, b'w' | b'W')
                    && matches!(cursor.input.get(cursor.pos + 2), Some(b'[' | b'(' | b'{')) =>
                {
                    result[cursor.pos] = b' '; // Replace `%`
                    cursor.advance();
                    result[cursor.pos] = b' '; // Replace `w`
                    cursor.advance();
                    result[cursor.pos] = b' '; // Replace `[` or `(` or `{`
                    bracket_stack.push(cursor.curr);
                    cursor.advance(); // Move past the bracket
                    continue;
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

                // In Slim the class name shorthand can be followed by a parenthesis. E.g.:
                //
                // ```slim
                // body.border-t-4.p-8(attr=value)
                //                    ^ Not part of the p-8 class
                // ```
                //
                // This means that we need to replace all these `(` and `)` with spaces to make
                // sure that we can extract the `p-8`.
                //
                // However, we also need to make sure that we keep the parens that are part of the
                // utility class. E.g.: `bg-(--my-color)`.
                b'(' if bracket_stack.is_empty() && !matches!(cursor.prev, b'-' | b'/') => {
                    result[cursor.pos] = b' ';
                    bracket_stack.push(cursor.curr);
                }

                b'(' | b'[' | b'{' => {
                    bracket_stack.push(cursor.curr);
                }

                b')' | b']' | b'}' if !bracket_stack.is_empty() => {
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
            (".bg-red-500.2xl:flex", " bg-red-500 2xl:flex"),
            (
                ".bg-red-500.2xl:flex.bg-green-200.3xl:flex",
                " bg-red-500 2xl:flex bg-green-200 3xl:flex",
            ),
            // Keep dots in strings
            (r#"div(class="px-2.5")"#, r#"div class="px-2.5")"#),
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
            ("<div id=\"px-2.5\"></div>", "<div id=\"px-2.5\"></div>"),
            (
                "<div id=\"px-2.5 bg-red-500 2xl:flex bg-green-200 3xl:flex\"></div>",
                "<div id=\"px-2.5 bg-red-500 2xl:flex bg-green-200 3xl:flex\"></div>",
            ),
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

    // https://github.com/tailwindlabs/tailwindcss/issues/17277
    #[test]
    fn test_class_shorthand_followed_by_parens() {
        let input = r#"
              body.border-t-4.p-8(class="\#{body_classes}" data-hotwire-native="\#{hotwire_native_app?}" data-controller="update-time-zone")
        "#;
        Slim::test_extract_contains(input, vec!["border-t-4", "p-8"]);

        // Additional test with CSS Variable shorthand syntax in the attribute itself because `(`
        // and `)` are not valid in the class shorthand version.
        //
        // Also included an arbitrary value including `(` and `)` to make sure that we don't
        // accidentally remove those either.
        let input = r#"
              body.p-8(class="bg-(--my-color) bg-(--my-color)/(--my-opacity) bg-[url(https://example.com)]")
        "#;
        Slim::test_extract_contains(
            input,
            vec![
                "p-8",
                "bg-(--my-color)",
                "bg-(--my-color)/(--my-opacity)",
                "bg-[url(https://example.com)]",
            ],
        );

        // Top-level class shorthand with parens
        let input = r#"
            div class="bg-(--my-color) bg-(--my-color)/(--my-opacity)"
        "#;
        Slim::test_extract_contains(
            input,
            vec!["bg-(--my-color)", "bg-(--my-color)/(--my-opacity)"],
        );
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

    #[test]
    fn test_arbitrary_code_followed_by_classes() {
        let input = r#"
            - i < 3
              .flex.items-center
        "#;
        Slim::test_extract_contains(input, vec!["flex", "items-center"]);
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17542
    #[test]
    fn test_embedded_ruby_percent_w_extraction() {
        let input = r#"
            div[
              class=%w[bg-blue-500 w-10 h-10]
            ]
            div[
              class=%w[w-10 bg-green-500 h-10]
            ]
        "#;

        let expected = r#"
            div 
              class=   bg-blue-500 w-10 h-10]
            ]
            div 
              class=   w-10 bg-green-500 h-10]
            ]
        "#;

        Slim::test(input, expected);
        Slim::test_extract_contains(input, vec!["bg-blue-500", "bg-green-500", "w-10", "h-10"]);
    }
}
