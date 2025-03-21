use crate::cursor;
use crate::extractor::bracket_stack::BracketStack;
use crate::extractor::machine::{Machine, MachineState};
use crate::extractor::pre_processors::pre_processor::PreProcessor;
use crate::extractor::variant_machine::VariantMachine;

#[derive(Debug, Default)]
pub struct Pug;

impl PreProcessor for Pug {
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

                // In Pug the class name shorthand can be followed by a parenthesis. E.g.:
                //
                // ```pug
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
    use super::Pug;
    use crate::extractor::pre_processors::pre_processor::PreProcessor;

    #[test]
    fn test_pug_pre_processor() {
        for (input, expected) in [
            // Convert dots to spaces
            ("div.flex.bg-red-500", "div flex bg-red-500"),
            (".flex.bg-red-500", " flex bg-red-500"),
            // Keep dots in strings
            (r#"div(class="px-2.5")"#, r#"div class="px-2.5")"#),
            // Nested brackets
            (
                "bg-[url(https://example.com/?q=[1,2])]",
                "bg-[url(https://example.com/?q=[1,2])]",
            ),
            // Classes in HTML attributes
            (r#"<div id="px-2.5"></div>"#, r#"<div id="px-2.5"></div>"#),
        ] {
            Pug::test(input, expected);
        }
    }

    #[test]
    fn test_strings_only_occur_when_nested() {
        let input = r#"
            p.mt-2.text-xl
              div The quote in the next word, can't be the start of a string

            h3.mt-24.text-center.text-4xl.font-bold.italic
              div The classes above should be extracted
        "#;

        Pug::test_extract_contains(
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
        Pug::test_extract_contains(input, vec!["flex", "items-center"]);
    }

    // https://github.com/tailwindlabs/tailwindcss/issues/17313
    #[test]
    fn test_class_shorthand_followed_by_parens() {
        let input = r#"
            .text-sky-600.bg-neutral-900(title="A tooltip") This div has an HTML attribute.
        "#;
        Pug::test_extract_contains(input, vec!["text-sky-600", "bg-neutral-900"]);

        // Additional test with CSS Variable shorthand syntax in the attribute itself because `(`
        // and `)` are not valid in the class shorthand version.
        //
        // Also included an arbitrary value including `(` and `)` to make sure that we don't
        // accidentally remove those either.
        let input = r#"
            .p-8(class="bg-(--my-color) bg-(--my-color)/(--my-opacity) bg-[url(https://example.com)]")
        "#;
        Pug::test_extract_contains(
            input,
            vec![
                "p-8",
                "bg-(--my-color)",
                "bg-(--my-color)/(--my-opacity)",
                "bg-[url(https://example.com)]",
            ],
        );
    }
}
